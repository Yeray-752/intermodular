import { Edit3, Trash2, Package, Star } from 'lucide-react';

const StockTable = ({ productos, categorias }) => {
  console.log(productos)

  const renderStars = (rating) => {
    const numericRating = Math.round(Number(rating));

    return (
      <>
        <span className="ml-2 text-sm font-bold opacity-60 text-base-content">{rating || 0}/5</span>
        <div className="flex items-center gap-1">
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
      </>
    );
  };

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="p-3 text-[11px] font-bold uppercase text-slate-500 tracking-wider">Prod.</th>
            <th className="p-3 text-[11px] font-bold uppercase text-slate-500 tracking-wider">Categoría</th>
            <th className="p-3 text-[11px] font-bold uppercase text-slate-500 tracking-wider text-center">Stock</th>
            <th className="p-3 text-[11px] font-bold uppercase text-slate-500 tracking-wider">Precio</th>
            <th className="p-3 text-[11px] font-bold uppercase text-slate-500 tracking-wider">Rating</th>
            <th className="p-3 text-[11px] font-bold uppercase text-slate-500 tracking-wider text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {productos.map((prod) => (
            <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors">
              {/* Imagen e Info Básica */}
              <td className="p-3">
                <div className="flex items-center gap-3">
                  <img
                    src={prod.imagen_url}
                    alt={prod.nombre}
                    className="w-10 h-10 rounded-lg object-cover border border-slate-100"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-700 leading-none">{prod.nombre}</p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-mono">ID: {prod.id}</p>
                  </div>
                </div>
              </td>

              {/* Categoría */}
              <td className="p-3">
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase">
                  {prod.name}
                </span>
              </td>

              {/* Stock con aviso visual */}
              <td className="p-3 text-center">
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

              {/* Precio */}
              <td className="p-3 font-mono text-sm font-bold text-slate-600">
                {prod.price}€
              </td>

              {/* Rating */}
              <td className="p-3">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star size={12} fill="currentColor" />
                  <span className="text-xs font-bold">{renderStars(prod.rating)}</span>
                </div>
              </td>

              {/* Acciones Rápidas */}
              <td className="p-3 text-right">
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
    </div>
  );
};

export default StockTable;