import { useState, useRef, useEffect } from 'react';
import '../App.css';
import Footer from '../components/Footer';
import Header from '../components/Header';
import TableProducts from '../components/TableProducts';
import { useTranslation } from 'react-i18next';

function App() {
  const { t, i18n } = useTranslation('market');
  
  // Estados para datos de la API
  const [listaProductos, setListaProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  
  // Estados para filtros y UI
  const [search, setSearch] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState(null); // Ahora guardaremos el ID (int)
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef(null);

  // useEffect para cargar Categorías y Productos simultáneamente
  useEffect(() => {
    setLoading(true);
    
    const fetchDatos = async () => {
      try {
        const headers = { 'accept-language': i18n.language };
        
        // Lanzamos ambas peticiones a la vez
        const [resProd, resCat] = await Promise.all([
          fetch('http://localhost:3000/api/products', { headers }),
          fetch('http://localhost:3000/api/product_categories', { headers })
        ]);

        const dataProd = await resProd.json();
        const dataCat = await resCat.json();
        console.log(dataCat)

        setListaProductos(dataProd);
        setCategorias(dataCat);
      } catch (err) {
        console.error("Error cargando el mercado:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
  }, [i18n.language]);

  const manejarClickCategoria = (id) => {
    // Si haces clic en la que ya está activa, se desactiva (null)
    setCategoriaActiva(categoriaActiva === id ? null : id);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="grow">
        <div className="flex-col grow p-4 justify-items-center">
          
          {/* Barra de búsqueda */}
          <input
            className='input mt-6 input-bordered w-full max-w-md'
            type="search"
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
          />

          <h1 className='mt-10 font-bold text-2xl'>{t("categoriesTitle")}</h1>

          {/* Navegación de Categorías Dinámicas */}
          <nav className='space-x-1.5 mt-4 mb-5 w-full max-w-6xl'>
            <div className="relative justify-items-center group px-10">
              <div 
                ref={scrollRef} 
                className="flex overflow-x-auto gap-3 py-4 no-scrollbar scroll-smooth"
              >
                {categorias.map((cat) => (
                  <div key={cat.id} className="shrink-0">
                    <button
                      onClick={() => manejarClickCategoria(cat.id)}
                      className={`btn btn-sm md:btn-md rounded-full whitespace-nowrap transition-all ${
                        categoriaActiva === cat.id
                        ? "bg-orange-600 text-white border-orange-600 hover:bg-orange-700"
                        : "btn-outline btn-primary"
                      }`}
                    >
                      {cat.name}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </nav>

          {/* Listado de Productos */}
          <div className="lg:w-[1000px] 2xl:w-[1350px] pt-4 ">
            {loading ? (
              <div className="flex flex-col items-center gap-4">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p>Cargando productos...</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 justify-items-center">
                <TableProducts
                  search={search}
                  categoriaId={categoriaActiva} // Cambiamos 'props' por un nombre más claro
                  productos={listaProductos}
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