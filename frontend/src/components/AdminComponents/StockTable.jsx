import { Edit3, Trash2, Package, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle2, XCircle, Search, Filter } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from "react-i18next";

const StockTable = ({ productos, categorias }) => {

  const { t } = useTranslation("admin");
  const [selectedProd, setSelectedProd] = useState(null);
  const { i18n } = useTranslation();

  const [preview, setPreview] = useState(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [filtro, setFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const productosFiltrados = productos.filter(prod => {
    const coincideBusqueda =
      prod.name.toLowerCase().includes(busqueda.toLowerCase()) ||
      prod.description.toLowerCase().includes(busqueda.toLowerCase());

    const coincideFiltro =
      filtro === 'todos' ? true :
        filtro === 'bajo' ? (prod.stock > 0 && prod.stock <= 10) :
          filtro === 'disponible' ? (prod.stock > 10) :
            filtro === 'agotado' ? (prod.stock === 0) : true;

    return coincideBusqueda && coincideFiltro;
  });

  // 3. Lógica de Paginación (Sobre la lista YA filtrada)
  const totalPages = Math.ceil(productosFiltrados.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = productosFiltrados.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderStars = (rating) => {
    const numericRating = Math.round(Number(rating));
    return (
      <div className="flex items-center gap-0.5 justify-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-3 h-3 ${star <= numericRating ? "text-warning" : "text-base-content/20"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  // Dentro de tu componente StockTable
  const handleUpdate = async (e) => {
    e.preventDefault();

    // Si por lo que sea no hay producto seleccionado, no hacemos nada
    if (!selectedProd) {
      console.error("No hay un producto seleccionado para editar");
      return;
    }

    const formData = new FormData(e.target);
    const id = selectedProd.id; // Ahora ya no será null

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'x-lang': i18n.language
        },
        body: formData
      });

      if (response.ok) {
        alert("Producto actualizado con éxito");
        document.getElementById(`editProduct${id}`).close();
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-8 space-y-6">

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h2 className="text-2xl font-black flex items-center gap-3 italic">
              <Package className="text-primary" size={28} />
              {t("stock_table.title", "GESTIÓN DE STOCK")}
            </h2>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Inventario en tiempo real</p>
          </div>

          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Buscar pieza o descripción..."
              className="input input-bordered w-full pl-12 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              value={busqueda}
              onChange={(e) => { setBusqueda(e.target.value); setCurrentPage(1); }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
          {[
            { id: 'todos', label: 'Todos', icon: Filter, color: 'text-slate-500' },
            { id: 'disponible', label: 'En Stock', icon: CheckCircle2, color: 'text-emerald-500' },
            { id: 'bajo', label: 'Bajo Stock', icon: AlertTriangle, color: 'text-amber-500' },
            { id: 'agotado', label: 'Agotado', icon: XCircle, color: 'text-rose-500' }
          ].map((item) => (
            
            <button
              key={item.id}
              onClick={() => { setFiltro(item.id); setCurrentPage(1); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${filtro === item.id ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:bg-white/50'
                }`}
            >
              <item.icon size={14} className={item.color} />
              {item.label}
            </button>
          ))}
        </div>

        {/* TABLA ESTILIZADA */}
        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="table w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 border-b border-slate-100">
                <th className="py-4 font-bold text-[10px] uppercase tracking-widest text-center">{t("stock_table.th_img")}</th>
                <th className="py-4 font-bold text-[10px] uppercase tracking-widest">{t("stock_table.th_product")}</th>
                <th className="py-4 font-bold text-[10px] uppercase tracking-widest text-center">{t("stock_table.th_stock")}</th>
                <th className="py-4 font-bold text-[10px] uppercase tracking-widest text-center">{t("stock_table.th_price")}</th>
                <th className="py-4 font-bold text-[10px] uppercase tracking-widest text-center">{t("stock_table.th_rating")}</th>
                <th className="py-4 font-bold text-[10px] uppercase tracking-widest text-right">{t("stock_table.th_actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentItems.length > 0 ? currentItems.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-4 text-center">
                    <div className="avatar">
                      <div className="w-12 h-12 rounded-xl ring-1 ring-slate-200 group-hover:ring-primary transition-all">
                        <img src={`${import.meta.env.VITE_API_URL}${prod.image_url}`} alt={prod.name} className="object-cover" />
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{prod.name}</p>
                      <p className="text-[10px] text-slate-400 line-clamp-1 max-w-50">{prod.description}</p>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className={`text-xs font-black ${prod.stock <= 10 ? 'text-rose-500' : 'text-slate-700'}`}>
                          {prod.stock}
                      </span>
                      <progress
                        className={`progress w-12 h-1.5 ${prod.stock <= 10 ? 'progress-error' : 'progress-success'}`}
                        value={prod.stock}
                        max="100"
                      ></progress>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="badge badge-ghost font-mono font-bold text-slate-600">{prod.price}€</span>
                  </td>
                  <td className="p-4">
                    {renderStars(prod.rating)}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button
                        className="p-1.5 hover:bg-slate-200 rounded-md text-slate-400"
                        onClick={() => {
                          setSelectedProd(prod);
                          setPreview(prod.image_url);
                          document.getElementById('edit_product_modal').showModal();
                        }}
                      >
                        <Edit3 size={16} />
                      </button>
                      <button className="p-1.5 hover:bg-rose-50 hover:text-rose-500 rounded-md text-slate-400 transition-colors" onClick={() => document.getElementById(`deleteProduct${prod.id}`).showModal()}>
                        <Trash2 size={16} />
                      </button>


                      <dialog id={`deleteProduct${prod.id}`} className="modal text-left">
                        <div className="modal-box">
                          <h3 className="font-bold text-lg text-rose-600">{t("stock_table.delete_title")}</h3>
                          <p className="py-4">ID: {prod.id} - {prod.name}</p>
                          <div className="modal-action">
                            <form method="dialog">
                              <button className="btn">{t("stock_table.close")}</button>
                            </form>
                          </div>
                        </div>
                      </dialog>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="py-20 text-center">
                    <div className="flex flex-col items-center opacity-20">
                      <Package size={48} />
                      <p className="font-bold mt-2">No se encontraron productos</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <dialog id="edit_product_modal" className="modal text-left">
  <div className="modal-box max-w-3xl bg-white">
    {selectedProd && (
      <div key={selectedProd.id}>
        <h3 className="font-black text-2xl mb-6 text-slate-800 uppercase italic">
          {t("stock_table.edit_title")}: {selectedProd.name}
        </h3>

        <form onSubmit={handleUpdate} className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* IZQUIERDA */}
            <div className="space-y-4">

              {/* Nombre */}
              <div className="form-control">
                <label className="label text-xs font-bold uppercase">
                  {t("stock_table.th_product")}
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={selectedProd.name}
                  className="input input-bordered w-full"
                />
              </div>

              {/* Descripción */}
              <div className="form-control">
                <label className="label text-xs font-bold uppercase">
                  {t("stock_table.description")}
                </label>
                <textarea
                  name="description"
                  defaultValue={selectedProd.description}
                  className="textarea textarea-bordered w-full h-24"
                />
              </div>

            </div>

            {/* DERECHA */}
            <div className="space-y-4">

              {/* Precio */}
              <div className="form-control">
                <label className="label text-xs font-bold uppercase">
                  {t("stock_table.th_price")}
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  defaultValue={selectedProd.price}
                  className="input input-bordered w-full"
                />
              </div>

              {/* Stock */}
              <div className="form-control">
                <label className="label text-xs font-bold uppercase">
                  {t("stock_table.th_stock")}
                </label>
                <input
                  type="number"
                  name="stock"
                  defaultValue={selectedProd.stock}
                  className="input input-bordered w-full"
                />
              </div>

              {/* Categoría */}
              <div className="form-control">
                <label className="label text-xs font-bold uppercase">
                  Categoría
                </label>
                <select
                  name="category_id"
                  defaultValue={selectedProd.category_id}
                  className="select select-bordered w-full"
                >
                  {categorias?.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Imagen */}
              <div className="form-control">
                <label className="label text-xs font-bold uppercase">
                  Imagen
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setPreview(URL.createObjectURL(file));
                    }
                  }}
                />

                {preview && (
                  <img
                    src={
                      preview.startsWith("blob")
                        ? preview
                        : `${import.meta.env.VITE_API_URL}${preview}`
                    }
                    className="w-24 h-24 object-cover rounded-xl mt-3"
                  />
                )}
              </div>

            </div>
          </div>

          {/* BOTONES */}
          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => document.getElementById('edit_product_modal').close()}
            >
              {t("stock_table.close")}
            </button>

            <button type="submit" className="btn btn-primary px-8">
              {loadingUpdate ? "Guardando..." : t("stock_table.save")}
            </button>
          </div>

        </form>
      </div>
    )}
  </div>
</dialog>

        {/* PAGINACIÓN */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">
            {t("stock_table.page")} {currentPage} / {totalPages || 1}
          </p>
          <div className="join bg-slate-100 p-1 rounded-xl">
            <button
              disabled={currentPage === 1}
              onClick={() => paginate(currentPage - 1)}
              className="btn btn-ghost btn-xs join-item rounded-lg disabled:bg-transparent"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => paginate(currentPage + 1)}
              className="btn btn-ghost btn-xs join-item rounded-lg disabled:bg-transparent"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockTable;