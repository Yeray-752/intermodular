import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Footer from '../components/Principal/Footer'
import Header from '../components/Principal/Header'
import TableReservations from '../components/TableReservations'
import '../style/scroll.css';

function App() {
  const { t, i18n } = useTranslation('servicios');
  const [search, setSearch] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState(null);
  const [servicios, setServicios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const headers = { 'accept-language': i18n.language };
        const [resServ, resCat] = await Promise.all([
          fetch('https://yeray.informaticamajada.es/api/services', { headers }),
          fetch('https://yeray.informaticamajada.es/api/service_categories', { headers })
        ]);
        const dataServ = await resServ.json();
        const dataCat = await resCat.json();
        setServicios(dataServ);
        setCategorias(dataCat);
      } catch (error) {
        console.error("Error al cargar servicios:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [i18n.language]);

  const manejarClickCategoria = (id) => {
    setCategoriaActiva(prev => prev === id ? null : id);
  };

  const scrollRef = useRef(null);
  const scroll = (offset) => {
    if (scrollRef.current) scrollRef.current.scrollLeft += offset;
  };

  return (
    <div className="flex flex-col min-h-screen bg-base-100 text-base-content">
      <Header />
      <main className="grow bg-base-300">
        <div className="flex flex-col p-4 items-center">


          <h1 className='mt-4 font-bold text-6xl w-full max-w-6xl px-10'>{t('categories')}</h1>

          <p className='mt-2 max-w-xl font-black mb-10'>Encuentra y agenda el mantenimiento perfecto para tu vehiculo con nuestra tecnologia de diagnóstico avanzado</p> {/* traducir */}
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

            <nav className='space-x-1.5 mt-4 mb-5 w-full'>
              <div className='relative group w-92 md:w-175 lg:w-225 xl:w-5xl 2xl:w-330 mx-auto px-10'>
                <button onClick={() => scroll(-200)} className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-base-300-content rounded-full shadow-md hover:bg-primary hover:text-white transition-all text-gray-800">
                  <ChevronLeft size={24} />
                </button>

                <div ref={scrollRef} className="flex overflow-x-auto gap-3 py-4 no-scrollbar scroll-smooth">
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

                <button onClick={() => scroll(200)} className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-base-300-content rounded-full shadow-md hover:bg-primary hover:text-white transition-all text-gray-800">
                  <ChevronRight size={24} />
                </button>
              </div>
            </nav>
          </div>
          

            <div className="max-w-350 pt-4">
              {loading ? (
                <div className="flex justify-center py-10">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
              ) : (
                <TableReservations
                  search={search}
                  categoriaId={categoriaActiva}
                  servicios={servicios}
                />
              )}
            </div>
          </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;