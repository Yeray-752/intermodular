import { useState, useRef, useEffect } from 'react'; // 1. Importa useEffect
import '../App.css'
import Footer from '../components/Footer'
import Header from '../components/Header'
import TableProducts from '../components/TableProducts'
import { useTranslation } from 'react-i18next';

function App() {
  const { t, i18n } = useTranslation('market');
  const [search, setSearch] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState("");
  
  // 2. Nuevo estado para los productos de la base de datos
  const [listaProductos, setListaProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const categorias = t("categories", { returnObjects: true }) || [];

  // 3. useEffect para traer los datos cuando cargue la página o cambie el idioma
  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3000/api/products', {
      headers: {
        // Esto le dice a tu languageMiddleware qué idioma queremos
        'accept-language': i18n.language 
      }
    })
      .then(res => res.json())
      .then(data => {
        setListaProductos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando productos:", err);
        setLoading(false);
      });
  }, [i18n.language]); // Se repite si el usuario cambia el idioma

  const manejarClickCategoria = (nombreSeleccionado) => {
    setCategoriaActiva(categoriaActiva === nombreSeleccionado ? "" : nombreSeleccionado);
  };

  const scrollRef = useRef(null);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="grow">
        <div className="flex-col grow p-4 justify-items-center">
          <input
            className='input mt-6'
            type="search"
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
          />

          <h1 className='mt-10 font-bold text-2xl'>{t("categoriesTitle")}</h1>

          {/* ... (Tu código de navegación de categorías se mantiene igual) ... */}
          <nav className='space-x-1.5 mt-4 mb-5'>
             {/* Tu nav actual... */}
          </nav>

          <div className="lg:w-[1000px] 2xl:w-[1350px] pt-4 ">
            {loading ? (
              <div className="flex justify-center"><span className="loading loading-spinner loading-lg"></span></div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 justify-items-center">
                <TableProducts
                  search={search}
                  props={categoriaActiva}
                  productos={listaProductos} // Ahora pasamos el estado que viene de la DB
                />
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;