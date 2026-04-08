import { Edit3, Plus, Package, FileText, Tag, DollarSign, Image as ImageIcon, X, Save, Trash2, Wrench, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle2, XCircle, Search, Filter, Clock } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from "react-i18next";

const ServicesTable = ({ servicios, categorias, onUpdate }) => {
    const { t, i18n } = useTranslation("admin");
    const [langTab, setLangTab] = useState('es');
    const [translations, setTranslations] = useState({ es: {}, en: {} });

    const [selectedService, setSelectedService] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [filtro, setFiltro] = useState('todos');
    const [busqueda, setBusqueda] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [creatingService, setCreatingService] = useState(false);
    const [createLangTab, setCreateLangTab] = useState('es');

    const handleCreate = async (e) => {
        e.preventDefault();
        setCreatingService(true);
        const formData = new FormData(e.target);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/services`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    'x-lang': i18n.language
                },
                body: formData
            });

            if (response.ok) {
                document.getElementById('create_service_modal').close();
                e.target.reset();
                setCreateLangTab('es');
                await onUpdate();
            } else {
                const err = await response.json();
                console.error(err);
            }
        } catch (error) {
            console.error("Error al crear:", error);
        } finally {
            setCreatingService(false);
        }
    };

    const fetchTranslations = async (serviceId) => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/services/${serviceId}/translations`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
        });
        if (res.ok) {
            const data = await res.json();
            const map = {};
            data.forEach(t => map[t.language_code] = t);
            setTranslations(map);
        }
    };


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

                    <div className="flex items-center gap-4 w-full lg:w-auto">
                        {/* ✅ Botón nuevo servicio */}
                        <button
                            onClick={() => {
                                setCreateLangTab('es');
                                document.getElementById('create_service_modal').showModal();
                            }}
                            className="btn btn-primary gap-2 rounded-2xl shrink-0"
                        >
                            <Plus size={18} /> Nuevo servicio
                        </button>

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
                                                    setLangTab('es');
                                                    fetchTranslations(srv.id);
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

                                <form key={`${selectedService.id}-${translations.es?.name}`} onSubmit={handleUpdate} className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-5">
                                            {/* Pestañas ES/EN */}
                                            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
                                                {['es', 'en'].map(lang => (
                                                    <button
                                                        key={lang}
                                                        type="button"
                                                        onClick={() => setLangTab(lang)}
                                                        className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${langTab === lang ? 'bg-white shadow text-primary' : 'text-slate-400 hover:text-slate-600'
                                                            }`}
                                                    >
                                                        {lang === 'es' ? '🇪🇸 Español' : '🇬🇧 English'}
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="form-control">
                                                <label className="label gap-2 justify-start">
                                                    <Package size={14} className="text-primary" />
                                                    <span className="label-text font-semibold text-slate-600 uppercase text-[11px] tracking-wider">
                                                        {t("stock_table.th_product")}
                                                    </span>
                                                </label>
                                                {/* ES */}
                                                <input
                                                    type="text"
                                                    name="name_es"
                                                    defaultValue={translations.es?.name || ''}
                                                    className={`input input-bordered focus:input-primary bg-slate-50/50 w-full ${langTab !== 'es' ? 'hidden' : ''}`}
                                                    placeholder="Nombre en español..."
                                                />
                                                {/* EN */}
                                                <input
                                                    type="text"
                                                    name="name_en"
                                                    defaultValue={translations.en?.name || ''}
                                                    className={`input input-bordered focus:input-primary bg-slate-50/50 w-full ${langTab !== 'en' ? 'hidden' : ''}`}
                                                    placeholder="Name in English..."
                                                />
                                            </div>

                                            <div className="form-control">
                                                <label className="label gap-2 justify-start">
                                                    <FileText size={14} className="text-primary" />
                                                    <span className="label-text font-semibold text-slate-600 uppercase text-[11px] tracking-wider">
                                                        {t("stock_table.description")}
                                                    </span>
                                                </label>
                                                {/* ES */}
                                                <textarea
                                                    name="description_es"
                                                    defaultValue={translations.es?.description || ''}
                                                    className={`textarea textarea-bordered focus:textarea-primary bg-slate-50/50 w-full h-32 resize-none ${langTab !== 'es' ? 'hidden' : ''}`}
                                                    placeholder="Descripción en español..."
                                                />
                                                {/* EN */}
                                                <textarea
                                                    name="description_en"
                                                    defaultValue={translations.en?.description || ''}
                                                    className={`textarea textarea-bordered focus:textarea-primary bg-slate-50/50 w-full h-32 resize-none ${langTab !== 'en' ? 'hidden' : ''}`}
                                                    placeholder="Description in English..."
                                                />
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
            <dialog id="create_service_modal" className="modal modal-bottom sm:modal-middle backdrop-blur-sm">
                <div className="modal-box max-w-3xl bg-base-100 p-0 overflow-hidden border border-slate-200 shadow-2xl">

                    <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-xl text-slate-800">Nuevo servicio</h3>
                            <p className="text-sm text-slate-500 mt-1">Rellena todos los campos obligatorios</p>
                        </div>
                        <button onClick={() => document.getElementById('create_service_modal').close()} className="btn btn-circle btn-ghost btn-sm">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleCreate} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* IZQUIERDA - igual que productos */}
                            <div className="space-y-5">
                                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
                                    {['es', 'en'].map(lang => (
                                        <button key={lang} type="button" onClick={() => setCreateLangTab(lang)}
                                            className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${createLangTab === lang ? 'bg-white shadow text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                                        >
                                            {lang === 'es' ? '🇪🇸 Español' : '🇬🇧 English'}
                                        </button>
                                    ))}
                                </div>

                                <div className="form-control">
                                    <label className="label text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                                        Nombre <span className="text-rose-400">*</span>
                                    </label>
                                    <input type="text" name="name_es" required
                                        className={`input input-bordered focus:input-primary bg-slate-50/50 w-full ${createLangTab !== 'es' ? 'hidden' : ''}`}
                                        placeholder="Nombre en español..." />
                                    <input type="text" name="name_en"
                                        className={`input input-bordered focus:input-primary bg-slate-50/50 w-full ${createLangTab !== 'en' ? 'hidden' : ''}`}
                                        placeholder="Name in English..." />
                                </div>

                                <div className="form-control">
                                    <label className="label text-[11px] font-bold uppercase text-slate-500 tracking-wider">Descripción</label>
                                    <textarea name="description_es"
                                        className={`textarea textarea-bordered focus:textarea-primary bg-slate-50/50 w-full h-32 resize-none ${createLangTab !== 'es' ? 'hidden' : ''}`}
                                        placeholder="Descripción en español..." />
                                    <textarea name="description_en"
                                        className={`textarea textarea-bordered focus:textarea-primary bg-slate-50/50 w-full h-32 resize-none ${createLangTab !== 'en' ? 'hidden' : ''}`}
                                        placeholder="Description in English..." />
                                </div>
                            </div>

                            {/* DERECHA - campos específicos de servicio */}
                            <div className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="label text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                                            Precio base <span className="text-rose-400">*</span>
                                        </label>
                                        <input type="number" step="0.01" name="base_price" required
                                            className="input input-bordered focus:input-primary bg-slate-50/50 w-full" placeholder="0.00" />
                                    </div>
                                    <div className="form-control">
                                        <label className="label text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                                            Duración <span className="text-rose-400">*</span>
                                        </label>
                                        <input type="text" name="duration" required
                                            className="input input-bordered focus:input-primary bg-slate-50/50 w-full" placeholder="Ej: 45 min" />
                                    </div>
                                </div>

                                <div className="form-control">
                                    <label className="label text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                                        Dificultad <span className="text-rose-400">*</span>
                                    </label>
                                    <select name="difficulty" required className="select select-bordered focus:select-primary bg-slate-50/50 w-full">
                                        <option value="Baja">Baja</option>
                                        <option value="Media">Media</option>
                                        <option value="Alta">Alta</option>
                                    </select>
                                </div>

                                <div className="form-control">
                                    <label className="label text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                                        Categoría <span className="text-rose-400">*</span>
                                    </label>
                                    <select name="category_id" required className="select select-bordered focus:select-primary bg-slate-50/50 w-full">
                                        <option value="">Selecciona una categoría</option>
                                        {categorias?.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-control">
                                    <label className="label text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                                        Imagen <span className="text-rose-400">*</span>
                                    </label>
                                    <input type="file" name="image" accept="image/*" required
                                        className="file-input file-input-bordered file-input-primary file-input-sm w-full" />
                                </div>
                            </div>
                        </div>

                        <div className="modal-action bg-slate-50 -m-6 mt-6 p-4 border-t border-slate-100">
                            <button type="button" className="btn btn-ghost"
                                onClick={() => document.getElementById('create_service_modal').close()}>
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-primary px-10 gap-2 shadow-lg shadow-primary/20">
                                {creatingService
                                    ? <><span className="loading loading-spinner loading-sm"></span> Creando...</>
                                    : <><Plus size={18} /> Crear servicio</>
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
            <dialog id="create_service_modal" className="modal modal-bottom sm:modal-middle backdrop-blur-sm">
                <div className="modal-box max-w-3xl bg-base-100 p-0 overflow-hidden border border-slate-200 shadow-2xl">

                    <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-xl text-slate-800">Nuevo servicio</h3>
                            <p className="text-sm text-slate-500 mt-1">Rellena todos los campos obligatorios</p>
                        </div>
                        <button onClick={() => document.getElementById('create_service_modal').close()} className="btn btn-circle btn-ghost btn-sm">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleCreate} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* IZQUIERDA - igual que productos */}
                            <div className="space-y-5">
                                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
                                    {['es', 'en'].map(lang => (
                                        <button key={lang} type="button" onClick={() => setCreateLangTab(lang)}
                                            className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${createLangTab === lang ? 'bg-white shadow text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                                        >
                                            {lang === 'es' ? '🇪🇸 Español' : '🇬🇧 English'}
                                        </button>
                                    ))}
                                </div>

                                <div className="form-control">
                                    <label className="label text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                                        Nombre <span className="text-rose-400">*</span>
                                    </label>
                                    <input type="text" name="name_es" required
                                        className={`input input-bordered focus:input-primary bg-slate-50/50 w-full ${createLangTab !== 'es' ? 'hidden' : ''}`}
                                        placeholder="Nombre en español..." />
                                    <input type="text" name="name_en"
                                        className={`input input-bordered focus:input-primary bg-slate-50/50 w-full ${createLangTab !== 'en' ? 'hidden' : ''}`}
                                        placeholder="Name in English..." />
                                </div>

                                <div className="form-control">
                                    <label className="label text-[11px] font-bold uppercase text-slate-500 tracking-wider">Descripción</label>
                                    <textarea name="description_es"
                                        className={`textarea textarea-bordered focus:textarea-primary bg-slate-50/50 w-full h-32 resize-none ${createLangTab !== 'es' ? 'hidden' : ''}`}
                                        placeholder="Descripción en español..." />
                                    <textarea name="description_en"
                                        className={`textarea textarea-bordered focus:textarea-primary bg-slate-50/50 w-full h-32 resize-none ${createLangTab !== 'en' ? 'hidden' : ''}`}
                                        placeholder="Description in English..." />
                                </div>
                            </div>

                            {/* DERECHA - campos específicos de servicio */}
                            <div className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="label text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                                            Precio base <span className="text-rose-400">*</span>
                                        </label>
                                        <input type="number" step="0.01" name="base_price" required
                                            className="input input-bordered focus:input-primary bg-slate-50/50 w-full" placeholder="0.00" />
                                    </div>
                                    <div className="form-control">
                                        <label className="label text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                                            Duración <span className="text-rose-400">*</span>
                                        </label>
                                        <input type="text" name="duration" required
                                            className="input input-bordered focus:input-primary bg-slate-50/50 w-full" placeholder="Ej: 45 min" />
                                    </div>
                                </div>

                                <div className="form-control">
                                    <label className="label text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                                        Dificultad <span className="text-rose-400">*</span>
                                    </label>
                                    <select name="difficulty" required className="select select-bordered focus:select-primary bg-slate-50/50 w-full">
                                        <option value="Baja">Baja</option>
                                        <option value="Media">Media</option>
                                        <option value="Alta">Alta</option>
                                    </select>
                                </div>

                                <div className="form-control">
                                    <label className="label text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                                        Categoría <span className="text-rose-400">*</span>
                                    </label>
                                    <select name="category_id" required className="select select-bordered focus:select-primary bg-slate-50/50 w-full">
                                        <option value="">Selecciona una categoría</option>
                                        {categorias?.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-control">
                                    <label className="label text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                                        Imagen <span className="text-rose-400">*</span>
                                    </label>
                                    <input type="file" name="image" accept="image/*" required
                                        className="file-input file-input-bordered file-input-primary file-input-sm w-full" />
                                </div>
                            </div>
                        </div>

                        <div className="modal-action bg-slate-50 -m-6 mt-6 p-4 border-t border-slate-100">
                            <button type="button" className="btn btn-ghost"
                                onClick={() => document.getElementById('create_service_modal').close()}>
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-primary px-10 gap-2 shadow-lg shadow-primary/20">
                                {creatingService
                                    ? <><span className="loading loading-spinner loading-sm"></span> Creando...</>
                                    : <><Plus size={18} /> Crear servicio</>
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default ServicesTable;