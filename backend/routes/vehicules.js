import { Router } from 'express';
import { registrarVehiculo, eliminarVehiculo, actualizarVehiculo, getVehiculos } from '../controllers/vehiculeController.js';
import puppeteer from 'puppeteer';
import { verifyToken } from '../middlewares/auth.js';

import db from '../db.js';

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
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--disable-blink-features=AutomationControlled"
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
        } catch (_) { }
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
    
    // Esperamos a que la web procese la búsqueda inicial
    await new Promise(r => setTimeout(r, 2500));

    // ── Paso 5.5: Gestionar selector de vehículos (Pop-up de motor) ──
    // ── Paso 5.5: Gestionar selector de vehículos (Pop-up de motor) ──
    try {
      // Usamos el selector exacto del HTML que me pasaste
      const selectorPopUp = '.popup-sidebar--selector.open';
      const apareceSelector = await page.waitForSelector(selectorPopUp, { timeout: 6000 }).catch(() => null);

      if (apareceSelector) {
        console.log("[Vehicle] Pop-up detectado: Seleccionando la primera motorización...");

        await page.evaluate(() => {
          // Buscamos todos los contenedores de vehículos en la lista del pop-up
          const opciones = document.querySelectorAll('.popup-sidebar-selector-vehicle');
          
          if (opciones.length > 0) {
            // Hacemos clic en el primero. 
            // Clicamos el div con role="button" que envuelve el radio y el label.
            opciones[0].click();
          } else {
            // Fallback: si el clic en el div no funciona, buscamos el primer label
            const primerLabel = document.querySelector('.popup-sidebar-selector-vehicle__wrap');
            if (primerLabel) primerLabel.click();
          }
        });

        // Esperamos a que la web procese el clic y redirija
        console.log("[Vehicle] Opción seleccionada, esperando redirección...");
        await new Promise(r => setTimeout(r, 4000));
      }
    } catch (e) {
      console.log("[Vehicle] No se detectó el pop-up selector, continuando flujo normal.");
    }

    // ── Paso 6: Esperar resultado final ─────────────────────────────
    await Promise.race([
      page.waitForResponse(r => r.url().includes("search-number"), { timeout: 10000 }).catch(() => null),
      page.waitForNavigation({ waitUntil: "networkidle2", timeout: 10000 }).catch(() => null),
    ]);
    await new Promise(r => setTimeout(r, 2000));

    const currentUrl = page.url();
    console.log("[Vehicle] URL actual:", currentUrl);

    // ── Paso 7: Navegar a la página de recambios del vehículo ─────────────
    if (vehicleData?.carId) {
      await page.goto(
        `https://www.autodoc.es/recambios/car/${vehicleData.carId}`,
        { waitUntil: "networkidle2", timeout: 30000 }
      );
    } else if (currentUrl.includes("/recambios/") && !currentUrl.includes("search")) {
      console.log("[Vehicle] Ya estamos en la página del vehículo");
    } else {
      await page.screenshot({ path: "debug.png" });
      throw new Error("No se pudo identificar el vehículo tras la búsqueda. Revisa debug.png");
    }

    // ── Paso 8: Extracción de datos brutos ─────────────────────────────
    console.log("[Vehicle] Extrayendo datos de la página...");
    const raw = await page.evaluate(() => {
      const url = location.href;
      const urlParts = url.split("/");
      const carSegment = urlParts.find(p => /^\d+-/.test(p)); 
      const carId = carSegment ? parseInt(carSegment.split("-")[0]) : null;

      const title = document.title?.trim() || null;
      const h1 = document.querySelector("h1")?.textContent?.trim() || null;

      const breadcrumbs = Array.from(
        document.querySelectorAll('[class*="breadcrumb"] a, [class*="breadcrumb"] span, nav a, ol li a, ol li span')
      ).map(el => el.textContent.trim()).filter(t => t.length > 1);

      let jsonLd = null;
      document.querySelectorAll('script[type="application/ld+json"]').forEach(s => {
        try {
          const d = JSON.parse(s.textContent);
          if (d["@type"] === "Car" || d.brand || d.model) jsonLd = d;
        } catch (_) { }
      });

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

    return parseVehicleInfo(raw, plate);

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
      brand: jsonLd.brand?.name || jsonLd.brand || null,
      model: jsonLd.model || null,
      year: jsonLd.vehicleModelDate || null,
      fuel: jsonLd.fuelType || null,
      engine: jsonLd.vehicleEngine?.engineDisplacement || null,
      power: null,
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
  const specBrand = specs["marca"] || specs["fabricante"] || null;
  const specModel = specs["modelo"] || null;
  const specFuel = specs["combustible"] || specs["tipo de combustible"] || null;
  const specPower = specs["potencia"] || specs["potencia máxima"] || null;
  const specEngine = specs["motor"] || specs["cilindrada"] || null;

  return {
    plate,
    carId,
    brand: specBrand || brand,
    model: specModel || model,
    yearFrom: yearFrom || null,
    yearTo: yearTo || null,
    engine: specEngine || engine,
    fuel: specFuel || fuel,
    power: specPower || power,
    bodyType,
    url,
    breadcrumbs,
    rawTitle: title,
    rawH1: h1,
  };
}

// ── GET /api/vehicle/:plate ───────────────────────────────────
// ── GET /api/vehicle/:plate ───────────────────────────────────
router.post("/matricula/secreta", async (req, res) => {

 const { matricula: rawPlate } = req.body;
    const id_usuario = req.user.id; 

    if (!rawPlate) {
        return res.status(400).json({ message: "La matrícula es obligatoria" });
    }

    // 1. Limpieza y validación de matrícula
    const plate = rawPlate.trim().toUpperCase().replace(/[^0-9A-Z]/g, "");
    const valid = /^([0-9]{4}[A-Z]{3}|[A-Z]{1,2}[0-9]{4}[A-Z]{1,2})$/.test(plate);
    
    if (!valid) {
        return res.status(400).json({ message: "Formato de matrícula no válido" });
    }

    try {
        // 2. Ejecutar Scraper
        console.log(`[Scraper] Buscando: ${plate}`);
        const vehicleData = await scrapeAutodoc(plate);

        // 3. NORMALIZACIÓN DE COMBUSTIBLE (Para tu ENUM con Mayúsculas y Tildes)
        let fuelRaw = (vehicleData.fuel || "").toLowerCase();
        let combustibleFinal = 'Gasolina'; // Valor por defecto que existe en tu ENUM

        if (fuelRaw.includes('diesel') || fuelRaw.includes('gasóleo') || fuelRaw.includes('diésel')) {
            combustibleFinal = 'Diésel';
        } else if (fuelRaw.includes('gasolina')) {
            combustibleFinal = 'Gasolina';
        } else if (fuelRaw.includes('híbrido') || fuelRaw.includes('hybrid')) {
            combustibleFinal = 'Híbrido';
        } else if (fuelRaw.includes('eléctrico') || fuelRaw.includes('electric')) {
            combustibleFinal = 'Eléctrico';
        } else if (fuelRaw.includes('glp')) {
            combustibleFinal = 'GLP';
        } else if (fuelRaw.includes('gnc')) {
            combustibleFinal = 'GNC';
        }

        // 4. Limpieza de Motor (solo el número decimal, ej: 1.8)
        const motorLimpio = vehicleData.engine ? vehicleData.engine.match(/\d+\.\d+/)?.[0] : null;

        // 5. Query e Inserción
        const query = 'INSERT INTO Vehiculo (matricula, id_usuario, marca, modelo, año, motor, combustible) VALUES (?, ?, ?, ?, ?, ?, ?)';
        
        await db.execute(query, [
            plate, 
            id_usuario, 
            vehicleData.brand, 
            vehicleData.model, 
            vehicleData.yearFrom, 
            motorLimpio || vehicleData.engine, // Fallback si no hay decimal
            combustibleFinal
        ]);

        res.status(201).json({ 
            message: "Vehículo registrado correctamente",
            data: { matricula: plate, combustible: combustibleFinal } 
        });

    } catch (error) {
        console.error("[Error Registro]:", error.message);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "Esta matrícula ya está en tu garaje" });
        }
        res.status(500).json({ error: error.message });
    }
});

export default router;