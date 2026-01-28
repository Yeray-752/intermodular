import { useNavigate } from "react-router";
import logo from '/img/web/logo_no_background.webp';
import { Menu, X, User, ShoppingCart, Trash2 } from 'lucide-react';
import { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from "../../context/ThemeContext";
import { AuthContext } from "../../context/AuthContext";

function Header() {
    const { t, i18n } = useTranslation(['header']);
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const { user } = useContext(AuthContext);
    
    const [datosCarrito, setdatosCarrito] = useState({ items: [], totalCarrito: "0.00" });
    const [notificacion, setNotificacion] = useState({ mostrar: false, mensaje: "", tipo: "success" });

    // Cambiado: text-base-content asegura que el texto cambie según el tema
    const hoverLink = 'text-base-content hover:text-primary transition-colors duration-300 font-medium';

    const navItems = [
        { label: t('nav.bookings'), path: '/reservas' },
        { label: t('nav.products'), path: '/productos' },
        { label: t('nav.about'), path: '/sobre-nosotros' },
    ];

    const mostrarAlerta = (mensaje, tipo = "success") => {
        setNotificacion({ mostrar: true, mensaje, tipo });
        setTimeout(() => setNotificacion({ ...notificacion, mostrar: false }), 3000);
    };

    const fetchCarrito = async () => {
        const token = localStorage.getItem('token'); 
        if (!user || !token) return;

        try {
            const lang = i18n.language || 'es';
            const response = await fetch(`http://localhost:3000/api/cart?lang=${lang}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setdatosCarrito(data);
            }
        } catch (error) {
            console.error("Error cargando el carrito:", error);
        }
    };

    const handleRemoveItem = async (idProducto) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(`http://localhost:3000/api/cart/item/${idProducto}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                mostrarAlerta("Producto eliminado correctamente", "info");
                fetchCarrito();
            } else {
                mostrarAlerta("No se pudo eliminar el producto", "error");
            }
        } catch (error) {
            console.error("Error al borrar:", error);
            mostrarAlerta("Error de conexión", "error");
        }
    };

    useEffect(() => {
        fetchCarrito();
        window.addEventListener('cartUpdated', fetchCarrito);
        return () => window.removeEventListener('cartUpdated', fetchCarrito);
    }, [user, i18n.language]);

    return (
        <div className="drawer drawer-end sticky top-0 z-[60]">
            <input id="my-drawer-5" type="checkbox" className="drawer-toggle" />
            
            {notificacion.mostrar && (
                <div className="toast toast-top toast-center z-[100]">
                    {/* Cambiado: text-success-content o similares para que el texto sea legible en el tema oscuro */}
                    <div className={`alert ${notificacion.tipo === 'success' ? 'alert-success' : notificacion.tipo === 'error' ? 'alert-error' : 'alert-info'} shadow-lg font-bold`}>
                        <span>{notificacion.mensaje}</span>
                    </div>
                </div>
            )}

            <div className="drawer-content flex flex-col">
                {/* Cambiado: Eliminado dark:bg-base-200 para dejar que DaisyUI lo gestione con bg-base-100 */}
                <header className="bg-base-100 text-base-content shadow-md border-b border-base-300 w-full">
                    <div className="mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-20">
                            <div onClick={() => navigate('/')} className="flex items-center space-x-4 cursor-pointer group">
                                <img src={logo} className="w-16 h-16 object-contain group-hover:scale-105 transition-transform" alt="Logo" />
                                <div className="hidden sm:block">
                                    <h1 className="text-xl font-bold">AKOTAN</h1>
                                    <p className="text-xs opacity-70">{t('subtitle')}</p>
                                </div>
                            </div>

                            <nav className="hidden md:flex items-center space-x-4">
                                {navItems.map((item, index) => (
                                    <button key={index} onClick={() => navigate(item.path)} className={hoverLink}>
                                        {item.label}
                                    </button>
                                ))}
                                
                                <label className="swap swap-rotate mx-2">
                                    <input type="checkbox" checked={theme === "sunset"} onChange={(e) => setTheme(e.target.checked ? "sunset" : "light")} />
                                    <svg className="swap-off h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,1.41-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" /></svg>
                                    <svg className="swap-on h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" /></svg>
                                </label>

                                <div className="h-8 w-px bg-base-300 mx-2"></div>

                                {user ? (
                                    <div className="flex items-center space-x-4">
                                        <label htmlFor="my-drawer-5" className="btn btn-ghost btn-circle drawer-button indicator">
                                            <ShoppingCart size={24} />
                                            {datosCarrito.items?.length > 0 && (
                                                <span className="badge badge-sm badge-primary indicator-item">
                                                    {datosCarrito.items.length}
                                                </span>
                                            )}
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

                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden btn btn-ghost btn-circle">
                                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                            </button>
                        </div>
                    </div>
                </header>
            </div>

            <div className="drawer-side z-80">
                <label htmlFor="my-drawer-5" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="menu p-4 w-80 sm:w-96 min-h-full bg-base-100 text-base-content shadow-2xl flex flex-col">
                    <div className="flex items-center justify-between mb-6 border-b pb-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <ShoppingCart className="text-primary" /> {t('cart.title')}
                        </h2>
                        <label htmlFor="my-drawer-5" className="btn btn-sm btn-circle btn-ghost">✕</label>
                    </div>
                    
                    <div className="grow overflow-y-auto space-y-4">
                        {datosCarrito.items && datosCarrito.items.length > 0 ? (
                            datosCarrito.items.map((item) => (
                                <div key={item.id_producto} className="flex gap-4 bg-base-200 p-3 rounded-xl items-center group">
                                    <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                                    <div className="flex-1">
                                        <p className="font-bold text-sm leading-tight">{item.name}</p>
                                        <p className="text-xs opacity-70 mt-1">
                                            {item.cantidad} x ${item.precio_unitario}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-primary">${item.subtotal}</p>
                                        <button 
                                            onClick={() => handleRemoveItem(item.id_producto)}
                                            className="btn btn-ghost btn-xs btn-circle text-error hover:bg-error/20"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20">
                                {/* Cambiado: text-base-content con opacidad para que se vea en cualquier tema */}
                                <ShoppingCart size={48} className="mx-auto text-base-content opacity-20 mb-4" />
                                <p className="text-base-content opacity-50 italic">{t('cart.vacio')}</p>
                            </div>
                        )}
                    </div>

                    {datosCarrito.items?.length > 0 && (
                        <div className="border-t border-base-300 pt-4 mt-4 space-y-4">
                            <div className="flex justify-between items-center font-bold text-lg px-2">
                                <span>{t('cart.total')}</span>
                                <span className="text-2xl text-primary">${datosCarrito.totalCarrito}</span>
                            </div>
                            <button 
                                onClick={() => { navigate('/checkout'); document.getElementById('my-drawer-5').checked = false; }} 
                                className="btn btn-primary w-full text-lg shadow-lg"
                            >
                                {t('cart.finalizarCompra')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Header;