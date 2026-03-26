import { Router } from 'express';
import { registrarVehiculo, eliminarVehiculo, actualizarVehiculo, getVehiculos } from '../controllers/vehiculeController.js';
import puppeteer from 'puppeteer';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();

// Todas las rutas de vehículos suelen requerir estar logueado
router.use(verifyToken); 

router.get('/', getVehiculos);
router.post('/', registrarVehiculo);
router.put('/:matricula', actualizarVehiculo);
router.delete('/:matricula', eliminarVehiculo);

async function scrapeAutodoc(plate) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
    ],
  });

  try {
    const page = await browser.newPage();

    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, "webdriver", { get: () => undefined });
    });

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    );
    await page.setExtraHTTPHeaders({ "Accept-Language": "es-ES,es;q=0.9" });

    // ── Paso 1: Cargar autodoc.es ─────────────────────────────
    console.log("[Vehicle] Cargando autodoc.es...");
    await page.goto("https://www.autodoc.es", {
      waitUntil: "networkidle2",
      timeout: 90000,
    });

    // ── Paso 2: Aceptar cookies ───────────────────────────────
    try {
      await page.waitForFunction(
        () => Array.from(document.querySelectorAll("button")).some(b =>
          b.textContent.includes("Permitir todas las cookies") ||
          b.textContent.includes("Accept all cookies")
        ),
        { timeout: 6000 }
      );
      await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll("button")).find(b =>
          b.textContent.includes("Permitir todas las cookies") ||
          b.textContent.includes("Accept all cookies")
        );
        if (btn) btn.click();
      });
      console.log("[Vehicle] Cookies aceptadas");
      await new Promise(r => setTimeout(r, 1500));
    } catch (_) {
      console.log("[Vehicle] Sin banner de cookies");
    }

    // ── Paso 3: Interceptar respuesta AJAX ───────────────────
    let vehicleData = null;
    page.on("response", async (response) => {
      if (response.url().includes("search-number")) {
        try {
          const json = await response.json();
          if (json.carId) vehicleData = json;
        } catch (_) {}
      }
    });

    // ── Paso 4: Escribir matrícula ────────────────────────────
    await page.waitForSelector("#kba1", { timeout: 10000 });
    await page.click("#kba1", { clickCount: 3 });
    await page.type("#kba1", plate.toUpperCase(), { delay: 100 });
    console.log("[Vehicle] Matrícula escrita:", plate);
    

    // ── Paso 5: Pulsar botón Buscar ───────────────────────────
    await page.evaluate(() => {
      const input = document.querySelector("#kba1");
      let container = input?.parentElement;
      for (let i = 0; i < 5; i++) {
        const btns = Array.from(container?.querySelectorAll("button") || []);
        const buscar = btns.find(b =>
          b.textContent.trim().toLowerCase().includes("buscar") ||
          b.textContent.trim().toLowerCase().includes("search")
        );
        if (buscar) { buscar.click(); return; }
        container = container?.parentElement;
      }
      const allBtns = Array.from(document.querySelectorAll("button"));
      const buscar = allBtns.find(b => b.textContent.trim().toLowerCase() === "buscar");
      if (buscar) buscar.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // ── Paso 6: Esperar resultado ─────────────────────────────
    await Promise.race([
      page.waitForResponse(r => r.url().includes("search-number"), { timeout: 10000 }).catch(() => null),
      page.waitForNavigation({ waitUntil: "networkidle2", timeout: 10000 }).catch(() => null),
    ]);
    await new Promise(r => setTimeout(r, 2000));

    const currentUrl = page.url();
    console.log("[Vehicle] URL:", currentUrl);

    // ── Paso 7: Navegar a la página del vehículo ─────────────
    if (vehicleData?.carId) {
      await page.goto(
        `https://www.autodoc.es/recambios/car/${vehicleData.carId}`,
        { waitUntil: "networkidle2", timeout: 30000 }
      );
    } else if (currentUrl.includes("/recambios/") && !currentUrl.includes("search")) {
      console.log("[Vehicle] Navegó directo al vehículo");
    } else {
      await page.screenshot({ path: "debug.png" });
      throw new Error("No se pudo obtener el vehículo. Se guardó debug.png");
    }

    // ── Paso 8: Extraer y parsear todos los datos ─────────────
    console.log("[Vehicle] Extrayendo datos...");
    const raw = await page.evaluate(() => {
      const url = location.href;

      // carId desde la URL (el número después de la última carpeta antes del motor)
      const urlParts = url.split("/");
      const carSegment = urlParts.find(p => /^\d+-/.test(p)); // ej: "16684-1-8"
      const carId = carSegment ? parseInt(carSegment.split("-")[0]) : null;

      const title = document.title?.trim() || null;
      const h1 = document.querySelector("h1")?.textContent?.trim() || null;

      const breadcrumbs = Array.from(
        document.querySelectorAll(
          '[class*="breadcrumb"] a, [class*="breadcrumb"] span, nav a, ol li a, ol li span'
        )
      ).map(el => el.textContent.trim()).filter(t => t.length > 1);

      // Intentar JSON-LD
      let jsonLd = null;
      document.querySelectorAll('script[type="application/ld+json"]').forEach(s => {
        try {
          const d = JSON.parse(s.textContent);
          if (d["@type"] === "Car" || d.brand || d.model) jsonLd = d;
        } catch (_) {}
      });

      // Extraer specs de la tabla de características si existe
      const specs = {};
      document.querySelectorAll('[class*="spec"] tr, [class*="characteristic"] tr, table tr').forEach(row => {
        const cells = row.querySelectorAll("td, th");
        if (cells.length >= 2) {
          const key = cells[0].textContent.trim().toLowerCase();
          const val = cells[1].textContent.trim();
          if (key && val) specs[key] = val;
        }
      });

      return { url, carId, title, h1, breadcrumbs, jsonLd, specs };
    });

    // ── Parsear marca, modelo, año, etc. desde title/h1/url ──
    const parsed = parseVehicleInfo(raw, plate);
    console.log("[Vehicle] Datos extraídos:", JSON.stringify(parsed));

    return parsed;

  } finally {
    await browser.close();
  }
}

// ─────────────────────────────────────────────────────────────
// Parsear datos del vehículo desde los textos disponibles
// Ejemplo title: "Recambios Mazda 6 GG Berlina 1.8 120 cv Gasolina 2002"
// Ejemplo h1:    "Recambios MAZDA 6 Berlina (GG) 1.8 Gasolina 120cv / 88kW L829, año desde 2002 - 2007"
// Ejemplo url:   "mazda/6/6-gg/16684-1-8"
// ─────────────────────────────────────────────────────────────
function parseVehicleInfo(raw, plate) {
  const { url, carId, title, h1, breadcrumbs, jsonLd, specs } = raw;

  // Desde JSON-LD si existe
  if (jsonLd) {
    return {
      plate,
      carId: carId || jsonLd.carId || null,
      brand:    jsonLd.brand?.name || jsonLd.brand || null,
      model:    jsonLd.model || null,
      year:     jsonLd.vehicleModelDate || null,
      fuel:     jsonLd.fuelType || null,
      engine:   jsonLd.vehicleEngine?.engineDisplacement || null,
      power:    null,
      url,
      breadcrumbs,
    };
  }

  // Desde los breadcrumbs (suelen ser: Tienda > Fabricantes > MARCA > Modelo > Variante)
  // Filtramos los genéricos
  const crumbs = breadcrumbs.filter(b =>
    !b.toLowerCase().includes("tienda") &&
    !b.toLowerCase().includes("fabricante") &&
    !b.toLowerCase().includes("recambios para automóviles") &&
    b.length < 60
  );

  // Extraer marca del breadcrumb "Recambios MAZDA" → "MAZDA"
  const brandCrumb = crumbs.find(b => b.toLowerCase().startsWith("recambios "));
  const brandRaw = brandCrumb
    ? brandCrumb.replace(/recambios\s+/i, "").trim()
    : null;

  // Desde la URL: /recambios/mazda/6/6-gg/16684-1-8
  const urlMatch = url.match(/\/recambios\/([^/]+)\/([^/]+)\//);
  const brandFromUrl = urlMatch ? urlMatch[1] : null;
  const modelFromUrl = urlMatch ? urlMatch[2] : null;

  const brand = brandRaw || (brandFromUrl
    ? brandFromUrl.charAt(0).toUpperCase() + brandFromUrl.slice(1)
    : null);

  const model = modelFromUrl
    ? modelFromUrl.charAt(0).toUpperCase() + modelFromUrl.slice(1)
    : null;

  // Desde el title: "Recambios Mazda 6 GG Berlina 1.8 120 cv Gasolina 2002"
  // Extraer año (4 dígitos al final o cerca del final)
  const yearMatch = (title || "").match(/\b(19|20)\d{2}\b/g);
  const year = yearMatch ? yearMatch[yearMatch.length - 1] : null;

  // Extraer combustible
  const fuelMatch = (h1 || title || "").match(/\b(gasolina|diésel|diesel|híbrido|eléctrico|gas)\b/i);
  const fuel = fuelMatch ? fuelMatch[1].toLowerCase() : null;

  // Extraer cilindrada / motor (ej: 1.8, 2.0 TDI)
  const engineMatch = (h1 || title || "").match(/\b(\d+\.\d+(?:\s*\w+)?)\b/);
  const engine = engineMatch ? engineMatch[1] : null;

  // Extraer potencia (ej: 120 cv, 88 kW)
  const powerCv = (h1 || title || "").match(/(\d+)\s*cv/i);
  const powerKw = (h1 || title || "").match(/(\d+)\s*kw/i);
  const power = powerCv
    ? `${powerCv[1]} cv`
    : powerKw
    ? `${powerKw[1]} kW`
    : null;

  // Extraer año hasta (rango "2002 - 2007")
  const yearRangeMatch = (h1 || "").match(/desde\s+(\d{4})(?:\s*[-–]\s*(\d{4}))?/i);
  const yearFrom = yearRangeMatch ? yearRangeMatch[1] : year;
  const yearTo = yearRangeMatch ? yearRangeMatch[2] || null : null;

  // Variante / carrocería desde h1
  const variantMatch = (h1 || "").match(/(?:Berlina|Familiar|SUV|Coupé|Coupe|Cabrio|Furgón|Van|Kombi|Hatchback|Sedán|Sedan)/i);
  const bodyType = variantMatch ? variantMatch[0] : null;

  // Specs desde tabla si existen
  const specBrand    = specs["marca"] || specs["fabricante"] || null;
  const specModel    = specs["modelo"] || null;
  const specFuel     = specs["combustible"] || specs["tipo de combustible"] || null;
  const specPower    = specs["potencia"] || specs["potencia máxima"] || null;
  const specEngine   = specs["motor"] || specs["cilindrada"] || null;

  return {
    plate,
    carId,
    brand:    specBrand  || brand,
    model:    specModel  || model,
    yearFrom: yearFrom   || null,
    yearTo:   yearTo     || null,
    engine:   specEngine || engine,
    fuel:     specFuel   || fuel,
    power:    specPower  || power,
    bodyType,
    url,
    breadcrumbs,
    rawTitle: title,
    rawH1:    h1,
  };
}

// ── GET /api/vehicle/:plate ───────────────────────────────────
router.get("/:plate", async (req, res) => {
  const plate = req.params.plate.toUpperCase().replace(/[\s-]/g, "");
  console.log('matricula ')

  const valid = /^[0-9]{4}[A-Z]{3}$|^[A-Z]{1,2}[0-9]{4}[A-Z]{2}$/.test(plate);
  if (!valid) {
    return res.status(400).json({
      success: false,
      error: "Matrícula no válida. Formato esperado: 1234ABC",
    });
  }

  try {
    const data = await scrapeAutodoc(plate);
    return res.json({ success: true, data });
  } catch (err) {
    console.error("[Vehicle] Error:", err.message);
    const status = err.message.includes("no encontrada") ? 404 : 500;
    return res.status(status).json({ success: false, error: err.message });
  }
});

export default router;