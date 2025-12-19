import { useNavigate } from "react-router";
import logo from '../assets/img/logo_no_background.webp'
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

function Header() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const hoverLink = 'text-base-content hover:text-primary transition-colors duration-300 font-medium';

    return (
        <header className="sticky top-0 z-50 bg-base-100 dark:bg-base-200 text-base-content shadow-md border-b border-base-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo y nombre */}
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
                            <p className="text-xs font-medium text-base-content/70">TALLER MECÁNICO</p>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        <ul className="flex items-center  space-x-1">
                            {[
                                { label: 'Inicio', path: '/' },
                                { label: 'Reservas', path: '/reservas' },
                                { label: 'Productos', path: '/productos' },
                                { label: 'Sobre Nosotros', path: '/sobre-nosotros' },
                                { label: '⚙️', path: '/perfil' },
                            ].map(item => (
                                <li key={item.path}>
                                    <button
                                        onClick={() => navigate(item.path)}
                                        className={`px-4 py-2 cursor-pointer rounded-lg ${hoverLink} hover:bg-base-200 active:bg-base-300`}
                                    >
                                        {item.label}
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="h-6 w-px bg-base-300 mx-2"></div>

                        <button
                            onClick={() => navigate('/login')}
                            className="ml-4 cursor-pointer px-6 py-2.5 bg-primary text-primary-content rounded-xl font-semibold hover:bg-primary-focus transition-all duration-300 shadow-md"
                        >
                            Iniciar Sesión
                        </button>
                    </nav>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-base-content hover:text-primary transition-colors"
                    >
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-base-300 py-4 animate-fadeIn">
                        <div className="flex flex-col space-y-1">
                            {[
                                { label: 'Inicio', path: '/' },
                                { label: 'Servicios', path: '/servicios' },
                                { label: 'Reservas', path: '/reservas' },
                                { label: 'Productos', path: '/productos' },
                                { label: 'Sobre Nosotros', path: '/sobre-nosotros' },
                            ].map(item => (
                                <button
                                    key={item.path}
                                    onClick={() => { navigate(item.path); setIsMenuOpen(false); }}
                                    className="px-4 py-3 text-left text-base-content hover:text-primary hover:bg-base-200 rounded-lg transition-colors font-medium"
                                >
                                    {item.label}
                                </button>
                            ))}

                            <div className="pt-4 border-t border-base-300 mt-2">
                                <button
                                    onClick={() => { navigate('/login'); setIsMenuOpen(false); }}
                                    className="w-full px-4 py-3 bg-primary text-primary-content rounded-xl font-semibold hover:bg-primary-focus transition-all duration-300"
                                >
                                    Iniciar Sesión
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* CSS for animation */}
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
