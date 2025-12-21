import { useState, useRef } from 'react';
import '../App.css'
import Footer from '../components/Footer'
import Header from '../components/Header'
import TableProducts from '../components/TableProducts'
import { useTranslation } from 'react-i18next';

function App() {
  const { t } = useTranslation('market'); // namespace correcto
  const [search, setSearch] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState("");

  const categorias = t("categories", { returnObjects: true }) || [];
  const listaProductos = t("products", { returnObjects: true });

  const manejarClickCategoria = (nombreSeleccionado) => {
    if (categoriaActiva === nombreSeleccionado) {
      setCategoriaActiva("");
    } else {
      setCategoriaActiva(nombreSeleccionado);
    }
  };

  const productosSeguros = Array.isArray(listaProductos) ? listaProductos : [];

  const scrollRef = useRef(null);
  const scroll = (offset) => {
    if (scrollRef.current) scrollRef.current.scrollLeft += offset;
  };

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

          <nav className='space-x-1.5 mt-4 mb-5'>
            <div className="relative justify-items-center group w-80 lg:w-225 2xl:w-290 max-w-6xl mx-auto px-10">
              <div ref={scrollRef} className="flex overflow-x-auto gap-3 py-4 scroll-smooth no-scrollbar" style={{ scrollbarWidth: 'none' }}>
                {categorias.map((cat, index) => (
                  <div key={index} className="shrink-0">
                    <button
                      onClick={() => manejarClickCategoria(cat)}
                      className={`btn btn-sm md:btn-md rounded-full whitespace-nowrap transition-colors ${categoriaActiva === cat
                        ? "bg-orange-600 text-white border-orange-600 hover:bg-orange-700"
                        : "btn-outline btn-primary"
                        }`}
                    >
                      {cat}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </nav>

          <div className="lg:w-[1000px] 2xl:w-[1350px] pt-4 ">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 justify-items-center">
              <TableProducts
                search={search}
                props={categoriaActiva}
                productos={listaProductos}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
