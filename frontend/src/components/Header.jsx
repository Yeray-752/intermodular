import { useNavigate } from "react-router";
import logo from '/img/web/logo_no_background.webp'
import { Menu, X, User } from 'lucide-react'; // Añadimos el icono User
import { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";

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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-3 xl:px-3">
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
                                <label className="toggle text-base-content mt-0.5">
                                    <input
                                        type="checkbox"
                                        checked={theme === "dark"}
                                        onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
                                    />
                                    <svg aria-label="sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="fill-current"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2" /></svg>
                                    <svg aria-label="moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="fill-current"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
                                </label>
                            </li>
                        </ul>

                        <div className="h-6 w-px bg-base-300 mx-2"></div>

                        {/* --- LÓGICA DE BOTÓN DINÁMICO DESKTOP --- */}
                        {user ? (
                            <button
                                onClick={() => navigate('/perfil')}
                                className="ml-4 flex items-center gap-2 cursor-pointer px-5 py-2.5 bg-secondary text-secondary-content rounded-xl font-semibold hover:opacity-90 transition-all shadow-md"
                            >
                                <User size={18} />
                                <span>{user.name || 'Mi Perfil'}</span>
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