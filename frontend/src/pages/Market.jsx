import { useState, useRef, useEffect } from 'react';
import '../style/index.css';
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
          fetch(`${import.meta.env.VITE_API_URL}/api/products`, { headers }),
          fetch(`${import.meta.env.VITE_API_URL}/api/product_categories`, { headers })
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
    <div className="flex flex-col min-h-screen bg-base-300">
      <Header />
     
      <main className="grow pb-20">
        <div className="flex flex-col items-center w-full p-4">

          <h1 className='mt-4 font-bold text-6xl w-full max-w-6xl px-10'>{t('products')}</h1>

          <p className='mt-2 max-w-xl font-black mb-10'>{t('subtitle')}</p>
          <div className='p-5 rounded-2xl place-items-center-safe'>
            <div className="relative w-190 mb-4">
            {/* Icono posicionado a la izquierda */}
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              className='block w-full pl-10 pr-3 py-2 focus:outline-none focus:ring-3 focus:ring-primary text-accent rounded-lg bg-base-100  text-sm'
              type="search"
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`${t('searchPlaceholder')}`}
            />
            </div>
          </div>


          <nav className='relative mt-5 group w-87 sm:w-135 md:w-190 lg:w-243 xl:w-274 mx-auto px-10'>
            <button onClick={() => scroll(-200)} className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-base-300 rounded-full shadow-sm hover:bg-primary hover:text-white transition-all text-base-content shadow-base-content">
              <ChevronLeft size={24} />
            </button>

            <div
              ref={scrollRef}
              className="flex overflow-x-auto gap-3 py-2 no-scrollbar scroll-smooth"
            >
              {categorias.map((cat) => (
                <div key={cat.id} className="shrink-0">
                  <button
                    onClick={() => manejarClickCategoria(cat.id)}
                    className={`btn btn-sm md:btn-md rounded-full whitespace-nowrap transition-all active:translate-y-1 active:border-b-0
                        ${categoriaActiva === cat.id
                        ? "bg-primary text-white border-b-4 border-orange-700"
                        : "btn-outline btn-base-200 border-b-4 border-gray-400 hover:bg-primary hover:text-white"
                      }`}
                  >
                    {cat.name}
                  </button>
                </div>
              ))}
            </div>

            <button onClick={() => scroll(200)} className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-base-300 rounded-full hover:bg-primary hover:text-white transition-all text-base-content shadow-base-content shadow-sm">
              <ChevronRight size={24} />
            </button>
          </nav>

          <div className="max-w-1400px pt-4">
            {loading ? (
              <div className="flex flex-col items-center py-20">
                <span className="loading loading-spinner loading-md text-primary"></span>
              </div>
            ) : (
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