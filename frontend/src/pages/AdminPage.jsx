import { useState, useMemo } from 'react';
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
    MoreHorizontal
} from 'lucide-react';
import Header from "../components/Principal/Header";
import Footer from "../components/Principal/Footer";

function AdminPage() {
    const [activeTab, setActiveTab] = useState('reservas');

    // --- DATOS (Consistencia con tus imágenes) ---
    const [reservas, setReservas] = useState([
        { id: 1, cliente: "Marcos Soler", servicio: "Cambio de Aceite y Filtro", vehiculo: "toyota corolla", fecha: "2024-03-22", hora: "09:00", estado: "pendiente" },
        { id: 2, cliente: "Laura Méndez", servicio: "Kit de Frenos Cerámicos", vehiculo: "Honde XR 650", fecha: "2024-03-23", hora: "11:30", estado: "pendiente" },
    ]);

    const menuItems = useMemo(() => [
        { id: 'metricas', label: 'Estadisticas', icon: LayoutDashboard },
        { id: 'reservas', label: 'Gestión de Reservas', icon: ClipboardList },
        { id: 'servicios', label: 'Servicios', icon: Wrench },
        { id: 'productos', label: 'Productos', icon: Wrench },
        { id: 'stock', label: 'Stock de Productos', icon: Package },
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
                <h2 className="text-3xl font-black mb-2 text-slate-800 tracking-tight">Reservas</h2>
            </div>
            <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm">
                <table className="table w-full border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr className="text-slate-400 uppercase text-[10px] tracking-widest text-left">
                            <th className="p-4 font-bold">Cliente</th>
                            <th className="p-4 font-bold">Servicio</th>
                            <th className="p-4 font-bold">Vehiculo</th>
                            <th className="p-4 font-bold">Horario</th>
                            <th className="p-4 font-bold">Estado</th>
                            <th className="p-4 font-bold text-center">Gestión</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {reservas.map((res) => (
                            <tr key={res.id} className="hover:bg-slate-50/50">
                                <td className="p-4 font-bold text-slate-700">{res.cliente}</td>
                                <td className="p-4 text-sm text-slate-500">{res.servicio}</td>
                                <td className="p-4 text-sm text-slate-500">{res.vehiculo}</td>
                                <td className="p-4 text-xs font-mono text-slate-400">{res.fecha} • {res.hora}</td>
                                <td className="p-4 text-sm text-slate-500">{res.estado}</td>
                                <td className="p-4">
                                    <div className="flex justify-center gap-3">
                                        <button className="text-emerald-300 hover:text-emerald-500 transition-colors">
                                            <CheckCircle size={20} />
                                        </button>
                                        <button className="text-rose-200 hover:text-rose-600 transition-colors">
                                            <XCircle size={20} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const RenderCatalogo = () => (
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
                {/* Servicio */}
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

                {/* Producto */}
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

    const renderContent = () => {
        switch (activeTab) {
            case 'reservas': return <RenderReservas />;
            case 'servicios':
            case 'productos': return <RenderCatalogo />;
            case 'metricas':
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
        <div className="bg-[#fcfcfc] min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 p-4 md:p-8 lg:p-7">
                <div className="flex flex-col lg:flex-row max-w-7xl mx-auto gap-4">
                    
                    {/* Sidebar Refinado */}
                    <aside className="lg:flex flex-col bg-white w-full lg:w-80 flex-none p-8 rounded-3xl border border-slate-200 shadow-sm">
                    
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

                    {/* Contenido Principal */}
                    <section className="bg-white p-8 border border-slate-200 shadow-sm flex-1 rounded-3xl min-h-[600px]">
                        {renderContent()}
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default AdminPage;