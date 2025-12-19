import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Opcional: iconos de una librería

const CategoriasNav = () => {
  const categorias = [
    "X", "Mantenimiento Básico", "Sistema de Frenos", "Neumáticos", "Sistema Eléctrico", 
    "Suspensión", "Motor", "Transmisión", "Climatización", "Sistema de Escape", "Diagnóstico", "Carrocería"
  ];
  const [categoria, setCategoria] = useState("")

  const scrollRef = useRef(null);

  const scroll = (scrollOffset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += scrollOffset;
    }
  };

  return (
    <div className="relative group w-225 max-w-6xl mx-auto px-10">
      {/* Botón Izquierda */}
      <button 
        onClick={() => scroll(-200)}
        className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 rounded-full shadow-md hover:bg-primary hover:text-white transition-all"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Contenedor del Carrusel */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-3 py-4 scroll-smooth no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categorias.map((cat, index) => (
          <div key={index} className="shrink-0">
            <button onClick={() => setCategoria({cat})} className="btn btn-sm md:btn-md btn-outline btn-primary rounded-full whitespace-nowrap">
              {cat}
            </button>
          </div>
        ))}
      </div>

      {/* Botón Derecha */}
      <button 
        onClick={() => scroll(200)}
        className="absolute -right-5 ml-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/80 rounded-full shadow-md hover:bg-primary hover:text-white transition-all"
      >
        <ChevronRight size={24} />
      </button>

      {/* Estilo para ocultar scroll en Chrome/Safari */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default CategoriasNav;