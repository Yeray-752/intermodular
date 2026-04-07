import { Edit3, Trash2, Wrench, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle2, XCircle, Search, Filter, Clock, Zap } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from "react-i18next";

const ServicesTable = ({ servicios, categorias }) => {

    const { t } = useTranslation("admin");
    const { i18n } = useTranslation();

    const [selectedService, setSelectedService] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [filtro, setFiltro] = useState('todos');
    const [busqueda, setBusqueda] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const difficultyColor = (difficulty) => {
        if (difficulty === 'Baja') return 'badge-success';
        if (difficulty === 'Media') return 'badge-warning';
        if (difficulty === 'Alta') return 'badge-error';
        return 'badge-ghost';
    };

    const serviciosFiltrados = servicios.filter(srv => {
        const coincideBusqueda =
            srv.name.toLowerCase().includes(busqueda.toLowerCase()) ||
            srv.description?.toLowerCase().includes(busqueda.toLowerCase());

        const coincideFiltro =
            filtro === 'todos' ? true :
                filtro === 'baja' ? srv.difficulty === 'Baja' :
                    filtro === 'media' ? srv.difficulty === 'Media' :
                        filtro === 'alta' ? srv.difficulty === 'Alta' : true;

        return coincideBusqueda && coincideFiltro;
    });

    const totalPages = Math.ceil(serviciosFiltrados.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = serviciosFiltrados.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!selectedService) return;
        setLoadingUpdate(true);

        const formData = new FormData(e.target);
        const id = selectedService.id;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/services/${id}/update`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    'x-lang': i18n.language
                },
                body: formData
            });

            if (response.ok) {
                document.getElementById('edit_service_modal').close(); // ← primero cierra
                await onUpdate(); // ← luego refresca
            }
        } catch (error) {
            console.error("Error al actualizar:", error);
        } finally {
            setLoadingUpdate(false);
        }
    };


    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/services/${id}/delete`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (response.ok) {
                alert("Servicio eliminado");
                document.getElementById(`deleteService${id}`).close();
            }
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    };

    return (
        <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 space-y-6">

                {/* HEADER */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h2 className="text-2xl font-black flex items-center gap-3 italic">
                            <Wrench className="text-primary" size={28} />
                            GESTIÓN DE SERVICIOS
                        </h2>
                        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Catálogo de servicios</p>
                    </div>

                    <div className="relative w-full lg:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar servicio o descripción..."
                            className="input input-bordered w-full pl-12 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            value={busqueda}
                            onChange={(e) => { setBusqueda(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                </div>

                {/* FILTROS POR DIFICULTAD */}
                <div className="flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
                    {[
                        { id: 'todos', label: 'Todos', icon: Filter, color: 'text-slate-500' },
                        { id: 'baja', label: 'Baja', icon: CheckCircle2, color: 'text-emerald-500' },
                        { id: 'media', label: 'Media', icon: AlertTriangle, color: 'text-amber-500' },
                        { id: 'alta', label: 'Alta', icon: XCircle, color: 'text-rose-500' }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => { setFiltro(item.id); setCurrentPage(1); }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${filtro === item.id ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:bg-white/50'}`}
                        >
                            <item.icon size={14} className={item.color} />
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* TABLA */}
                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                    <table className="table w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-400 border-b border-slate-100">
                                <th className="py-4 font-bold text-[10px] uppercase tracking-widest text-center">Imagen</th>
                                <th className="py-4 font-bold text-[10px] uppercase tracking-widest">Servicio</th>
                                <th className="py-4 font-bold text-[10px] uppercase tracking-widest text-center">Precio base</th>
                                <th className="py-4 font-bold text-[10px] uppercase tracking-widest text-center">Duración</th>
                                <th className="py-4 font-bold text-[10px] uppercase tracking-widest text-center">Dificultad</th>
                                <th className="py-4 font-bold text-[10px] uppercase tracking-widest text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {currentItems.length > 0 ? currentItems.map((srv) => (
                                <tr key={srv.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="p-4 text-center">
                                        <div className="avatar">
                                            <div className="w-12 h-12 rounded-xl ring-1 ring-slate-200 group-hover:ring-primary transition-all">
                                                <img
                                                    src={`${import.meta.env.VITE_API_URL}${srv.image_url}`}
                                                    alt={srv.name}
                                                    className="object-cover"
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm">{srv.name}</p>
                                            <p className="text-[10px] text-slate-400 line-clamp-1 max-w-50">{srv.description}</p>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="badge badge-ghost font-mono font-bold text-slate-600">{srv.base_price}€</span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="flex items-center justify-center gap-1 text-xs text-slate-500 font-medium">
                                            <Clock size={12} />
                                            {srv.duration}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`badge ${difficultyColor(srv.difficulty)} badge-sm font-bold`}>
                                            {srv.difficulty}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                className="p-1.5 hover:bg-slate-200 rounded-md text-slate-400"
                                                onClick={() => {
                                                    setSelectedService(srv);
                                                    setPreview(srv.image_url);
                                                    document.getElementById('edit_service_modal').showModal();
                                                }}
                                            >
                                                <Edit3 size={16} />
                                            </button>
                                            <button
                                                className="p-1.5 hover:bg-rose-50 hover:text-rose-500 rounded-md text-slate-400 transition-colors"
                                                onClick={() => document.getElementById(`deleteService${srv.id}`).showModal()}
                                            >
                                                <Trash2 size={16} />
                                            </button>

                                            <dialog id={`deleteService${srv.id}`} className="modal text-left">
                                                <div className="modal-box">
                                                    <h3 className="font-bold text-lg text-rose-600">¿Eliminar servicio?</h3>
                                                    <p className="py-4">ID: {srv.id} - {srv.name}</p>
                                                    <div className="modal-action">
                                                        <button className="btn btn-error" onClick={() => handleDelete(srv.id)}>Eliminar</button>
                                                        <form method="dialog">
                                                            <button className="btn">Cancelar</button>
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
                                            <Wrench size={48} />
                                            <p className="font-bold mt-2">No se encontraron servicios</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* MODAL EDITAR */}
                <dialog id="edit_service_modal" className="modal text-left">
                    <div className="modal-box max-w-3xl bg-white">
                        {selectedService && (
                            <div key={selectedService.id}>
                                <h3 className="font-black text-2xl mb-6 text-slate-800 uppercase italic">
                                    Editar: {selectedService.name}
                                </h3>

                                <form onSubmit={handleUpdate} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                        {/* IZQUIERDA */}
                                        <div className="space-y-4">
                                            <div className="form-control">
                                                <label className="label text-xs font-bold uppercase">Nombre</label>
                                                <input type="text" name="name" defaultValue={selectedService.name} className="input input-bordered w-full" />
                                            </div>
                                            <div className="form-control">
                                                <label className="label text-xs font-bold uppercase">Descripción</label>
                                                <textarea name="description" defaultValue={selectedService.description} className="textarea textarea-bordered w-full h-24" />
                                            </div>
                                            <div className="form-control">
                                                <label className="label text-xs font-bold uppercase">Categoría</label>
                                                <select name="category_id" defaultValue={selectedService.category_id} className="select select-bordered w-full">
                                                    {categorias?.map(cat => (
                                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* DERECHA */}
                                        <div className="space-y-4">
                                            <div className="form-control">
                                                <label className="label text-xs font-bold uppercase">Precio base</label>
                                                <input type="number" step="0.01" name="base_price" defaultValue={selectedService.base_price} className="input input-bordered w-full" />
                                            </div>
                                            <div className="form-control">
                                                <label className="label text-xs font-bold uppercase">Duración</label>
                                                <input type="text" name="duration" defaultValue={selectedService.duration} className="input input-bordered w-full" placeholder="Ej: 1.5 h" />
                                            </div>
                                            <div className="form-control">
                                                <label className="label text-xs font-bold uppercase">Dificultad</label>
                                                <select name="difficulty" defaultValue={selectedService.difficulty} className="select select-bordered w-full">
                                                    <option value="Baja">Baja</option>
                                                    <option value="Media">Media</option>
                                                    <option value="Alta">Alta</option>
                                                </select>
                                            </div>
                                            <div className="form-control">
                                                <label className="label text-xs font-bold uppercase">Imagen</label>
                                                <input
                                                    type="file"
                                                    name="image"
                                                    accept="image/*"
                                                    className="file-input file-input-bordered w-full"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) setPreview(URL.createObjectURL(file));
                                                    }}
                                                />
                                                {preview && (
                                                    <img
                                                        src={preview.startsWith("blob") ? preview : `${import.meta.env.VITE_API_URL}${preview}`}
                                                        className="w-24 h-24 object-cover rounded-xl mt-3"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="modal-action">
                                        <button type="button" className="btn btn-ghost" onClick={() => document.getElementById('edit_service_modal').close()}>
                                            Cancelar
                                        </button>
                                        <button type="submit" className="btn btn-primary px-8">
                                            {loadingUpdate ? "Guardando..." : "Guardar"}
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
                        Página {currentPage} / {totalPages || 1}
                    </p>
                    <div className="join bg-slate-100 p-1 rounded-xl">
                        <button disabled={currentPage === 1} onClick={() => paginate(currentPage - 1)} className="btn btn-ghost btn-xs join-item rounded-lg disabled:bg-transparent">
                            <ChevronLeft size={16} />
                        </button>
                        <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => paginate(currentPage + 1)} className="btn btn-ghost btn-xs join-item rounded-lg disabled:bg-transparent">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ServicesTable;