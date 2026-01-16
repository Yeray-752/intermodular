import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { User, Car, Calendar, FileText, Lock, LogOut, Menu, X, Save, Plus } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';
import { workshopSchema } from '../schemas/perfilGeneralSchemas'

function Perfil() {
    const [activeTab, setActiveTab] = useState('informacion');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation('profile');

    const toggleLanguage = () => {
        const newLang = i18n.language === 'es' ? 'en' : 'es';
        i18n.changeLanguage(newLang);
    };

    // Array de items del menú recalculado cada vez que cambia el idioma
    const menuItems = useMemo(() => [
        { id: 'informacion', label: t('account'), icon: User },
        { id: 'vehiculos', label: t('myCars'), icon: Car },
        { id: 'citas', label: t('myAppointments'), icon: Calendar },
        { id: 'historial', label: t('history'), icon: FileText },
        { id: 'password', label: t('security'), icon: Lock }
    ], [t, i18n.language]);

    // Array de campos de información del perfil
    const profileFields = useMemo(() => [
        { label: t('nameWorkshop'), type: "text", value: "AKOTAN Workshop" },
        { label: t('phone'), type: "text", value: "+34 600 000 000" },
        { label: t('location'), type: "text", value: "Madrid, España" },
    ], [t, i18n.language]);

    // Labels de campos de contraseña
    const passwordFields = useMemo(() => [
        t('currentPassword'),
        t('newPassword'),
        t('confirmPassword')
    ], [t, i18n.language]);

    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();

        // Creamos un objeto con los datos del formulario
        const formData = new FormData(e.target);
        const data = {
            nombreTaller: formData.get("nombreTaller"),
            telefono: formData.get("telefono"),
            ubicacion: formData.get("ubicacion"),
        };

        // Validamos con Zod
        const result = workshopSchema.safeParse(data);

        if (!result.success) {
            // Si hay errores, los guardamos en el estado
            const fieldErrors = result.error.flatten().fieldErrors;
            setErrors(fieldErrors);
        } else {
            // Si todo está bien, limpiamos errores y enviamos
            setErrors({});
            console.log("Datos válidos, enviando:", result.data);
            // Aquí iría tu llamada a la API
        }
    };

    const campos = [
        { name: "nombreTaller", label: "Nombre Completo / Taller", type: "text", value: "AKOTAN Workshop" },
        { name: "telefono", label: "Teléfono de Contacto", type: "text", value: "+34 600 000 000" },
        { name: "ubicacion", label: "Ubicación", type: "text", value: "Madrid, España" },
    ];


    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setMobileMenuOpen(false);
    };

    const menuBtnStyle = (tab) => `
        w-full text-left px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-3
        ${activeTab === tab
            ? 'bg-base-100 text-primary font-semibold shadow-md'
            : 'text-base-content/70 hover:bg-base-200 hover:shadow-sm'}
    `;

    const renderContent = () => {
        switch (activeTab) {
            case 'informacion':
                return (
                    <div>
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold mb-2 text-base-content">{t('profileInfo')}</h2>
                            <p className="text-base-content/70 text-sm">{t('updateProfileData')}</p>
                        </div>


                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {campos.map((field, i) => (
                                    <div className="flex flex-col" key={field.name}>
                                        <label className="text-xs font-semibold text-base-content/70 uppercase mb-2 tracking-wide">
                                            {field.label}
                                        </label>
                                        <input
                                            name={field.name} // IMPORTANTE para el FormData
                                            type={field.type}
                                            defaultValue={field.value}
                                            className={`p-3 border rounded-lg outline-none transition-all bg-base-100 text-base-content 
                                    ${errors[field.name]
                                                    ? 'border-error ring-1 ring-error'
                                                    : 'border-base-300 focus:ring focus:ring-primary/50 focus:border-transparent'
                                                }`}
                                        />

                                        {errors[field.name] && (
                                            <span className="text-error text-[10px] mt-1 font-bold uppercase">
                                                {errors[field.name][0]}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {profileFields.map((field, i) => (
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

                                <div className="flex items-center gap-3">
                                    <p>{t('theme')}</p>
                                    <label className="toggle text-base-content mt-0.5">
                                        <input
                                            type="checkbox"
                                            checked={theme === "dark"}
                                            onChange={(e) =>
                                                setTheme(e.target.checked ? "dark" : "light")
                                            }
                                        />
                                        <svg aria-label="sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="fill-current">
                                            <circle cx="12" cy="12" r="4" />
                                            <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
                                        </svg>
                                        <svg aria-label="moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="fill-current">
                                            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                                        </svg>
                                    </label>

                                    <button className='btn btn-accent' onClick={toggleLanguage}>
                                        {t('changeLanguage')}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className="mt-8 btn btn-primary flex items-center gap-2">
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

                            <button className="p-5 border-2 border-dashed border-base-300 rounded-xl text-base-content/70 hover:border-primary hover:text-primary hover:bg-base-200 transition-all font-medium flex items-center justify-center gap-2 min-h-[88px]">
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
                            <h2 className="text-3xl font-bold mb-2 text-base-content">{t('upcomingAppointments')}</h2>
                            <p className="text-base-content/70 text-sm">{t('updateProfileData')}</p>
                        </div>
                        {/* Aquí el resto del contenido de citas permanece igual */}
                        <button className="btn btn-primary whitespace-nowrap">
                            {t('manage')}
                        </button>
                    </div>
                );

            case 'historial':
                return (
                    <div>
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold mb-2 text-base-content">{t('serviceHistory')}</h2>
                            <p className="text-base-content/70 text-sm">{t('checkAllServices')}</p>
                        </div>
                        {/* Tabla de historial permanece igual */}
                    </div>
                );

            case 'password':
                return (
                    <div className='pt-2 place-self-center'>
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold mb-2 text-base-content">{t('security')}</h2>
                            <p className="text-base-content/70 text-sm">{t('updatePassword')}</p>
                        </div>

                        <div className="max-w-md space-y-6">
                            {passwordFields.map((label, i) => (
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
                                {t('updatePassword')}
                            </button>
                        </div>
                    </div>
                );

            default:
                return <p className="text-base-content/50">Selecciona una opción del menú.</p>;
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
                    <span>{t('menu')}</span>
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
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        className={menuBtnStyle(item.id)}
                                        onClick={() => setActiveTab(item.id)}
                                    >
                                        <Icon size={20} />
                                        <span>{item.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                        <div className="mt-auto pt-6 border-t border-base-300">
                            <button
                                onClick={() => navigate('/login')}
                                className='w-full text-left px-4 py-3 text-base-content/70 hover:bg-base-200 rounded-xl flex items-center gap-3 transition-all'
                            >
                                <LogOut size={20} />
                                <span>{t('logout')}</span>
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
                                        const Icon = item.icon;
                                        return (
                                            <button
                                                key={item.id}
                                                className={menuBtnStyle(item.id)}
                                                onClick={() => handleTabChange(item.id)}
                                            >
                                                <Icon size={20} />
                                                <span>{item.label}</span>
                                            </button>
                                        );
                                    })}
                                </nav>
                                <div className="absolute bottom-6 left-6 right-6 pt-6 border-t border-base-300">
                                    <button
                                        onClick={() => navigate('/login')}
                                        className='w-full text-left px-4 py-3 text-base-content/70 hover:bg-base-200 rounded-xl flex items-center gap-3 transition-all'
                                    >
                                        <LogOut size={20} />
                                        <span>{t('logout')}</span>
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
    );
}

export default Perfil;
