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
      <main className="grow bg-neutral">
        <div className="flex flex-col p-4 items-center">
          <input
            className='input input-bordered w-full max-w-md mt-8 bg-base-100'
            type="search"
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchPlaceholder')}
          />

          <h1 className='mt-10 font-bold text-2xl w-full max-w-6xl px-10'>{t('categories')}</h1>

          <nav className='space-x-1.5 mt-4 mb-5 w-full'>
            <div className='relative group w-92 md:w-175 lg:w-225 xl:w-255 2xl:w-328 mx-auto px-10'>
              <button onClick={() => scroll(-200)} className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-neutral-content rounded-full shadow-md hover:bg-primary-content hover:text-white transition-all text-gray-800">
                <ChevronLeft size={24} />
              </button>

              <div ref={scrollRef} className="flex overflow-x-auto gap-3 py-4 no-scrollbar scroll-smooth">
                {categorias.map((cat) => (
                  <div key={cat.id} className="shrink-0">
                    <button
                      onClick={() => manejarClickCategoria(cat.id)}
                      className={`btn btn-sm md:btn-md rounded-full whitespace-nowrap transition-colors ${
                        categoriaActiva === cat.id ? "bg-primary-content text-white border-none" : "btn-outline btn-primary hover:bg-primary-content hover:text-base-100"
                      }`}
                    >
                      {cat.name}
                    </button>
                  </div>
                ))}
              </div>

              <button onClick={() => scroll(200)} className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-neutral-content rounded-full shadow-md hover:bg-primary-content hover:text-white transition-all text-gray-800">
                <ChevronRight size={24} />
              </button>
            </div>
          </nav>

          {/* CONTENEDOR DE RESERVAS: Se ha eliminado el grid de aquí para evitar conflictos */}
          <div className="max-w-[1400px] pt-4">
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