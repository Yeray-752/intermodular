import { Edit3, Trash2, Package, Star } from 'lucide-react';

const StockTable = ({ productos, categorias }) => {
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
                  {prod.categoria}
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
                  <span className="text-xs font-bold">{prod.rating}</span>
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