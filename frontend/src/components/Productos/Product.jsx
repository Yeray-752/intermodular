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
    const [cantidad, setCantidad] = useState(1);

    // Estados de notificación (Alerta arriba)
    const [notificacion, setNotificacion] = useState({ mostrar: false, mensaje: "", tipo: "success" });

    // Estados del formulario
    const [tipoEntrega, setTipoEntrega] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [ciudadValida, setCiudadValida] = useState(true);
    const [tarjeta, setTarjeta] = useState("");
    const [tarjetaValida, setTarjetaValida] = useState(true);
    const [vencimiento, setVencimiento] = useState("");
    const [vencimientoValido, setVencimientoValido] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:3000/api/products/${id}`, {
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

    // Función para mostrar la alerta arriba y que desaparezca a los 3 seg
    const mostrarAlerta = (mensaje, tipo = "success") => {
        setNotificacion({ mostrar: true, mensaje, tipo });
        setTimeout(() => setNotificacion({ ...notificacion, mostrar: false }), 3000);
    };

    const esTarjetaValida = (numero) => {
        const limpio = numero.replace(/\s+/g, "");
        if (!/^\d{13,19}$/.test(limpio)) return false;
        let suma = 0; let alternar = false;
        for (let i = limpio.length - 1; i >= 0; i--) {
            let n = parseInt(limpio[i], 10);
            if (alternar) { n *= 2; if (n > 9) n -= 9; }
            suma += n; alternar = !alternar;
        }
        return suma % 10 === 0;
    };

    const esFechaValida = (fecha) => {
        const limpio = fecha.replace(/\s+/g, "");
        if (!/^\d{2}\/\d{2}$/.test(limpio)) return false;
        const [mesStr, anioStr] = limpio.split("/");
        const mes = parseInt(mesStr, 10);
        const year = parseInt(anioStr, 10) + 2000;
        if (mes < 1 || mes > 12) return false;
        const hoy = new Date();
        const ultimaFechaMes = new Date(year, mes, 0);
        return ultimaFechaMes >= hoy;
    };

    const cerrarModal = () => {
        const modal = document.getElementById('my_modal_2');
        if (modal) modal.close();
    };

    const finalizarCompra = async (e) => {
        e.preventDefault();

        if (!tarjetaValida || !vencimientoValido || (tipoEntrega === "domicilio" && !ciudadValida)) {
            mostrarAlerta(t('formulario:checkout.errorValidation'), "error");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/cart/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    id_producto: parseInt(id),
                    cantidad: cantidad
                })
            });

            const json = await response.json();

            if (response.ok) {
                mostrarAlerta(t('formulario:checkout.success'), "success");
                window.dispatchEvent(new Event('cartUpdated')); // Actualiza el Header
                cerrarModal();
            } else {
                mostrarAlerta(json.error || "Error al añadir", "error");
            }
        } catch (err) {
            mostrarAlerta("No se pudo conectar con el servidor", "error");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="text-sm text-base-content/60">Cargando producto...</p>
                </div>
            </div>
        );
    }

    if (error || !producto) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-xl font-bold">{error || "Producto no encontrado"}</p>
                <button onClick={() => navigate(-1)} className="btn btn-primary shadow-lg">Volver</button>
            </div>
        );
    }

    const ciudades = ["Puerto del Rosario", "El Cotillo", "Corralejo", "Betancuria", "La Oliva", "Morro Jable"];
    const subtotal = parseFloat(producto.price) * cantidad;
    const precioFinal = tipoEntrega === "domicilio" ? (subtotal * 1.05).toFixed(2) : subtotal.toFixed(2);

    const renderStars = (rating) => {
        // Convertimos a número por seguridad y redondeamos
        const numericRating = Math.round(Number(rating));

        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        className={`w-4 h-5 ${star <= numericRating ? "text-amber-400" : "text-gray-300"
                            }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
           
            </div>
        );
    };

    return (
        <div className="min-h-screen">

            {/* --- ALERTA EN LA PARTE SUPERIOR --- */}
            {notificacion.mostrar && (
                <div className="toast toast-top toast-center z-100 animate-bounce">
                    <div className={`alert ${notificacion.tipo === 'success' ? 'alert-success' : 'alert-error'} shadow-lg border-none text-white font-bold`}>
                        <span>{notificacion.mensaje}</span>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
                {/* VOLVER */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-base-content/70 hover:text-primary transition-colors duration-200 group"
                >
                    <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    {t('formulario:back')}
                </button>

                {/* PRODUCTO */}
                <section className="bg-base-100 rounded-2xl shadow-xl overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

                        {/* Imagen */}
                        <div className="bg-linear-to-br from-base-200 to-base-300 p-12 flex items-center justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl"></div>
                                <img
                                    src={producto.image_url}
                                    alt={producto.name}
                                    className="relative max-h-80 w-full object-contain drop-shadow-2xl"
                                />
                            </div>
                        </div>

                        {/* Info */}
                        <div className="p-8 md:p-12 flex flex-col justify-center space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold text-base-content mb-3">
                                    {producto.name}
                                </h1>
                            </div>

                            <p className="text-sm text-base-content/70 leading-relaxed">
                                {producto.description}
                            </p>

                            <div className="flex items-center gap-8 pt-4">
                                <div>
                                    <p className="text-xs text-base-content/60 mb-1">{t('market:price')}</p>
                                    <span className="text-3xl font-bold text-primary">
                                        {producto.price} €
                                    </span>
                                </div>
                                <div className="h-12 w-px bg-base-content/10"></div>
                                <div>
                                    <p>{renderStars(producto.rating)}</p>
                                </div>
                                <div className="h-12 w-px bg-base-content/10"></div>
                                <div>
                                    
                                    <p className="text-xs text-base-content/60 mb-1">{t('market:stock')}</p>
                                    <span className={`text-sm font-semibold ${producto.stock > 0 ? 'text-success' : 'text-error'}`}>
                                        {producto.stock > 0 ? `${producto.stock} uds` : t('market:outOfStock')}
                                    </span>


                                </div>
                            </div>

                            <button
                                className="btn btn-primary btn-lg w-full md:w-auto shadow-lg hover:shadow-xl transition-all duration-200"
                                onClick={() => token ? document.getElementById('my_modal_2').showModal() : navigate('/Login', { state: { from: location } })}
                                disabled={producto.stock === 0}
                            >
                                {token ? (producto.stock > 0 ? t('formulario:productButton') : t('formulario:outOfStock')) : t('formulario:noToken')}
                            </button>
                        </div>
                    </div>
                </section>

                {/* OPINIONES */}
                <section className="bg-base-100 rounded-2xl shadow-xl p-8 md:p-12">
                    <div className="flex items-center gap-3 mb-8">
                        <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <h2 className="text-2xl font-bold text-base-content">
                            Opiniones de usuarios
                        </h2>
                    </div>
                    <RatingSystem id_producto={id} userid_producto={producto?.user_id} />
                </section>
            </div>

            {/* Modal de Pago */}
            <dialog id="my_modal_2" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box max-w-2xl bg-base-100 rounded-2xl shadow-2xl">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>

                    <form onSubmit={finalizarCompra} className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold">{producto.name}</h3>
                        </div>

                        <section>
                            <label className="label">
                                <span className="label-text font-semibold">{t('formulario:checkout.deliveryType')}</span>
                            </label>
                            <select
                                className="select select-bordered w-full focus:select-primary transition-all duration-200"
                                value={tipoEntrega}
                                onChange={(e) => setTipoEntrega(e.target.value)}
                                required
                            >
                                <option value="" disabled>{t('formulario:checkout.deliverySelect')}</option>
                                <option value="recogida">{t('formulario:checkout.pickup')}</option>
                                <option value="domicilio">{t('formulario:checkout.homeDelivery')}</option>
                            </select>
                        </section>

                        {tipoEntrega && (
                            <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-6">
                                <div className="bg-base-200 rounded-xl p-6">
                                    <p className="font-semibold text-sm text-base-content/70 mb-4">{t('market:quantity')}:</p>
                                    <div className="flex items-center gap-4">
                                        <button
                                            type="button"
                                            className="btn btn-circle btn-sm btn-primary"
                                            onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            className="input input-bordered w-20 text-center font-bold"
                                            value={cantidad}
                                            readOnly
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-circle btn-sm btn-primary"
                                            onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="text-primary-content p-6 rounded-xl shadow-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-lg">Total:</span>
                                        <span className="text-3xl font-black">{precioFinal}€</span>
                                    </div>
                                </div>

                                {/* Formulario Tarjeta */}
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-base-content/80 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                        {t('formulario:checkout.cardHolder')}
                                    </h4>
                                    <input
                                        required
                                        type="text"
                                        placeholder={t('formulario:checkout.cardHolder')}
                                        className="input input-bordered w-full focus:input-primary transition-all duration-200"
                                    />
                                    <input
                                        type="text"
                                        required
                                        placeholder="Nº Tarjeta"
                                        className={`input input-bordered w-full focus:input-primary transition-all duration-200 ${!tarjetaValida && "input-error"}`}
                                        value={tarjeta}
                                        onChange={(e) => {
                                            const v = e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
                                            setTarjeta(v);
                                            setTarjetaValida(esTarjetaValida(v));
                                        }}
                                        maxLength={19}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="MM/AA"
                                            required
                                            className={`input input-bordered w-full focus:input-primary transition-all duration-200 ${!vencimientoValido && "input-error"}`}
                                            value={vencimiento}
                                            onChange={(e) => {
                                                let v = e.target.value.replace(/\D/g, "");
                                                if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2, 4);
                                                setVencimiento(v);
                                                setVencimientoValido(v.length === 5 ? esFechaValida(v) : true);
                                            }}
                                        />
                                        <input
                                            required
                                            type="password"
                                            placeholder="CVV"
                                            className="input input-bordered w-full focus:input-primary transition-all duration-200"
                                            maxLength={4}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-block btn-lg shadow-lg hover:shadow-xl transition-all duration-200 mt-6"
                                    >
                                        Confirmar y Añadir
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
}

export default Product;