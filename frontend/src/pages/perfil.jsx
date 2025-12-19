import { useState } from 'react'
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
            ? 'bg-white text-blue-700 font-semibold shadow-md' 
            : 'text-blue-100 hover:bg-blue-600 hover:shadow-sm'}
    `

    const renderContent = () => {
        switch (activeTab) {
            case 'informacion':
                return (
                    <div className="animate-fade-in">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold mb-2 text-slate-800">Información del Perfil</h2>
                            <p className="text-gray-500 text-sm">Actualiza los datos de tu cuenta y taller</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col">
                                <label className="text-xs font-semibold text-slate-600 uppercase mb-2 tracking-wide">
                                    Nombre Completo / Taller
                                </label>
                                <input 
                                    type="text" 
                                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
                                    defaultValue="AKOTAN Workshop" 
                                />
                            </div>
                            
                            <div className="flex flex-col">
                                <label className="text-xs font-semibold text-slate-600 uppercase mb-2 tracking-wide">
                                    Correo Electrónico
                                </label>
                                <input 
                                    type="email" 
                                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
                                    defaultValue="contacto@akotan.com" 
                                />
                            </div>
                            
                            <div className="flex flex-col">
                                <label className="text-xs font-semibold text-slate-600 uppercase mb-2 tracking-wide">
                                    Teléfono de Contacto
                                </label>
                                <input 
                                    type="text" 
                                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
                                    defaultValue="+34 600 000 000" 
                                />
                            </div>
                            
                            <div className="flex flex-col">
                                <label className="text-xs font-semibold text-slate-600 uppercase mb-2 tracking-wide">
                                    Ubicación
                                </label>
                                <input 
                                    type="text" 
                                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
                                    defaultValue="Madrid, España" 
                                />
                            </div>
                        </div>
                        
                        <button className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                            <Save size={18} />
                            Guardar Cambios
                        </button>
                    </div>
                )
            
            case 'vehiculos':
                return (
                    <div>
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold mb-2 text-slate-800">Mis Vehículos</h2>
                            <p className="text-gray-500 text-sm">Gestiona los vehículos registrados en tu cuenta</p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="p-5 border border-blue-200 bg-linear-to-br from-blue-50 to-white rounded-xl hover:shadow-md transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Car className="text-blue-600" size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-800">Toyota Corolla</p>
                                        <p className="text-sm text-slate-500 font-mono">1234-LMN</p>
                                    </div>
                                </div>
                            </div>
                            
                            <button className="p-5 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all font-medium flex items-center justify-center gap-2 min-h-[88px]">
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
                            <h2 className="text-3xl font-bold mb-2 text-slate-800">Próximas Citas</h2>
                            <p className="text-gray-500 text-sm">Administra tus citas programadas</p>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-all">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                    <div className="flex-1">
                                        <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full uppercase mb-2">
                                            Pendiente
                                        </span>
                                        <p className="text-lg font-bold text-slate-800 mb-1">Revisión de Frenos</p>
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <Calendar size={16} />
                                            <span>25 de Junio, 2025 - 10:30 AM</span>
                                        </div>
                                    </div>
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all whitespace-nowrap">
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
                            <h2 className="text-3xl font-bold mb-2 text-slate-800">Historial de Servicios</h2>
                            <p className="text-gray-500 text-sm">Consulta todos tus servicios realizados</p>
                        </div>
                        
                        <div className="overflow-x-auto -mx-4 sm:mx-0">
                            <div className="inline-block min-w-full align-middle">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                Fecha
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                Servicio
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                Coste
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        <tr className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                                                12/02/2025
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-700">
                                                Cambio de Aceite y Filtros
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                                                85.00€
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                                                05/01/2025
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-700">
                                                Cambio de Neumáticos (x2)
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                                                210.00€
                                            </td>
                                        </tr>
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
                            <h2 className="text-3xl font-bold mb-2 text-slate-800">Seguridad</h2>
                            <p className="text-gray-500 text-sm">Actualiza tu contraseña y configura la seguridad</p>
                        </div>
                        
                        <div className="max-w-md space-y-6">
                            <div className="flex flex-col">
                                <label className="text-xs font-semibold text-slate-600 uppercase mb-2 tracking-wide">
                                    Contraseña Actual
                                </label>
                                <input 
                                    type="password" 
                                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
                                    placeholder="••••••••"
                                />
                            </div>
                            
                            <div className="flex flex-col">
                                <label className="text-xs font-semibold text-slate-600 uppercase mb-2 tracking-wide">
                                    Nueva Contraseña
                                </label>
                                <input 
                                    type="password" 
                                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
                                    placeholder="••••••••"
                                />
                            </div>
                            
                            <div className="flex flex-col">
                                <label className="text-xs font-semibold text-slate-600 uppercase mb-2 tracking-wide">
                                    Confirmar Nueva Contraseña
                                </label>
                                <input 
                                    type="password" 
                                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
                                    placeholder="••••••••"
                                />
                            </div>
                            
                            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                                <Lock size={18} />
                                Actualizar Contraseña
                            </button>
                        </div>
                    </div>
                )
            
            default:
                return <p className="text-gray-400">Selecciona una opción del menú.</p>
        }
    }

    return (
        <div className='bg-slate-50 min-h-screen flex flex-col'>
            <Header />
            
            <div className="lg:hidden bg-white border-b border-slate-200 p-4">
                <button 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="flex items-center gap-2 text-blue-700 font-semibold"
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    <span>Menú</span>
                </button>
            </div>
            
            <main className='flex-1 p-4 md:p-6 lg:p-8'>
                <div className='flex flex-col lg:flex-row max-w-7xl mx-auto gap-6'>
                    
                    <aside className='hidden lg:block bg-blue-700 w-72 flex-none p-6 rounded-2xl shadow-xl'>
                        <div className="mb-10">
                            <h1 className='text-3xl font-black text-white tracking-tight'>AKOTAN</h1>
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

                        <div className="mt-auto pt-6 border-t border-blue-500/30">
                            <button 
                                onClick={() => navigate('/login')}
                                className='w-full text-left px-4 py-3 text-blue-100 hover:bg-blue-600 rounded-xl flex items-center gap-3 transition-all'
                            >
                                <LogOut size={20} />
                                <span>Cerrar Sesión</span>
                            </button>
                        </div>
                    </aside>

                    {mobileMenuOpen && (
                        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
                            <aside 
                                className='bg-blue-700 w-72 h-full p-6 shadow-2xl'
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex justify-between items-center mb-10">
                                    <div>
                                        <h1 className='text-3xl font-black text-white tracking-tight'>AKOTAN</h1>
                                    </div>
                                    <button onClick={() => setMobileMenuOpen(false)} className="text-white">
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

                                <div className="absolute bottom-6 left-6 right-6 pt-6 border-t border-blue-500/30">
                                    <button 
                                        onClick={() => navigate('/login')}
                                        className='w-full text-left px-4 py-3 text-blue-100 hover:bg-blue-600 rounded-xl flex items-center gap-3 transition-all'
                                    >
                                        <LogOut size={20} />
                                        <span>Cerrar Sesión</span>
                                    </button>
                                </div>
                            </aside>
                        </div>
                    )}

                    {/* Contenido principal */}
                    <section className='bg-white flex-1 p-6 md:p-8 lg:p-10 rounded-2xl shadow-lg border border-slate-200'>
                        {renderContent()}
                    </section>

                </div>
            </main>

            <Footer />
        </div>
    )
}

export default Perfil