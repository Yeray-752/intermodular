import { Edit3, Trash2, Package, Star, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const StockTable = ({ productos, categorias }) => {
  const [listaProductos, setListaProductos] = useState(productos);
  
  // --- Lógica de Paginación ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Índices para segmentar el array
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = listaProductos.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(listaProductos.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  // ----------------------------

  const renderStars = (rating) => {
    const numericRating = Math.round(Number(rating));
    return (
      <div className="flex items-center gap-1">
        {/*    */}
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-5 ${star <= numericRating ? "text-warning" : "text-base-content/20"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex justify-between items-center p-4">
        <button className="btn bg-slate-900 hover:bg-slate-800 text-white border-none normal-case flex gap-2 rounded-xl px-6">
          <Plus size={18} /> Filtros
        </button>
        <span className="text-xs font-semibold text-slate-500 uppercase">
          Mostrando {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, listaProductos.length)} de {listaProductos.length}
        </span>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-neutral">
            <th className="p-3 border text-[11px] text-center font-bold uppercase tracking-wider">Img</th>
            <th className="p-3 border text-[11px] text-center font-bold uppercase tracking-wider">Producto</th>
            <th className="p-3 border text-[11px] font-bold uppercase tracking-wider text-center">Stock</th>
            <th className="p-3 border text-[11px] text-center font-bold uppercase tracking-wider">Precio</th>
            <th className="p-3 border text-[11px] text-center font-bold uppercase tracking-wider">Rating</th>
            <th className="p-3 border text-[11px] font-bold uppercase tracking-wider text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {currentItems.map((prod) => (
            <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="p-3 border-b border-l">
                <img
                  src={prod.image_url}
                  alt={prod.nombre}
                  className="w-10 h-10 rounded-lg object-cover border border-slate-100 mx-auto"
                />
              </td>
              <td className="p-3 border-b text-center">
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase">
                  {prod.name}
                </span>
              </td>
              <td className="p-3 text-center border-b">
                <div className="flex flex-col items-center">
                  <span className={`text-sm font-mono font-bold ${prod.stock < 10 ? 'text-rose-500' : 'text-slate-600'}`}>
                    {prod.stock}
                  </span>
                  <div className="w-12 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                    <div
                      className={`h-full ${prod.stock < 10 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(prod.stock, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </td>
              <td className="p-3 border-b font-mono text-sm font-bold text-center text-slate-600">
                {prod.price}€
              </td>
              <td className="p-3 border-b">
                <div className="flex justify-center text-amber-500">
                  <span className="text-xs font-bold">{renderStars(prod.rating)}</span>
                </div>
              </td>
              <td className="p-3 text-right border-b">
                <div className="flex justify-end gap-2">
                  <button className="p-1.5 hover:bg-slate-200 rounded-md text-slate-400 transition-colors">
                    <Edit3 size={16} />
                  </button>
                  <button className="p-1.5 hover:bg-rose-50 hover:text-rose-500 rounded-md text-slate-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Controles de Paginación */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-slate-200">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn btn-sm"
          >
            Anterior
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="btn btn-sm"
          >
            Siguiente
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-700">
              Página <span className="font-medium">{currentPage}</span> de <span className="font-medium">{totalPages}</span>
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => paginate(currentPage - 1)}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              >
                <ChevronLeft size={20} />
              </button>
              
              {/* Generar botones de números dinámicamente */}
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    currentPage === index + 1
                      ? 'z-10 bg-slate-900 text-white focus-visible:outline focus-visible:outline-2'
                      : 'text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => paginate(currentPage + 1)}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              >
                <ChevronRight size={20} />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockTable;