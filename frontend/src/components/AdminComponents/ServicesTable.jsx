import { Edit3, Package, FileText, Tag, DollarSign, Image as ImageIcon, X, Save, Trash2, Wrench, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle2, XCircle, Search, Filter, Clock } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from "react-i18next";

const ServicesTable = ({ servicios, categorias, onUpdate }) => {
    const { t, i18n } = useTranslation("admin");

    const [selectedService, setSelectedService] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [filtro, setFiltro] = useState('todos');
    const [busqueda, setBusqueda] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const difficultyColor = (difficulty) => {
        const d = difficulty?.toLowerCase();
        if (d === 'baja') return 'badge-success text-white';
        if (d === 'media') return 'badge-warning text-white';
        if (d === 'alta') return 'badge-error text-white';
        return 'badge-ghost';
    };

    // --- LÓGICA DE FILTRADO Y PAGINACIÓN ---
    const serviciosFiltrados = servicios.filter(srv => {
        const coincideBusqueda =
            srv.name.toLowerCase().includes(busqueda.toLowerCase()) ||
            srv.description?.toLowerCase().includes(busqueda.toLowerCase());

        const coincideFiltro =
            filtro === 'todos' ? true : srv.difficulty?.toLowerCase() === filtro;

        return coincideBusqueda && coincideFiltro;
    });

    const totalPages = Math.ceil(serviciosFiltrados.length / itemsPerPage);
    const currentItems = serviciosFiltrados.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // --- ACCIONES API ---
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!selectedService) return;
        setLoadingUpdate(true);

        const formData = new FormData(e.target);
        const id = selectedService.id;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/services/${id}/update`, {
                method: 'POST', // Usar POST con _method PUT si tienes problemas con archivos en PUT puro
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    'x-lang': i18n.language
                },
                body: formData
            });

            if (response.ok) {
                document.getElementById('edit_service_modal').close();
                if (onUpdate) await onUpdate();
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
                document.getElementById(`deleteService${id}`).close();
                if (onUpdate) await onUpdate();
            }
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    };

    return (
        <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 space-y-6">

                {/* HEADER Y BÚSQUEDA */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <h2 className="text-2xl font-black flex items-center gap-3 italic">
                        <Wrench className="text-primary" size={28} />
                        {t("services_table.title")}
                    </h2>

                    <div className="relative w-full lg:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder={t("services_table.search")}
                            className="input input-bordered w-full pl-12 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            value={busqueda}
                            onChange={(e) => { setBusqueda(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                </div>

                {/* FILTROS */}
                <div className="flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
                    {[
                        { id: 'todos', label: t("stock_table.all"), icon: Filter, color: 'text-slate-500' },
                        { id: 'baja', label: t("servicios.dificultad_baja"), icon: CheckCircle2, color: 'text-emerald-500' },
                        { id: 'media', label: t("servicios.dificultad_media"), icon: AlertTriangle, color: 'text-amber-500' },
                        { id: 'alta', label: t("servicios.dificultad_alta"), icon: XCircle, color: 'text-rose-500' }
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
                            <tr className="bg-slate-50 text-slate-400 border-b border-slate-100 text-center">
                                <th className="py-4 font-bold text-[10px] uppercase tracking-widest">{t("services_table.image")}</th>
                                <th className="py-4 font-bold text-[10px] uppercase tracking-widest text-left">{t("services_table.service")}</th>
                                <th className="py-4 font-bold text-[10px] uppercase tracking-widest">{t("services_table.inicialPrice")}</th>
                                <th className="py-4 font-bold text-[10px] uppercase tracking-widest">{t("services_table.duration")}</th>
                                <th className="py-4 font-bold text-[10px] uppercase tracking-widest">{t("services_table.difficulty")}</th>
                                <th className="py-4 font-bold text-[10px] uppercase tracking-widest text-right">{t("services_table.actions")}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {currentItems.length > 0 ? currentItems.map((srv) => (
                                <tr key={srv.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="p-4 text-center">
                                        <div className="avatar">
                                            <div className="w-12 h-12 rounded-xl ring-1 ring-slate-200 group-hover:ring-primary transition-all">
                                                <img src={`${import.meta.env.VITE_API_URL}${srv.image_url}`} alt={srv.name} className="object-cover" />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <p className="font-bold text-slate-800 text-sm">{srv.name}</p>
                                        <p className="text-[10px] text-slate-400 line-clamp-1 max-w-xs">{srv.description}</p>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="badge badge-ghost font-mono font-bold text-slate-600">{srv.base_price}€</span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="flex items-center justify-center gap-1 text-xs text-slate-500 font-medium">
                                            <Clock size={12} /> {srv.duration}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`badge ${difficultyColor(srv.difficulty)} badge-sm font-bold`}>
                                            {t(`servicios.dificultad_${srv.difficulty?.toLowerCase()}`)}
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

                                            {/* Modal Eliminar */}
                                            <dialog id={`deleteService${srv.id}`} className="modal text-left">
                                                <div className="modal-box">
                                                    <h3 className="font-bold text-lg text-rose-600">¿Eliminar servicio?</h3>
                                                    <p className="py-4">Se eliminará: <strong>{srv.name}</strong></p>
                                                    <div className="modal-action">
                                                        <button className="btn btn-error" onClick={() => handleDelete(srv.id)}>Eliminar</button>
                                                        <form method="dialog"><button className="btn">Cancelar</button></form>
                                                    </div>
                                                </div>
                                            </dialog>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="py-20 text-center opacity-20 font-bold uppercase tracking-widest text-slate-500">
                                        <Wrench size={48} className="mx-auto mb-2" />
                                        {t("services_table.no_results")}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <dialog id="edit_service_modal" className="modal modal-bottom sm:modal-middle backdrop-blur-sm">
                    <div className="modal-box max-w-3xl bg-base-100 p-0 overflow-hidden border border-slate-200 shadow-2xl">
                        {selectedService && (
                            <div key={selectedService.id}>
                                <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
                                    <h3 className="font-bold text-xl text-slate-800">{t("services_table.editTittle")}</h3>
                                    <button onClick={() => document.getElementById('edit_service_modal').close()} className="btn btn-circle btn-ghost btn-sm"><X size={20} /></button>
                                </div>

                                <form onSubmit={handleUpdate} className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-5">
                                            <div className="form-control">
                                                <label className="label text-[11px] font-bold uppercase text-slate-500 tracking-wider">{t("services_table.service")}</label>
                                                <input type="text" name="name" defaultValue={selectedService.name} className="input input-bordered focus:input-primary bg-slate-50/50 w-full" />
                                            </div>
                                            <div className="form-control">
                                                <label className="label text-[11px] font-bold uppercase text-slate-500 tracking-wider">{t("services_table.description")}</label>
                                                <textarea name="description" defaultValue={selectedService.description} className="textarea textarea-bordered focus:textarea-primary bg-slate-50/50 w-full h-32 resize-none" />
                                            </div>
                                        </div>

                                        <div className="space-y-5">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="form-control">
                                                    <label className="label text-[11px] font-bold uppercase text-slate-500 tracking-wider">{t("services_table.inicialPrice")}</label>
                                                    <input type="number" step="0.01" name="base_price" defaultValue={selectedService.base_price} className="input input-bordered w-full" />
                                                </div>
                                                <div className="form-control">
                                                    <label className="label text-[11px] font-bold uppercase text-slate-500 tracking-wider">{t("services_table.duration")}</label>
                                                    <input type="text" name="duration" defaultValue={selectedService.duration} className="input input-bordered w-full" placeholder="Ej: 45 min" />
                                                </div>
                                            </div>

                                            <div className="form-control">
                                                <label className="label text-[11px] font-bold uppercase text-slate-500 tracking-wider">{t("services_table.difficulty")}</label>
                                                <select name="difficulty" defaultValue={selectedService.difficulty} className="select select-bordered w-full">
                                                    <option value="Baja">{t("servicios.dificultad_baja")}</option>
                                                    <option value="Media">{t("servicios.dificultad_media")}</option>
                                                    <option value="Alta">{t("servicios.dificultad_alta")}</option>
                                                </select>
                                            </div>

                                            <div className="form-control">
                                                <label className="label text-[11px] font-bold uppercase text-slate-500 tracking-wider">{t("services_table.image")}</label>
                                                <div className="flex items-center gap-4">
                                                    <input 
                                                        type="file" name="image" accept="image/*" className="file-input file-input-bordered file-input-primary file-input-sm w-full"
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (file) setPreview(URL.createObjectURL(file));
                                                        }}
                                                    />
                                                    {preview && (
                                                        <div className="avatar">
                                                            <div className="w-12 h-12 rounded-lg ring ring-primary ring-offset-2">
                                                                <img src={preview.startsWith("blob") ? preview : `${import.meta.env.VITE_API_URL}${preview}`} alt="Preview" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="modal-action bg-slate-50 -m-6 mt-6 p-4 border-t border-slate-100">
                                        <button type="button" className="btn btn-ghost" onClick={() => document.getElementById('edit_service_modal').close()}>{t("stock_table.close")}</button>
                                        <button type="submit" className="btn btn-primary px-10 gap-2 shadow-lg shadow-primary/20">
                                            {loadingUpdate ? <span className="loading loading-spinner loading-sm"></span> : <Save size={18} />}
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
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Página {currentPage} / {totalPages || 1}</p>
                    <div className="join bg-slate-100 p-1 rounded-xl">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="btn btn-ghost btn-xs join-item"><ChevronLeft size={16} /></button>
                        <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(prev => prev + 1)} className="btn btn-ghost btn-xs join-item"><ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServicesTable;