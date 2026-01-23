import { useNavigate } from "react-router";
import logo from '/img/web/logo_no_background.webp'
import { Menu, X, User } from 'lucide-react'; // Añadimos el icono User
import { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from "../../context/ThemeContext";
import { AuthContext } from "../../context/AuthContext";

function Header() {
    const { t } = useTranslation(['header']);
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const { user, logout } = useContext(AuthContext); // user ya viene de tu Context

    const hoverLink = 'text-base-content hover:text-primary transition-colors duration-300 font-medium';

    const navItems = [
        { label: t('nav.bookings'), path: '/reservas' },
        { label: t('nav.products'), path: '/productos' },
        { label: t('nav.about'), path: '/sobre-nosotros' },
        // Si quieres que el engranaje solo aparezca logueado, podrías filtrarlo aquí
    ];

    return (
        <header className="sticky top-0 z-50 bg-base-100 dark:bg-base-200 text-base-content shadow-md border-b border-base-300">
            <div className="mx-auto px-4 sm:px-6 lg:px-3 xl:px-3 2xl:pr-10">
                <div className="flex items-center justify-between h-20">
                    <div
                        onClick={() => navigate('/')}
                        className="flex items-center space-x-4 cursor-pointer group"
                    >
                        <div className="relative">
                            <img
                                src={logo}
                                className="w-20 h-20 object-contain transition-transform duration-300 group-hover:scale-105"
                                alt="Logo Akotan"
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-base-content">AKOTAN</h1>
                            <p className="text-xs font-medium text-base-content/70">
                                {t('subtitle')}
                            </p>
                        </div>
                    </div>

                    {/* NAVEGACIÓN DESKTOP */}
                    <nav className="hidden md:flex items-center space-x-1">
                        <ul className="flex items-center space-x-1">
                            {navItems.map((item, index) => (
                                <li key={index}>
                                    <button
                                        onClick={() => navigate(item.path)}
                                        className={`px-4 py-2 cursor-pointer rounded-lg ${hoverLink} hover:bg-base-200 active:bg-base-300`}
                                    >
                                        {item.label}
                                    </button>
                                </li>
                            ))}
                            {/* Toggle de Tema */}
                            <li>
                                
                                <label className="swap swap-rotate ml-2 mr-2">
                                    {/* this hidden checkbox controls the state */}
                                    <input
                                        type="checkbox"
                                        checked={theme === "dark"}
                                        onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
                                    />

                                    {/* sun icon */}
                                    <svg
                                        className="swap-off h-5 w-5 fill-current"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24">
                                        <path
                                            d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                                    </svg>

                                    {/* moon icon */}
                                    <svg
                                        className="swap-on h-5 w-5 fill-current"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24">
                                        <path
                                            d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                                    </svg>
                                </label>
                            </li>
                        </ul>

                        <div className="h-9 w-px bg-base-300 mx-3"></div>

                        {/* --- LÓGICA DE BOTÓN DINÁMICO DESKTOP --- */}
                        {user ? (
                            <button
                                onClick={() => navigate('/perfil')}
                                className="ml-2 mr-4 cursor-pointer"
                            >
                                <User size={25} />
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/login')}
                                className="ml-4 cursor-pointer px-6 py-2.5 bg-primary text-primary-content rounded-xl font-semibold hover:bg-primary-focus transition-all duration-300 shadow-md"
                            >
                                {t('nav.login')}
                            </button>
                        )}
                    </nav>

                    {/* BOTÓN MENÚ MÓVIL */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-base-content hover:text-primary transition-colors"
                    >
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                {/* NAVEGACIÓN MÓVIL */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-base-300 py-4 animate-fadeIn">
                        <div className="flex flex-col space-y-1">
                            {navItems.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => { navigate(item.path); setIsMenuOpen(false); }}
                                    className="px-4 py-3 text-left text-base-content hover:text-primary hover:bg-base-200 rounded-lg transition-colors font-medium"
                                >
                                    {item.label}
                                </button>
                            ))}

                            <div className="pt-4 border-t border-base-300 mt-2">
                                {/* --- LÓGICA DE BOTÓN DINÁMICO MÓVIL --- */}
                                {user ? (
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => { navigate('/perfil'); setIsMenuOpen(false); }}
                                            className="w-full px-4 py-3 bg-secondary text-secondary-content rounded-xl font-semibold text-center"
                                        >
                                            Mi Perfil
                                        </button>
                                        <button
                                            onClick={() => { logout(); setIsMenuOpen(false); }}
                                            className="w-full px-4 py-3 border border-error text-error rounded-xl font-semibold"
                                        >
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => { navigate('/login'); setIsMenuOpen(false); }}
                                        className="w-full px-4 py-3 bg-primary text-primary-content rounded-xl font-semibold hover:bg-primary-focus transition-all duration-300"
                                    >
                                        {t('nav.login')}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
            `}</style>
        </header>
    );
}

export default Header;