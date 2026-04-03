import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import RatingSystem from './ValorationsAndComments';

function Product() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation(['market', 'formulario']);

    const token = localStorage.getItem("token");
    const location = useLocation();

    // Estados de datos
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados de notificación
    const [notificacion, setNotificacion] = useState({ mostrar: false, mensaje: "", tipo: "success" });

    useEffect(() => {
        setLoading(true);
        fetch(`https://yeray.informaticamajada.es/api/products/${id}`, {
            headers: { 'accept-language': i18n.language }
        })
            .then(response => {
                if (!response.ok) throw new Error('Producto no encontrado');
                return response.json();
            })
            .then(data => {
                setProducto(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [id, i18n.language]);

    const mostrarAlerta = (mensaje, tipo = "success") => {
        setNotificacion({ mostrar: true, mensaje, tipo });
        setTimeout(() => setNotificacion(prev => ({ ...prev, mostrar: false })), 3000);
    };

    const añadirAlCarrito = async () => {
        if (!token) {
            navigate('/Login', { state: { from: location } });
            return;
        }

        try {
            const response = await fetch("https://yeray.informaticamajada.es/api/cart/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    id_producto: parseInt(id),
                    cantidad: 1 // Por defecto añadimos 1 al carrito
                })
            });

            const json = await response.json();

            if (response.ok) {
                mostrarAlerta(t('formulario:checkout.success'), "success");
                window.dispatchEvent(new Event('cartUpdated')); // Actualiza el contador del Header
            } else {
                mostrarAlerta(json.error || "Error al añadir", "error");
            }
        } catch (err) {
            mostrarAlerta("No se pudo conectar con el servidor", "error");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-100">
                <div className="flex flex-col items-center gap-4">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="text-sm text-base-content/60">Cargando producto...</p>
                </div>
            </div>
        );
    }

    if (error || !producto) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-base-100 text-base-content">
                <p className="text-xl font-bold">{error || "Producto no encontrado"}</p>
                <button onClick={() => navigate(-1)} className="btn btn-primary shadow-lg">Volver</button>
            </div>
        );
    }

    const renderStars = (rating) => {
        const numericRating = Math.round(Number(rating));
        return (
            <>
                <span className="ml-2 text-sm font-bold opacity-60 text-base-content">{rating || 0}/5</span>
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                            key={star}
                            className={`w-4 h-5 ${star <= numericRating ? "text-warning" : "text-base-content/20"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ))}
                </div>
            </>
        );
    };

    return (
        <div className="min-h-screen bg-base-300">
            {/* Notificaciones */}
            {notificacion.mostrar && (
                <div className="toast toast-top toast-center z-50">
                    <div className={`alert ${notificacion.tipo === 'success' ? 'alert-success' : 'alert-error'} shadow-lg border-none text-white font-bold`}>
                        <span>{notificacion.mensaje}</span>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
                {/* Botón Volver */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-base-content/70 hover:text-primary transition-colors duration-200 group"
                >
                    <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    {t('formulario:back')}
                </button>

                {/* Tarjeta de Producto */}
                <section className=" bg-info rounded-2xl shadow-xl overflow-hidden">
                    <div className=" bg-info grid grid-cols-1 md:grid-cols-2 gap-0">
                        {/* Imagen */}
                        <div className="p-12 flex items-center justify-center">
                            <img
                                src={producto.image_url}
                                alt={producto.name}
                                className="relative max-h-80 w-full object-contain drop-shadow-2xl"
                            />
                        </div>

                        {/* Detalles */}
                        <div className=" p-8 md:p-12 flex flex-col justify-center space-y-6 0 text-base-content">
                            <div>
                                <h1 className="text-3xl font-bold mb-3">{producto.name}</h1>
                                <p className="text-sm text-base-content/70 leading-relaxed">
                                    {producto.description}
                                </p>
                            </div>

                            <div className="flex items-center gap-8 pt-4">
                                <div>
                                    <p className="text-xs text-base-content/60 mb-1">{t('market:price')}</p>
                                    <span className="text-3xl font-bold text-primary">{producto.price} €</span>
                                </div>
                                <div className="h-12 w-px bg-base-content/10"></div>
                                <div>{renderStars(producto.rating)}</div>
                                <div className="h-12 w-px bg-base-content/10"></div>
                                <div>
                                    <p className="text-xs text-base-content/60 mb-1">{t('market:stock')}</p>
                                    <span className={`text-sm font-semibold ${producto.stock > 0 ? 'text-success' : 'text-error'}`}>
                                        {producto.stock > 0 ? `${producto.stock} uds` : t('market:outOfStock')}
                                    </span>
                                </div>
                            </div>

                            {/* Botón de Acción Principal */}
                            <button
                                className="btn border-0 bg-primary text-primary btn-lg w-full md:w-auto"
                                onClick={añadirAlCarrito}
                                disabled={producto.stock === 0}
                            >
                                {!token ? t('formulario:noToken') : (producto.stock > 0 ? "Añadir al carrito" : t('formulario:outOfStock'))}
                            </button>
                        </div>
                    </div>
                </section>

                {/* Valoraciones */}
                <section className="bg-info text-base-content rounded-2xl shadow-xl p-8 md:p-12">
                    <RatingSystem id_producto={id} userid_producto={producto?.user_id} />
                </section>
            </div>
        </div>
    );
}

export default Product;