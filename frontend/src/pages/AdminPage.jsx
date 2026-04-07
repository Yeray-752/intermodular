import { useState, useMemo, use } from 'react';
import {
    LayoutDashboard,
    ClipboardList,
    Wrench,
    Package,
    TrendingUp,
    Bell,
    CheckCircle,
    XCircle,
    Plus,
    ImageIcon,
    Tag,
    BarChart,
    Clock,
    FileText,
    Save,
    MoreHorizontal
} from 'lucide-react';
import Header from "../components/Principal/Header";
import Footer from "../components/Principal/Footer";
import Calendario from "../components/AdminComponents/Calendario";
import StockTable from '../components/AdminComponents/StockTable';
import { VentasChart } from "../components/AdminComponents/estadisticas"
import { useEffect } from 'react';


function AdminPage() {
    const [activeTab, setActiveTab] = useState('reservas');
    const [loading, setLoading] = useState(true);
    const [errors, setError] = useState({});
    const [eventos, setEventos] = useState([]);
    const [listaProductos, setListaProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [datosVentas, setDatosVentas] = useState([]);
    const [filtro, setFiltro] = useState('semana');

    // --- DATOS (Consistencia con tus imágenes) ---
    const [reservas, setReservas] = useState([]);

    const ActualizarCitas = async (id, estado) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Confirmación amistosa antes de borrar
        if (!confirm("¿Estás seguro de que deseas cancelar esta cita?")) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/dates/actualizar/${id}/${estado}`, {
                method: 'PATCH', // Importante: debe coincidir con router.patch
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                // Optimistic UI: Filtramos la cita de la lista actual para que desaparezca al instante
                setReservas(prev => prev.filter(res => res.id !== id));

                // 2. Si la pasamos a procesando, recargamos el calendario para que aparezca
                if (estado === 'procesando') {
                    cargarEventosCalendario();
                }

            } else {
                const errorData = await response.json();
                alert(errorData.error || "Error al cancelar la cita");
            }
        } catch (err) {
            console.error("Error en la petición:", err);
            alert("No se pudo conectar con el servidor");
        }
    };

    const trearCitas = async () => {
        const token = localStorage.getItem("token"); // Obtener el token localmente
        if (!token) return;

        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/dates/admin/pendientes`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            if (response.ok) {
                const data = await response.json();

                // --- AQUÍ ESTÁ EL TRUCO ---
                // Limpiamos los datos antes de guardarlos para que JS no los convierta en Date
                const datosLimpios = data.map(res => ({
                    ...res,
                    // Si fecha_cita es un objeto Date o un string ISO, 
                    // lo forzamos a ser solo "YYYY-MM-DD"
                    fecha_cita: typeof res.fecha_cita === 'string'
                        ? res.fecha_cita.split('T')[0]
                        : new Date(res.fecha_cita).toISOString().split('T')[0]
                }));

                setReservas(datosLimpios);
            } else {
                throw new Error("Error al obtener las citas");
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

            const format = data.map(c => {
                // Si la fecha viene como "2026-02-16T23:00:00.000Z"
                // Al hacer el split por 'T', nos quedamos con "2026-02-16"
                /*   const fechaLimpia = c.fecha_cita.split('T')[0]; */


                return {
                    id: c.id.toString(),
                    title: `${c.nombre_cliente} - ${c.servicio}`,
                    // Forzamos una hora de inicio clara dentro del rango visible del calendario
                    start: `${c.fecha_cita}`,
                    descripcion: `${c.comentarios}`,
                    // Añadimos una hora de fin para que el bloque tenga cuerpo en la vista de semana
                    end: `${c.fecha_cita}`,
                    vehiculo: `${c.vehiculo_seleccionado}`,
                    backgroundColor: '#10b981', // Verde esmeralda para citas en proceso
                    borderColor: '#059669',
                    allDay: false
                };
            });
            setEventos(format);

        }
    };

    const fetchDatos = async () => {
        try {

            const [resProd, resCat] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_URL}/api/products`)
            ]);
            const dataProd = await resProd.json();
            setListaProductos(dataProd);

        } catch (err) {
            console.error("Error cargando el mercado:", err);
        } finally {
            setLoading(false);
        }
    };

    const traerVentas = async () => {
        const token = localStorage.getItem("token");
        // Pasamos el filtro en la URL
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/ventas?filter=${filtro}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        setDatosVentas(data);
    };

    // Cada vez que 'filtro' cambie, pedimos datos nuevos
    useEffect(() => {
        if (activeTab === 'metricas') {
            traerVentas();
        }
    }, [activeTab, filtro]);


    useEffect(() => {
        if (activeTab === 'reservas') {
            trearCitas();
            cargarEventosCalendario();
        }
        if (activeTab === 'stock') {
            fetchDatos();
        }

    }, [activeTab]);

    const [workOrder, setWorkOrder] = useState({
    id: "FAC-2024-001",
    clientName: "Carlos Gómez",
    clientDni: "44555666R",
    carModel: "Volkswagen Golf GTI",
    plate: "5588-KBC",
    items: [
      { desc: "Cambio Pastillas Freno", qty: 1, price: 85.00 },
      { desc: "Líquido de frenos", qty: 1, price: 15.50 }
    ]
  });


    const menuItems = useMemo(() => [

        { id: 'metricas', label: 'Estadisticas', icon: LayoutDashboard },
        { id: 'reservas', label: 'Gestión de Reservas', icon: ClipboardList },
        { id: 'stock', label: 'Stock de Productos', icon: Package },
        { id: 'listaServicios', label: 'Lista de Servicios', icon: ClipboardList},
        { id: 'servicios', label: 'Servicios', icon: Wrench },
        { id: 'productos', label: 'Productos', icon: Wrench },
    ], []);

    // Estilo de botones: Sin azul, ahora negro/slate profesional
    const menuBtnStyle = (tab) => `
        w-full text-left px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-3
        ${activeTab === tab
            ? 'bg-slate-900 text-white font-bold shadow-md'
            : 'text-slate-500 hover:bg-slate-100'}
    `;

    // --- SECCIONES ---


    const RenderReservas = () => (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-black mb-2 text-base-content tracking-tight">Reservas</h2>
            </div>

            <div className="overflow-x-auto bg-white rounded-2xl border-3 border-neutral shadow-sm">
                <table className="table w-full border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr className="text-slate-400 uppercase text-[10px] tracking-widest text-center">
                            <th className="p-4 font-bold text-base-200">Cliente</th>
                            <th className="p-4 font-bold text-base-200">Servicio</th>
                            <th className="p-4 font-bold text-base-200">Vehiculo</th>
                            <th className="p-4 font-bold text-base-200">Dia</th>
                            <th className="p-4 font-bold text-base-200">Estado</th>
                            <th className="p-4 font-bold text-base-200 text-center">Gestión</th>
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
                                <td className="p-4">
                                    <div className="flex justify-center gap-3">
                                        <button onClick={() => ActualizarCitas(res.id, 'procesando')} className="text-emerald-300 hover:text-emerald-500 transition-colors">
                                            <CheckCircle size={20} />
                                        </button>
                                        <button onClick={() => ActualizarCitas(res.id, 'cancelada')} className="text-rose-200 hover:text-rose-600 transition-colors">
                                            <XCircle size={20} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
                <Calendario key={eventos.length} initialEvents={eventos} />
            </div>
        </div>
    );

    const RenderActualilzacionProducto = () => (
        <div>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-black mb-2 text-slate-800 tracking-tight">Catálogo Taller</h2>
                    <p className="text-slate-500 text-sm">Administración de precios y existencias.</p>
                </div>
                <button className="btn bg-slate-900 hover:bg-slate-800 text-white border-none normal-case flex gap-2 rounded-xl px-6">
                    <Plus size={18} /> Nuevo Registro
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-800">
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex gap-5 items-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                        <Wrench className="text-slate-300" size={24} />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold">Cambio de Aceite y Filtro</h3>
                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mt-1">45 MIN • Dificultad Baja</p>
                        <p className="text-2xl font-black text-orange-600 mt-2">70.00€</p>
                    </div>
                    <button className="text-slate-300 hover:text-slate-600"><MoreHorizontal /></button>
                </div>

                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex gap-5 items-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                        <Package className="text-slate-300" size={24} />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-slate-700">Kit de Frenos Cerámicos</h3>
                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mt-1">Stock: 20 UNIDADES</p>
                        <p className="text-2xl font-black text-orange-600 mt-2">145.50€</p>
                    </div>
                    <button className="text-slate-300 hover:text-slate-600"><MoreHorizontal /></button>
                </div>
            </div>
        </div>
    );
    const RenderStock = () => (
        <div>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-black mb-2 text-base-content tracking-tight">Stock</h2>
                    <p className="text-base-content text-sm">Administración de precios y existencias.</p>
                </div>

            </div>

            <div className=" ">
                <StockTable productos={listaProductos} categorias={categorias} />
            </div>
        </div>
    );
    const RenderActualilzacionServicios = () => (
        <div className="max-w-4xl mx-auto bg-base-100 rounded-2xl shadow-xl p-8 border border-base-200">
            <div className="mb-8">
                <h2 className="text-3xl font-black text-base-content uppercase tracking-tight flex items-center gap-3">
                    <Plus className="text-primary" /> Crear Nuevo Servicio
                </h2>
                <p className="text-base-content/60 text-sm">Rellena los detalles para añadir un nuevo servicio al catálogo del taller.</p>
            </div>

            <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    <div className="flex flex-col gap-4">
                        <label className="text-[10px] font-bold uppercase text-base-content/60 tracking-widest">Foto del Servicio</label>
                        <div className="relative group w-full h-64 bg-base-200 rounded-2xl border-2 border-dashed border-base-300 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-primary">

                            <div className="flex flex-col items-center text-base-content/40">
                                <ImageIcon size={48} strokeWidth={1} />
                                <span className="text-xs font-medium mt-2">Click para subir imagen</span>
                            </div>

                            <input
                                type="file"
                                name="foto"

                                className="absolute inset-0 opacity-0 cursor-pointer"
                                accept="image/*"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="form-control">
                            <label className="label text-[10px] font-boldx uppercase text-base-content/60 tracking-widest">Título del Servicio</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-3 flex items-center text-base-content/30"><Tag size={18} /></span>
                                <input type="text" name="titulo" placeholder="Ej: Cambio de Aceite Sintético" className="input input-bordered w-full pl-10 focus:input-primary bg-base-100" required />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label text-[10px] font-bold uppercase text-base-content/60 tracking-widest">Dificultad</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-3 flex items-center text-base-content/30"><BarChart size={18} /></span>
                                <select name="dificultad" className="select select-bordered w-full pl-10 focus:select-primary bg-base-100" required>
                                    <option value="baja">Baja</option>
                                    <option value="media">Media</option>
                                    <option value="alta">Alta</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label text-[10px] font-bold uppercase text-base-content/60 tracking-widest">Tiempo Aprox.</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-3 flex items-center text-base-content/30"><Clock size={18} /></span>
                                    <input type="text" name="tiempo" placeholder="1h 30m" className="input input-bordered w-full pl-10 focus:input-primary bg-base-100" required />
                                </div>
                            </div>
                            <div className="form-control">
                                <label className="label text-[10px] font-bold uppercase text-base-content/60 tracking-widest">Precio (€)</label>
                                <input type="number" name="precio" placeholder="0.00" step="0.01" className="input input-bordered w-full focus:input-primary bg-base-100 font-bold text-primary" required />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-control">
                    <label className="label text-[10px] font-bold uppercase text-base-content/60 tracking-widest">Descripción Detallada</label>
                    <div className="relative">
                        <span className="absolute top-3 left-3 text-base-content/30"><FileText size={18} /></span>
                        <textarea name="descripcion" className="textarea textarea-bordered w-full pl-10 h-32 focus:textarea-primary bg-base-100" placeholder="Describe qué incluye este servicio..."></textarea>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-base-200">
                    <button type="button" className="btn btn-ghost">Cancelar</button>
                    <button type="submit" className="btn btn-primary px-8 shadow-lg shadow-primary/20 gap-2">
                        <Save size={18} />
                        Guardar Servicio
                    </button>
                </div>
            </form>
        </div>
    );
    const RenderListaServicios = () => (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-black mb-2 text-base-content tracking-tight">Servicios</h2>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'reservas': return <RenderReservas />;
            case 'servicios': return <RenderActualilzacionServicios />;
            case 'productos': return <RenderActualilzacionProducto />;
            case 'stock': return <RenderStock />;
            case 'listaServicios': return <RenderListaServicios />;
            case 'metricas': return (
                <div>
                    {activeTab === 'metricas' && (
                        <div className="p-4 bg-base-300 rounded-box">
                            {/* FILTRO: Botones de daisyUI */}
                            <div className="flex justify-end mb-4">
                                <div className="join border border-base-300">
                                    <button
                                        className={`text-base-100 join-item btn btn-sm ${filtro === 'semana' ? 'btn-primary' : ''}`}
                                        onClick={() => setFiltro('semana')}
                                    >
                                        Semana
                                    </button>
                                    <button
                                        className={`text-base-100 join-item btn btn-sm ${filtro === 'año' ? 'btn-primary' : ''}`}
                                        onClick={() => setFiltro('año')}
                                    >
                                        Año
                                    </button>
                                </div>
                            </div>
                            <VentasChart data={datosVentas} />
                        </div>
                    )}
                </div>
            );
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {['Ventas Hoy', 'Citas Pendientes', 'Cierre Mensual'].map((item, i) => (
                            <div key={i} className="p-8 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">{item}</p>
                                <p className="text-4xl font-black text-slate-800 italic">--</p>
                                <TrendingUp size={16} className="mx-auto mt-4 text-slate-200" />
                            </div>
                        ))}
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
                            {menuItems.map(item => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        className={menuBtnStyle(item.id)}
                                        onClick={() => setActiveTab(item.id)}
                                    >
                                        <Icon size={18} strokeWidth={2.5} />
                                        <span className="text-sm tracking-tight">{item.label}</span>
                                    </button>
                                );
                            })}
                        </nav>

                        <div className="mt-12 pt-8 border-t border-slate-100 text-center">
                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Panel de Control General</p>
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