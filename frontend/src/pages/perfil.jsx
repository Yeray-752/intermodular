import { useState, useEffect, useMemo } from 'react';
import { data, useNavigate } from 'react-router';
import { User, Car, Calendar, FileText, Lock, LogOut, Menu, X, Save, Plus, Clock } from 'lucide-react';
import Header from '../components/Principal/Header';
import Footer from '../components/Principal/Footer';
import { useTranslation } from 'react-i18next';
import { workshopSchema } from '../schemas/perfilGeneralSchemas';
import SelectorCanarias from '../components/perfil/selectorCanarias';
import AdminButton from '../components/AdminComponents/AdminBoton';

function Perfil() {
    const [activeTab, setActiveTab] = useState('informacion');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingCitas, setLoadingCitas] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { t, i18n } = useTranslation('profile');
    const [citas, setCitas] = useState([])
    const token = localStorage.getItem("token");
    const [error, setError] = useState(null);
    // 1. CARGAR DATOS DEL PERFIL DESDE EL BACKEND
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await fetch("http://localhost:3000/api/users/profile/me", {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserProfile(data);
                } else {
                    localStorage.removeItem("token");
                    navigate("/login");
                }
            } catch (error) {
                console.error("Error al conectar con el servidor:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const trearCitas = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        setLoadingCitas(true); // Cambiado aquí
        try {
            const response = await fetch("http://localhost:3000/api/dates", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            if (response.ok) {
                const data = await response.json();
                setCitas(data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingCitas(false); // Cambiado aquí
        }
    };
    useEffect(() => {
        if (activeTab === 'citas') {
            trearCitas();
        }
    }, [activeTab]);

    const eliminarCitas = async (id) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Confirmación amistosa antes de borrar
        if (!confirm(t('confirm_cancel') || "¿Estás seguro de que deseas cancelar esta cita?")) return;

        try {
            const response = await fetch(`http://localhost:3000/api/dates/${id}/cancelada`, {
                method: 'PATCH', // Importante: debe coincidir con router.patch
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                // Optimistic UI: Filtramos la cita de la lista actual para que desaparezca al instante
                setCitas(prevCitas => prevCitas.filter(cita => cita.id !== id));
                alert(t('cancel_success') || "Cita cancelada correctamente");
            } else {
                const errorData = await response.json();
                alert(errorData.error || "Error al cancelar la cita");
            }
        } catch (err) {
            console.error("Error en la petición:", err);
            alert("No se pudo conectar con el servidor");
        }
    };

    const toggleLanguage = () => {
        const newLang = i18n.language === 'es' ? 'en' : 'es';
        i18n.changeLanguage(newLang);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("rol");
        navigate("/");
        location.reload()
    };

    // 2. ENVIAR ACTUALIZACIÓN AL BACKEND
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        // Validamos con Zod
        const result = workshopSchema.safeParse(data);

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            setErrors(fieldErrors);
            return;
        }

        setErrors({});

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3000/api/users/profile/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(result.data)
            });

            if (response.ok) {
                alert(t('update_success') || "Perfil actualizado correctamente");
            } else {
                alert("Error al actualizar los datos");
            }
        } catch (error) {
            console.error("Error en el envío:", error);
        }
    };

    // Mapeo dinámico de campos con los datos de la DB
    const campos = useMemo(() => [
        { name: "nombre", label: t('name') || "Nombre / Taller", type: "text", value: userProfile?.nombre || "" },
        { name: "apellidos", label: t('apellidos') || "Apellidos", type: "text", value: userProfile?.apellidos || "" },
        { name: "direccion", label: t('location') || "Dirección", type: "text", value: userProfile?.direccion || "" },
    ], [userProfile, t]);

    const menuItems = useMemo(() => [
        { id: 'informacion', label: t('account'), icon: User },
        { id: 'vehiculos', label: t('myCars'), icon: Car },
        { id: 'citas', label: t('myAppointments'), icon: Calendar },
        { id: 'historial', label: t('history'), icon: FileText },
        { id: 'seguridad', label: t('security'), icon: Lock }
    ], [t]);

    const menuBtnStyle = (tab) => `
        w-full text-left px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-3
        ${activeTab === tab
            ? 'bg-base-100 text-primary font-semibold shadow-md'
            : 'text-base-content/70 hover:shadow-lg'}
    `;



    const renderContent = () => {
        if (loading) return <div className="py-20 text-center font-bold">Cargando datos de perfil...</div>;
        switch (activeTab) {
            case 'informacion':
                return (
                    <div>
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold mb-2 text-base-content">{t('profileInfo')}</h2>
                            <p className="text-base-content/70 text-sm">{t('updateProfileData')}</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {campos.map((field) => (
                                    <div className="flex flex-col" key={field.name}>
                                        <label className="text-xs font-semibold text-base-content/70 uppercase mb-2 tracking-wide">
                                            {field.label}
                                        </label>
                                        <input
                                            name={field.name}
                                            type={field.type}
                                            defaultValue={field.value}
                                            className={`p-3 border rounded-lg outline-none transition-all bg-base-100 text-base-content 
                                                ${errors[field.name] ? 'border-error ring-1 ring-error' : 'border-base-300 focus:ring focus:ring-primary/50'}`}
                                        />
                                        {errors[field.name] && (
                                            <span className="text-error text-[10px] mt-1 font-bold uppercase">
                                                {errors[field.name][0]}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Selector de Islas y Municipios */}
                            <div className="mb-6">
                                <SelectorCanarias />
                            </div>

                            <button type="submit" className="mt-4 btn text-base-100 border-0 bg-primary-content flex items-center gap-2">
                                <Save size={18} />
                                {t('saveChanges')}
                            </button>
                        </form>
                    </div>
                );
            case 'vehiculos':
                return (
                    <div>
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold mb-2 text-base-content">{t('myCars')}</h2>
                            <p className="text-base-content/70 text-sm">{t('updateProfileData')}</p>
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
                            <button className="p-5 border-2 border-dashed border-base-300 rounded-xl text-base-content/70 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2">
                                <Plus size={20} />
                                {t('addCar')}
                            </button>
                        </div>
                    </div>
                );
            case 'citas':
                return (
                    <div>
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold mb-2 text-base-content">{t('myAppointments')}</h2>
                            <p className="text-base-content/70 text-sm">{t('manageActiveAppointments')}</p>
                        </div>

                        <div className="space-y-4">
                            {/* Ejemplo de una cita activa */}
                            {loadingCitas ? (
                                <div className="py-10 text-center flex flex-col items-center gap-3">
                                    <span className="loading loading-spinner loading-lg text-primary"></span>
                                    <p className="font-bold">Cargando tus citas...</p>
                                </div>
                            ) : citas.length > 0 ? (
                                citas.map(citas => (
                                    <div className="p-6 border  bg-base-100 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4" key={citas.id}>
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                                <Calendar size={28} />
                                            </div>
                                            <div>
                                                <h4 className="font-extrabold text-lg text-base-content uppercase tracking-tight">{citas.servicio}</h4>
                                                <p className="text-sm text-base-content/60 font-medium">{citas.vahiculo_selecionado}</p>
                                                <div className="flex items-center gap-2 mt-1 font-bold text-xs">
                                                    <Clock size={14} />
                                                    <span>{citas.fecha_cita}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-t-0 pt-3 md:pt-0">
                                            <span className="badge badge-warning badge-md font-bold py-3 px-4 uppercase text-[10px]">{citas.estado}</span>
                                            <button className="btn btn-ghost btn-sm text-error hover:bg-error/10" onClick={() => eliminarCitas(citas.id)}>{t('cancel')}</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center py-10">No tienes citas programadas.</p>
                            )}




                        </div>
                    </div>
                );

            case 'historial':
                return (
                    <div>
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold mb-2 text-base-content">{t('history')}</h2>
                            <p className="text-base-content/70 text-sm">{t('pastServicesHistory')}</p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="table w-full border-separate border-spacing-y-2">
                                <thead>
                                    <tr className="text-base-content/50 uppercase text-[10px] tracking-widest border-none">
                                        <th>{t('service')}</th>
                                        <th>{t('date')}</th>
                                        <th>{t('status')}</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-base-200/40 hover:bg-base-200 transition-colors rounded-xl">
                                        <td className="font-bold rounded-l-xl">Revisión General</td>
                                        <td className="text-sm">10/01/2026</td>
                                        <td><div className="badge badge-success badge-outline font-bold text-[10px]">COMPLETADA</div></td>
                                        <td className="text-right rounded-r-xl">
                                            <button className="btn btn-ghost btn-xs text-primary underline font-bold">PDF</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'seguridad':
                return (
                    <div className='justify-self-center-safe'>
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold mb-2 text-base-content">{t('security')}</h2>
                            <p className="text-base-content/70 text-sm">{t('updatePasswordInfo')}</p>
                        </div>

                        <div className="max-w-md space-y-6">
                            <div className="form-control w-full">
                                <label className="label uppercase text-[10px] font-bold text-base-content/60">{t('currentPassword')}</label>
                                <input type="password" placeholder="••••••••" className="input input-bordered focus:input-primary w-full bg-base-100" />
                            </div>
                            <div className="form-control w-full">
                                <label className="label uppercase text-[10px] font-bold text-base-content/60">{t('newPassword')}</label>
                                <input type="password" placeholder="••••••••" className="input input-bordered focus:input-primary w-full bg-base-100" />
                            </div>
                            <button className="btn bg-primary-content text-base-100 border-0 shadow-lg shadow-primary/20 gap-2">
                                <Lock size={18} />
                                {t('updatePassword')}
                            </button>
                        </div>
                    </div>
                );
            // Otros casos (citas, historial, password) omitidos por brevedad pero se mantienen igual que en tu lógica original
            default:
                return <p className="text-base-content/50">Selecciona una opción del menú.</p>;
        }
    }

    return (
        <div className='bg-neutral min-h-screen flex flex-col'>
            <Header />

            {/* Mobile menu - visible solo en móviles */}
            <div className="lg:hidden bg-base-100 border-b border-base-300 p-4">
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="flex items-center gap-2 text-base-content font-semibold"
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    <span>{t('menu')}</span>
                </button>
            </div>

            <main className='flex-1 p-4 md:p-6 lg:p-8'>
                <div className='flex flex-col lg:flex-row max-w-7xl mx-auto gap-6'>
                    {/* Sidebar Desktop */}
                    <aside className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:flex flex-col bg-base-100 w-full lg:w-72 flex-none p-6 rounded-2xl shadow-xl`}>
                        <div className="mb-10 hidden lg:block">
                            <h1 className='text-3xl font-black text-base-content tracking-tight'>AKOTAN</h1>
                        </div>
                        <nav className='space-y-2 flex-1'>
                            {menuItems.map(item => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        className={menuBtnStyle(item.id)}
                                        onClick={() => {
                                            setActiveTab(item.id);
                                            setMobileMenuOpen(false);
                                        }}
                                    >
                                        <Icon size={20} />
                                        <span>{item.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                        <div className="mt-4 border-t border-base-300 space-y-1">
                            <AdminButton />
                            <button onClick={toggleLanguage} className='w-full text-left px-4 py-3 text-xs font-bold uppercase text-base-content/50 hover:text-primary flex items-center gap-3'>
                                <span className="text-lg">🌐</span>
                                <span>{i18n.language === 'es' ? 'English (EN)' : 'Español (ES)'}</span>
                            </button>
                            <button onClick={handleLogout} className='w-full text-left px-4 py-3 text-error/70 hover:bg-error/10 rounded-xl flex items-center gap-3 transition-all'>
                                <LogOut size={20} />
                                <span>{t('logout')}</span>
                            </button>
                        </div>
                    </aside>

                    {/* Contenido principal */}
                    <section className='bg-base-100 flex-1 p-6 md:p-8 lg:p-10 rounded-2xl shadow-lg max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar'>
                        {renderContent()}
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Perfil;