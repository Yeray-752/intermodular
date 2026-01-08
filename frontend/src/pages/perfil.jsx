import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { User, Car, Calendar, FileText, Lock, LogOut, Menu, X, Save, Plus } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

function Perfil() {
    const [activeTab, setActiveTab] = useState('informacion')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const navigate = useNavigate()

    const menuItems = [
        { id: 'informacion', label: 'Cuenta', icon: User },
        { id: 'vehiculos', label: 'Mis Vehículos', icon: Car },
        { id: 'citas', label: 'Mis Citas', icon: Calendar },
        { id: 'historial', label: 'Historial', icon: FileText },
        { id: 'password', label: 'Seguridad', icon: Lock }
    ]


    const handleTabChange = (tab) => {
        setActiveTab(tab)
        setMobileMenuOpen(false)
    }

    const menuBtnStyle = (tab) => `
        w-full text-left px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-3
        ${activeTab === tab
            ? 'bg-base-100 text-primary font-semibold shadow-md'
            : 'text-base-content/70 hover:bg-base-200 hover:shadow-sm'}
    `

    const renderContent = () => {
        switch (activeTab) {
            case 'informacion':
                return (
                    <div className="animate-fade-in">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold mb-2 text-base-content">Información del Perfil</h2>
                            <p className="text-base-content/70 text-sm">Actualiza los datos de tu cuenta y taller</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { label: "Nombre Completo / Taller", type: "text", value: "AKOTAN Workshop" },
                                { label: "Correo Electrónico", type: "email", value: "contacto@akotan.com" },
                                { label: "Teléfono de Contacto", type: "text", value: "+34 600 000 000" },
                                { label: "Ubicación", type: "text", value: "Madrid, España" },
                            ].map((field, i) => (
                                <div className="flex flex-col" key={i}>
                                    <label className="text-xs font-semibold text-base-content/70 uppercase mb-2 tracking-wide">
                                        {field.label}
                                    </label>
                                    <input
                                        type={field.type}
                                        className="p-3 border border-base-300 rounded-lg focus:ring focus:ring-primary/50 focus:border-transparent outline-none transition-all bg-base-100 text-base-content"
                                        defaultValue={field.value}
                                    />
                                </div>
                            ))}

                            
                        </div>

                        <button className="mt-8 btn btn-primary flex items-center gap-2">
                            <Save size={18} />
                            Guardar Cambios
                        </button>
                    </div>
                )

            case 'vehiculos':
                return (
                    <div>
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold mb-2 text-base-content">Mis Vehículos</h2>
                            <p className="text-base-content/70 text-sm">Gestiona los vehículos registrados en tu cuenta</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="p-5 border border-base-300 bg-base-100 rounded-xl hover:shadow-md transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-base-200 rounded-full flex items-center justify-center">
                                        <Car className="text-primary" size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-base-content">Toyota Corolla</p>
                                        <p className="text-sm text-base-content/50 font-mono">1234-LMN</p>
                                    </div>
                                </div>
                            </div>

                            <button className="p-5 border-2 border-dashed border-base-300 rounded-xl text-base-content/70 hover:border-primary hover:text-primary hover:bg-base-200 transition-all font-medium flex items-center justify-center gap-2 min-h-[88px]">
                                <Plus size={20} />
                                Añadir Vehículo
                            </button>
                        </div>
                    </div>
                )

            case 'citas':
                return (
                    <div>
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold mb-2 text-base-content">Próximas Citas</h2>
                            <p className="text-base-content/70 text-sm">Administra tus citas programadas</p>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-base-100 border border-base-300 rounded-xl p-6 hover:shadow-md transition-all">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                    <div className="flex-1">
                                        <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full uppercase mb-2">
                                            Pendiente
                                        </span>
                                        <p className="text-lg font-bold text-base-content mb-1">Revisión de Frenos</p>
                                        <div className="flex items-center gap-2 text-sm text-base-content/50">
                                            <Calendar size={16} />
                                            <span>25 de Junio, 2025 - 10:30 AM</span>
                                        </div>
                                    </div>
                                    <button className="btn btn-primary whitespace-nowrap">
                                        Gestionar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )

            case 'historial':
                return (
                    <div>
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold mb-2 text-base-content">Historial de Servicios</h2>
                            <p className="text-base-content/70 text-sm">Consulta todos tus servicios realizados</p>
                        </div>

                        <div className="overflow-x-auto -mx-4 sm:mx-0">
                            <div className="inline-block min-w-full align-middle">
                                <table className="min-w-full divide-y divide-base-300">
                                    <thead className="bg-base-200">
                                        <tr>
                                            {["Fecha", "Servicio", "Coste"].map((th, i) => (
                                                <th key={i} className="px-6 py-4 text-left text-xs font-semibold text-base-content/70 uppercase tracking-wider">{th}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-base-100 divide-y divide-base-300">
                                        {[
                                            ["12/02/2025", "Cambio de Aceite y Filtros", "85.00€"],
                                            ["05/01/2025", "Cambio de Neumáticos (x2)", "210.00€"]
                                        ].map((row, i) => (
                                            <tr key={i} className="hover:bg-base-200 transition-colors">
                                                {row.map((cell, j) => (
                                                    <td key={j} className="px-6 py-4 text-sm text-base-content">{cell}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )

            case 'password':
                return (
                    <div className='pt-2 place-self-center'>
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold mb-2 text-base-content">Seguridad</h2>
                            <p className="text-base-content/70 text-sm">Actualiza tu contraseña y configura la seguridad</p>
                        </div>

                        <div className="max-w-md space-y-6">
                            {["Contraseña Actual", "Nueva Contraseña", "Confirmar Nueva Contraseña"].map((label, i) => (
                                <div className="flex flex-col" key={i}>
                                    <label className="text-xs font-semibold text-base-content/70 uppercase mb-2 tracking-wide">{label}</label>
                                    <input
                                        type="password"
                                        className="p-3 border border-base-300 rounded-lg focus:ring focus:ring-primary/50 focus:border-transparent outline-none transition-all bg-base-100 text-base-content"
                                        placeholder="••••••••"
                                    />
                                </div>
                            ))}
                            <button className="btn btn-primary flex items-center gap-2">
                                <Lock size={18} />
                                Actualizar Contraseña
                            </button>
                        </div>
                    </div>
                )

            default:
                return <p className="text-base-content/50">Selecciona una opción del menú.</p>
        }
    }

    return (
        <div className='bg-base-200 min-h-screen flex flex-col'>
            <Header />

            {/* Mobile menu */}
            <div className="lg:hidden bg-base-100 border-b border-base-300 p-4">
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="flex items-center gap-2 text-base-content font-semibold"
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    <span>Menú</span>
                </button>
            </div>

            <main className='flex-1 p-4 md:p-6 lg:p-8'>
                <div className='flex flex-col lg:flex-row max-w-7xl mx-auto gap-6'>
                    {/* Sidebar */}
                    <aside className='hidden lg:block bg-base-100 w-72 flex-none p-6 rounded-2xl shadow-xl'>
                        <div className="mb-10">
                            <h1 className='text-3xl font-black text-base-content tracking-tight'>AKOTAN</h1>
                        </div>
                        <nav className='space-y-2'>
                            {menuItems.map(item => {
                                const Icon = item.icon
                                return (
                                    <button
                                        key={item.id}
                                        className={menuBtnStyle(item.id)}
                                        onClick={() => setActiveTab(item.id)}
                                    >
                                        <Icon size={20} />
                                        <span>{item.label}</span>
                                    </button>
                                )
                            })}
                        </nav>
                        <div className="mt-auto pt-6 border-t border-base-300">
                            <button
                                onClick={() => navigate('/login')}
                                className='w-full text-left px-4 py-3 text-base-content/70 hover:bg-base-200 rounded-xl flex items-center gap-3 transition-all'
                            >
                                <LogOut size={20} />
                                <span>Cerrar Sesión</span>
                            </button>
                        </div>
                    </aside>

                    {/* Mobile menu */}
                    {mobileMenuOpen && (
                        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
                            <aside
                                className='bg-base-100 w-72 h-full p-6 shadow-2xl'
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex justify-between items-center mb-10">
                                    <h1 className='text-3xl font-black text-base-content tracking-tight'>AKOTAN</h1>
                                    <button onClick={() => setMobileMenuOpen(false)} className="text-base-content">
                                        <X size={28} />
                                    </button>
                                </div>
                                <nav className='space-y-2'>
                                    {menuItems.map(item => {
                                        const Icon = item.icon
                                        return (
                                            <button
                                                key={item.id}
                                                className={menuBtnStyle(item.id)}
                                                onClick={() => handleTabChange(item.id)}
                                            >
                                                <Icon size={20} />
                                                <span>{item.label}</span>
                                            </button>
                                        )
                                    })}
                                </nav>
                                <div className="absolute bottom-6 left-6 right-6 pt-6 border-t border-base-300">
                                    <button
                                        onClick={() => navigate('/login')}
                                        className='w-full text-left px-4 py-3 text-base-content/70 hover:bg-base-200 rounded-xl flex items-center gap-3 transition-all'
                                    >
                                        <LogOut size={20} />
                                        <span>Cerrar Sesión</span>
                                    </button>
                                </div>
                            </aside>
                        </div>
                    )}

                    {/* Contenido principal */}
                    <section className='bg-base-100 flex-1 p-6 md:p-8 lg:p-10 rounded-2xl shadow-lg border border-base-300'>
                        {renderContent()}
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default Perfil
