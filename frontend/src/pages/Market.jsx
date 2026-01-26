import { useState, useRef, useEffect } from 'react';
import '../style/App.css';
import Footer from '../components/Principal/Footer';
import Header from '../components/Principal/Header';
import TableProducts from '../components/Productos/TableProducts';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function App() {
  const { t, i18n } = useTranslation('market');
  const [listaProductos, setListaProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [search, setSearch] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchDatos = async () => {
      try {
        const headers = { 'accept-language': i18n.language };
        const [resProd, resCat] = await Promise.all([
          fetch('https://yeray.informaticamajada.es/api/products', { headers }),
          fetch('https://yeray.informaticamajada.es/api/product_categories', { headers })
        ]);
        const dataProd = await resProd.json();
        const dataCat = await resCat.json();
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
    setCategoriaActiva(categoriaActiva === id ? null : id);
  };

  const scrollRef = useRef(null);
  const scroll = (offset) => {
    if (scrollRef.current) scrollRef.current.scrollLeft += offset;
  };

  return (
    <div className="flex flex-col min-h-screen bg-base-200">
      <Header />
      <main className="grow pb-20">
        <div className="flex flex-col items-center w-full">

          {/* Barra de búsqueda */}
          <div className="w-full max-w-md px-4 mt-8">
            <input
              className='input input-bordered w-full shadow-sm focus:border-primary'
              type="search"
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("searchPlaceholder")}
            />
          </div>

          <h1 className='mt-10 font-extrabold mb-4 text-3xl text-gray-800 w-full max-w-7xl px-6 md:px-10'>
            {t('products')}
          </h1>

          {/* Navegación de Categorías */}
          <nav className='relative group w-86 sm:w-135 md:w-189 lg:w-242 xl:w-272 mx-auto px-10'>
            <button onClick={() => scroll(-250)} className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-primary hover:text-white transition-all">
              <ChevronLeft size={20} />
            </button>

            <div
              ref={scrollRef}
              className="flex overflow-x-auto gap-3 py-2 no-scrollbar scroll-smooth"
            >
              {categorias.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => manejarClickCategoria(cat.id)}
                  className={`btn btn-sm md:btn-md rounded-full whitespace-nowrap transition-colors ${
                        categoriaActiva === cat.id ? "bg-primary text-white border-none" : "btn-outline btn-primary"
                      }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <button onClick={() => scroll(250)} className="absolute -right-1 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-primary hover:text-white transition-all">
              <ChevronRight size={20} />
            </button>
          </nav>

          {/* LISTADO DE PRODUCTOS - El cambio clave está aquí */}
          <div className="w-full max-w-7xl mx-auto px-4">
            {loading ? (
              <div className="flex flex-col items-center py-20">
                <span className="loading loading-spinner loading-md text-primary"></span>
              </div>
            ) : (
              /* Cambiamos a grid-cols-2 de base y hasta 5 en pantallas muy grandes */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-7 p-15">
                <TableProducts
                  search={search}
                  categoriaId={categoriaActiva}
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