import { useState, useMemo, useEffect } from 'react';
import {
    LayoutDashboard, ClipboardList, Wrench, Package, TrendingUp,
    CheckCircle, XCircle, Plus, ImageIcon, Bell
} from 'lucide-react';
import { useTranslation } from "react-i18next";
import Header from "../components/Principal/Header";
import Footer from "../components/Principal/Footer";
import Calendario from "../components/AdminComponents/Calendario";
import StockTable from '../components/AdminComponents/StockTable';
import { VentasChart } from "../components/AdminComponents/estadisticas";
import AdminNotifications from "../components/AdminComponents/adminNotifications";
import ServicesTable from '../components/AdminComponents/ServicesTable';
function AdminPage() {
    const [activeTab, setActiveTab] = useState('reservas');
    const [loading, setLoading] = useState(true);
    const [errors, setError] = useState({});
    const [eventos, setEventos] = useState([]);
    const [listaProductos, setListaProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [listaServicios, setListaServicios] = useState([]);
    const [categoriasServicios, setCategoriasServicios] = useState([]);

    const { t, i18n } = useTranslation("admin");

    const fetchDatos = async () => {
        try {
            const [resProd, resCat] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_URL}/api/products`),
                fetch(`${import.meta.env.VITE_API_URL}/api/product_categories`)
            ]);

            const dataProd = await resProd.json();
            const dataCat = await resCat.json();

            setListaProductos(dataProd);
            setCategorias(dataCat);

        } catch (err) {
            console.error("Error cargando datos:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchServicios = async () => {
        try {
            const [resSrv, resCat] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_URL}/api/services`),
                fetch(`${import.meta.env.VITE_API_URL}/api/service_categories`)
            ]);
            const dataSrv = await resSrv.json();
            const dataCat = await resCat.json();
            setListaServicios(dataSrv);
            setCategoriasServicios(dataCat);
        } catch (err) {
            console.error("Error cargando servicios:", err);
        }
    };

    useEffect(() => {
        if (activeTab === 'reservas') {
            trearCitas();
            cargarEventosCalendario();
        }
        if (activeTab === 'stock') fetchDatos();
        if (activeTab === 'servicios') fetchServicios(); // ← añade esto
    }, [activeTab]);

    const RenderServicios = () => (

        <ServicesTable servicios={listaServicios} categorias={categoriasServicios} onUpdate={fetchServicios} />
    );

    // --- LÓGICA DE DATOS ---
    const ActualizarCitas = async (id, estado) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        if (!confirm(t("reservas.confirm_cancel"))) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/dates/actualizar/${id}/${estado}`, {
                method: 'PATCH',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                setReservas(prev => prev.filter(res => res.id !== id));
                if (estado === 'procesando') cargarEventosCalendario();
            } else {
                const errorData = await response.json();
                alert(errorData.error || t("reservas.error_cancel"));
            }
        } catch (err) {
            alert(t("reservas.error_server"));
        }
    };

    const trearCitas = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/dates/admin/pendientes`, {
                headers: { "Authorization": `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                const datosLimpios = data.map(res => ({
                    ...res,
                    fecha_cita: typeof res.fecha_cita === 'string'
                        ? res.fecha_cita.split('T')[0]
                        : new Date(res.fecha_cita).toISOString().split('T')[0]
                }));
                setReservas(datosLimpios);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const cargarEventosCalendario = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/dates/admin/procesando`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
            const data = await res.json();
            const format = data.map(c => ({
                id: c.id.toString(),
                title: `${c.nombre_cliente} - ${c.servicio}`,
                start: `${c.fecha_cita}`,
                backgroundColor: '#10b981',
                allDay: false
            }));
            setEventos(format);
        }
    };

    useEffect(() => {
        if (activeTab === 'reservas') {
            trearCitas();
            cargarEventosCalendario();
        }
        if (activeTab === 'stock') fetchDatos();
    }, [activeTab]);

    const menuItems = useMemo(() => [
        { id: 'metricas', label: t("menu.metricas"), icon: LayoutDashboard },
        { id: 'reservas', label: t("menu.reservas"), icon: ClipboardList },
        { id: 'notificaciones', label: "Notificaciones", icon: Bell },
        { id: 'stock', label: t("menu.stock"), icon: Package },
        { id: 'servicios', label: t("menu.servicios"), icon: Package },
        { id: 'productos', label: t("menu.productos"), icon: Wrench },
    ], [t]);

    const menuBtnStyle = (tab) => `
        w-full text-left px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-3
        ${activeTab === tab ? 'bg-slate-900 text-white font-bold shadow-md' : 'text-slate-500 hover:bg-slate-100'}
    `;

    // --- SECCIONES TRADUCIDAS ---

    const RenderReservas = () => (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-black mb-2 text-base-content tracking-tight">{t("reservas.title")}</h2>
            </div>
            <div className="overflow-x-auto bg-white rounded-2xl border-3 border-neutral shadow-sm">
                <table className="table w-full border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr className="text-slate-400 uppercase text-[10px] tracking-widest text-center">
                            <th className="p-4 font-bold text-base-200">{t("reservas.cliente")}</th>
                            <th className="p-4 font-bold text-base-200">{t("reservas.servicio")}</th>
                            <th className="p-4 font-bold text-base-200">{t("reservas.vehiculo")}</th>
                            <th className="p-4 font-bold text-base-200">{t("reservas.dia")}</th>
                            <th className="p-4 font-bold text-base-200">{t("reservas.estado")}</th>
                            <th className="p-4 font-bold text-base-200 text-center">{t("reservas.gestion")}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {reservas.map((res) => (
                            <tr key={res.id} className="text-center">
                                <td className="p-4 font-bold text-base-200">{res.nombre_cliente}</td>
                                <td className="p-4 font-bold text-base-200">{res.servicio}</td>
                                <td className="p-4 font-bold text-base-200">{res.vehiculo_seleccionado}</td>
                                <td className="p-4 font-bold font-mono text-base-200">{res.fecha_cita.split('T')[0].split('-').reverse().join('/')}</td>
                                <td className="p-4 font-bold text-base-200">{res.estado}</td>
                                <td className="p-4 flex justify-center gap-3">
                                    <button onClick={() => ActualizarCitas(res.id, 'procesando')} className="text-emerald-300 hover:text-emerald-500"><CheckCircle size={20} /></button>
                                    <button onClick={() => ActualizarCitas(res.id, 'cancelada')} className="text-rose-200 hover:text-rose-600"><XCircle size={20} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-8">
                <Calendario key={eventos.length} initialEvents={eventos} />
            </div>
        </div>
    );

    const RenderActualizacionProducto = () => (
        <div>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-black mb-2 text-slate-800 tracking-tight">{t("productos.title")}</h2>
                    <p className="text-slate-500 text-sm">{t("productos.subtitle")}</p>
                </div>
                <button className="btn bg-slate-900 hover:bg-slate-800 text-white border-none normal-case flex gap-2 rounded-xl px-6">
                    <Plus size={18} /> {t("productos.new")}
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-800">
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex gap-5 items-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center"><Wrench className="text-slate-300" /></div>
                    <div className="flex-1">
                        <h3 className="font-bold">{t("productos.aceite")}</h3>
                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mt-1">{t("productos.dificultad_baja")}</p>
                        <p className="text-2xl font-black text-orange-600 mt-2">70.00€</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const RenderStock = () => (
        <StockTable productos={listaProductos} categorias={categorias} />
    );

    const RenderActualizacionServicios = () => {
        const handleSubmit = async (e) => {
            e.preventDefault();
            const form = e.target;
            const formData = new FormData(form);
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/services`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData
                });
                if (res.ok) {
                    alert(t("servicios.success"));
                    form.reset();
                } else {
                    alert(t("servicios.error"));
                }
            } catch (error) {
                alert(t("servicios.error_connection"));
            }
        };

        return (
            <div className="max-w-4xl mx-auto bg-base-100 rounded-2xl shadow-xl p-8 border border-base-200">
                <h2 className="text-3xl font-black text-base-content uppercase tracking-tight flex items-center gap-3 mb-2">
                    <Plus className="text-primary" /> {t("servicios.title")}
                </h2>
                <p className="text-base-content/60 text-sm mb-8">{t("servicios.subtitle")}</p>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="text-[10px] font-bold uppercase text-base-content/60 tracking-widest">{t("servicios.foto")}</label>
                            <div className="relative w-full h-64 bg-base-200 rounded-2xl border-2 border-dashed border-base-300 flex flex-col items-center justify-center overflow-hidden">
                                <ImageIcon size={48} className="text-base-content/40" />
                                <span className="text-xs font-medium mt-2">{t("servicios.upload")}</span>
                                <input type="file" name="image" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" required />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="form-control">
                                <label className="label text-[10px] font-bold uppercase text-base-content/60 tracking-widest">{t("servicios.titulo")}</label>
                                <input type="text" name="name" className="input input-bordered w-full" required />
                            </div>
                            <div className="form-control">
                                <label className="label text-[10px] font-bold uppercase text-base-content/60 tracking-widest">{t("servicios.dificultad")}</label>
                                <select name="difficulty" className="select select-bordered w-full" required>
                                    <option value="baja">{t("servicios.dificultad_baja")}</option>
                                    <option value="media">{t("servicios.dificultad_media")}</option>
                                    <option value="alta">{t("servicios.dificultad_alta")}</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" name="duration" placeholder={t("servicios.tiempo")} className="input input-bordered" required />
                                <input type="number" name="base_price" placeholder={t("servicios.precio")} className="input input-bordered" required />
                            </div>

                        </div>

                    </div>
                    <textarea name="description" className="textarea textarea-bordered w-full" placeholder={t("servicios.descripcion")}></textarea>
                    <div className="flex justify-end pt-4">
                        <button type="submit" className="btn btn-primary">{t("servicios.guardar")}</button>
                    </div>
                </form>
            </div>
        );
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'reservas': return <RenderReservas />;
            case 'servicios': return <RenderServicios />;
            case 'productos': return <RenderActualizacionProducto />;
            case 'stock': return <RenderStock />;
            case 'notificaciones': return <AdminNotifications />;
            case 'metricas': return (
                <div>
                    <VentasChart />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
                        {['ventas_hoy', 'citas_pendientes', 'cierre_mensual'].map((key) => (
                            <div key={key} className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">{t(`metricas.${key}`)}</p>
                                <p className="text-4xl font-black text-slate-800 italic">--</p>
                                <TrendingUp size={16} className="mx-auto mt-4 text-slate-200" />
                            </div>
                        ))}
                    </div>
                </div>
            );
            default: return <RenderReservas />;
        }
    };

    return (
        <div className="bg-base-300 min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 p-4 md:p-8 lg:p-7">
                <div className="flex flex-col lg:flex-row max-w-7xl mx-auto gap-4">
                    <aside className="lg:flex flex-col bg-info w-full lg:w-80 flex-none p-8 rounded-3xl shadow-sm">
                        <nav className="space-y-3 flex-1">
                            {menuItems.map(item => (
                                <button key={item.id} className={menuBtnStyle(item.id)} onClick={() => setActiveTab(item.id)}>
                                    <item.icon size={18} strokeWidth={2.5} />
                                    <span className="text-sm tracking-tight">{item.label}</span>
                                </button>
                            ))}
                        </nav>
                        <div className="mt-12 pt-8 border-t border-slate-100 text-center">
                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{t("general.panel")}</p>
                        </div>
                    </aside>
                    <section className="bg-info p-8 border shadow-sm flex-1 rounded-3xl min-h-150">
                        {renderContent()}
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default AdminPage;