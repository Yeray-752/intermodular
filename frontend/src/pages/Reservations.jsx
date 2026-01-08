import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next' // Importante para detectar el cambio de idioma
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Footer from '../components/Footer'
import Header from '../components/Header'
import TableReservations from '../components/TableReservations'
import serviciosTaller from "../assets/data/serviciosTaller.json"; // Importamos el JSON para las categorías

function App() {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState(""); 
  
  // 1. Obtener idioma actual y categorías dinámicas del JSON
  const lang = i18n.language?.split('-')[0] || 'es';
  const categorias = serviciosTaller[lang]?.categories || [];

  // 2. Limpiar categoría activa si se cambia el idioma (evita filtros rotos)
  useEffect(() => {
    setCategoriaActiva("");
  }, [lang]);

  const manejarClickCategoria = (nombreSeleccionado) => {
    if (categoriaActiva === nombreSeleccionado) {
      setCategoriaActiva(""); 
    } else {
      setCategoriaActiva(nombreSeleccionado); 
    }
  };

  const scrollRef = useRef(null);
  const scroll = (offset) => {
    if (scrollRef.current) scrollRef.current.scrollLeft += offset;
  };

  // Textos traducidos para la interfaz
  const ui = {
    placeholder: lang === 'es' ? "Buscar servicios..." : "Search services...",
    tituloCat: lang === 'es' ? "Categorías" : "Categories"
  };

  return (
    <div className="flex flex-col min-h-screen bg-base-200 text-base-content">
      <Header />
      <main className="grow">
        <div className="flex-col grow p-4 justify-items-center">
          {/* Buscador Traducido */}
          <input 
            className='input input-bordered w-full max-w-md mt-6 bg-base-100 text-base-content' 
            type="search" 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder={ui.placeholder} 
          />

          <h1 className='mt-10 font-bold text-2xl'>{ui.tituloCat}</h1>

          <nav className='space-x-1.5 mt-4 mb-5'>
            <div className="relative group w-80 lg:w-225 2xl:w-290 max-w-6xl mx-auto px-10">
              <button onClick={() => scroll(-200)} className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 p-2 bg-base-100 rounded-full shadow hover:bg-primary hover:text-white transition-all">
                <ChevronLeft size={24} />
              </button>

              <div ref={scrollRef} className="flex overflow-x-auto gap-3 py-4 scroll-smooth no-scrollbar" style={{ scrollbarWidth: 'none' }}>
                {categorias.map((cat, index) => (
                  <div key={index} className="shrink-0">
                    <button 
                      onClick={() => manejarClickCategoria(cat)} 
                      className={`btn btn-sm md:btn-md rounded-full whitespace-nowrap transition-colors ${
                        categoriaActiva === cat 
                          ? "bg-primary text-primary-content border-primary hover:bg-primary-focus" 
                          : "btn-outline btn-primary"
                      }`}
                    >
                      {cat}
                    </button>
                  </div>
                ))}
              </div>

              <button onClick={() => scroll(200)} className="absolute -right-5 ml-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-base-100 rounded-full shadow hover:bg-primary hover:text-white transition-all">
                <ChevronRight size={24} />
              </button>
            </div>
          </nav>

          <div className="lg:w-[1000px] 2xl:w-[1350px] pt-4 mx-auto">
            <div className="grid lg:grid-cols-3 2xl:grid-cols-4 gap-4 justify-items-center">
              {/* Le pasamos la categoría activa (que ya está en el idioma correcto) */}
              <TableReservations search={search} props={categoriaActiva} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;