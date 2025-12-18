import { useState } from 'react'
import React, { useRef } from 'react';
import '../App.css'
import { useNavigate } from 'react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Footer from '../components/Footer'
import Header from '../components/Header'
import TableReservations from '../components/TableReservations'


function App() {
  const [search, setSearch] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState(""); // Único estado necesario

  const categorias = [
    "Mantenimiento Básico", "Sistema de Frenos", "Neumáticos", "Sistema Eléctrico",
    "Suspensión", "Motor", "Transmisión", "Climatización", "Sistema de Escape", "Diagnóstico", "Carrocería"
  ];

  // Recibe el nombre de la categoría clickeada directamente
  const manejarClickCategoria = (nombreSeleccionado) => {
    if (categoriaActiva === nombreSeleccionado) {
      setCategoriaActiva(""); // Desactiva si es la misma
    } else {
      setCategoriaActiva(nombreSeleccionado); // Activa la nueva
    }
  };

  const scrollRef = useRef(null);
  const scroll = (offset) => {
    if (scrollRef.current) scrollRef.current.scrollLeft += offset;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="grow">
        <div className="flex-col grow p-4 justify-items-center">
          {/* ... tu buscador ... */}
          <input className='input mt-6' type="search" onChange={(e) => setSearch(e.target.value)} placeholder="Search" />

          <h1 className='mt-10 font-bold text-2xl'>Categorias</h1>

          <nav className='space-x-1.5 mt-4 mb-5'>
            <div className="relative group w-80 lg:w-225 2xl:w-290 max-w-6xl mx-auto px-10">
              <button onClick={() => scroll(-200)} className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 rounded-full shadow-md hover:bg-primary hover:text-white transition-all">
                <ChevronLeft size={24} />
              </button>

              <div ref={scrollRef} className="flex overflow-x-auto gap-3 py-4 scroll-smooth no-scrollbar" style={{ scrollbarWidth: 'none' }}>
                {categorias.map((cat, index) => (
                  <div key={index} className="shrink-0">
                    <button 
                      onClick={() => manejarClickCategoria(cat)} // Pasamos 'cat' directamente
                      className={`btn btn-sm md:btn-md rounded-full whitespace-nowrap transition-colors ${
                        categoriaActiva === cat 
                          ? "bg-orange-600 text-white border-orange-600 hover:bg-orange-700" 
                          : "btn-outline btn-primary"
                      }`}
                    >
                      {cat}
                    </button>
                  </div>
                ))}
              </div>

              <button onClick={() => scroll(200)} className="absolute -right-5 ml-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 rounded-full shadow-md hover:bg-primary hover:text-white transition-all">
                <ChevronRight size={24} />
              </button>
            </div>
          </nav>

          <div className="lg:w-[1000px] 2xl:w-[1350px] pt-4 ">
            <div className="grid lg:grid-cols-3 2xl:grid-cols-4 gap-4 justify-items-center">
              {/* IMPORTANTE: Usamos categoriaActiva aquí */}
              <TableReservations search={search} props={categoriaActiva} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App