import { useNavigate } from "react-router";
import logo from '/img/web/logo_no_background.webp'
import { Menu, X, User, ShoppingCart } from 'lucide-react';
import { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from "../../context/ThemeContext";
import { AuthContext } from "../../context/AuthContext";

function Header() {
    const { t } = useTranslation(['header']);
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const { user, logout } = useContext(AuthContext);

    const hoverLink = 'text-base-content hover:text-primary transition-colors duration-300 font-medium';

    const navItems = [
        { label: t('nav.bookings'), path: '/reservas' },
        { label: t('nav.products'), path: '/productos' },
        { label: t('nav.about'), path: '/sobre-nosotros' },
    ];

    return (
        /* Envolvemos el header en el contenedor drawer */
        <div className="drawer drawer-end sticky top-0 z-[60]">
            <input id="my-drawer-5" type="checkbox" className="drawer-toggle" />
            
            <div className="drawer-content flex flex-col">
                {/* --- HEADER REAL --- */}
                <header className="bg-base-100 dark:bg-base-200 text-base-content shadow-md border-b border-base-300 w-full">
                    <div className="mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-20">
                            {/* LOGO */}
                            <div onClick={() => navigate('/')} className="flex items-center space-x-4 cursor-pointer group">
                                <img src={logo} className="w-16 h-16 object-contain group-hover:scale-105 transition-transform" alt="Logo" />
                                <div className="hidden sm:block">
                                    <h1 className="text-xl font-bold">AKOTAN</h1>
                                    <p className="text-xs opacity-70">{t('subtitle')}</p>
                                </div>
                            </div>

                            {/* NAVEGACIÓN DESKTOP */}
                            <nav className="hidden md:flex items-center space-x-4">
                                {navItems.map((item, index) => (
                                    <button key={index} onClick={() => navigate(item.path)} className={hoverLink}>
                                        {item.label}
                                    </button>
                                ))}
                                
                                {/* Theme Toggle */}
                                <label className="swap swap-rotate mx-2">
                                    <input type="checkbox" checked={theme === "dark"} onChange={(e) => setTheme(e.target.checked ? "dark" : "light")} />
                                    <svg className="swap-off h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" /></svg>
                                    <svg className="swap-on h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" /></svg>
                                </label>

                                <div className="h-8 w-px bg-base-300 mx-2"></div>

                                {user ? (
                                    <div className="flex items-center space-x-4">
                                        {/* ICONO CARRITO (Disparador del Drawer) */}
                                        <label htmlFor="my-drawer-5" className="btn btn-ghost btn-circle drawer-button">
                                            <ShoppingCart size={24} />
                                        </label>
                                        
                                        <button onClick={() => navigate('/perfil')} className="btn btn-ghost btn-circle">
                                            <User size={24} />
                                        </button>
                                    </div>
                                ) : (
                                    <button onClick={() => navigate('/login')} className="btn btn-primary btn-md rounded-xl font-bold">
                                        {t('nav.login')}
                                    </button>
                                )}
                            </nav>

                            {/* BOTÓN MÓVIL */}
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden btn btn-ghost btn-circle">
                                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                            </button>
                        </div>
                    </div>
                    
                    {/* MENU MÓVIL (Simple) */}
                    {isMenuOpen && (
                        <div className="md:hidden bg-base-100 p-4 border-t border-base-300 flex flex-col gap-2">
                             {navItems.map((item, index) => (
                                <button key={index} onClick={() => {navigate(item.path); setIsMenuOpen(false)}} className="text-left py-2 px-4 hover:bg-base-200 rounded-lg">
                                    {item.label}
                                </button>
                            ))}
                            {user && (
                                <label htmlFor="my-drawer-5" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 py-2 px-4 text-primary font-bold">
                                    <ShoppingCart size={20}/> Carrito
                                </label>
                            )}
                        </div>
                    )}
                </header>
            </div>

            {/* --- CONTENIDO LATERAL (Drawer Side) --- */}
            <div className="drawer-side z-80">
                <label htmlFor="my-drawer-5" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="menu p-4 w-90 min-h-full bg-base-100 text-base-content shadow-2xl flex flex-col">
                    <div className="flex items-center justify-between mb-6 border-b pb-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <ShoppingCart className="text-primary" /> Tu Carrito
                        </h2>
                        <label htmlFor="my-drawer-5" className="btn btn-sm btn-circle btn-ghost">✕</label>
                    </div>
                    
                    {/* Contenido del Carrito */}
                    <div className="grow">
                        <p className="text-center text-slate-400 mt-10 italic">El carrito está vacío</p>
                    </div>

                    <div className="border-t pt-4">
                        <button className="btn btn-primary w-full">Finalizar Compra</button>
                    </div>
                </div>
            </div>
            
        </div>
    );
}

export default Header;