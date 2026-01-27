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

    if (loading) return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg"></span></div>;
    
    if (error || !producto) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-xl font-bold">{error || "Producto no encontrado"}</p>
                <button onClick={() => navigate(-1)} className="btn btn-primary">Volver</button>
            </div>
        );
    }

    const ciudades = ["Puerto del Rosario", "El Cotillo", "Corralejo", "Betancuria", "La Oliva", "Morro Jable"];
    const subtotal = parseFloat(producto.price) * cantidad;
    const precioFinal = tipoEntrega === "domicilio" ? (subtotal * 1.05).toFixed(2) : subtotal.toFixed(2);

    return (
        <div className="min-h-screen bg-base-200 relative">
            
            {/* --- ALERTA EN LA PARTE SUPERIOR --- */}
            {notificacion.mostrar && (
                <div className="toast toast-top toast-center z-[100] animate-bounce">
                    <div className={`alert ${notificacion.tipo === 'success' ? 'alert-success' : 'alert-error'} shadow-lg border-none text-white font-bold`}>
                        <span>{notificacion.mensaje}</span>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto pt-6 px-4">
                <button onClick={() => navigate(-1)} className="btn btn-sm btn-ghost gap-2">
                    ← {t('formulario:back')}
                </button>
            </div>

            <section className="pt-10 pb-24 flex justify-center px-4">
                <div className="card lg:card-side bg-base-100 shadow-2xl max-w-6xl w-full">
                    <figure className="p-6 bg-neutral-100 lg:w-1/2">
                        <img src={producto.image_url} alt={producto.name} className="rounded-xl w-full h-80 object-contain" />
                    </figure>

                    <div className="card-body lg:w-1/2">
                        <div className="badge badge-outline mb-2">{producto.category_id}</div>
                        <h1 className="card-title text-4xl font-bold mb-4">{producto.name}</h1>
                        <p className="text-justify text-base-content/80 mb-6">{producto.description}</p>

                        <div className="flex flex-wrap gap-16 mb-8">
                            <div>
                                <p className="text-sm opacity-60 font-bold uppercase">{t('market:price')}</p>
                                <p className="text-3xl font-black text-primary">{producto.price}€</p>
                            </div>
                            <div>
                                <p className="text-sm opacity-60 font-bold uppercase">{t('market:stock')}</p>
                                <p className={`text-xl font-bold ${producto.stock > 0 ? 'text-success' : 'text-error'}`}>
                                    {producto.stock > 0 ? `${producto.stock} uds` : t('market:outOfStock')}
                                </p>
                            </div>
                        </div>

                        <div className="card-actions">
                            <button
                                className="btn btn-warning btn-block text-lg font-bold shadow-lg"
                                onClick={() => token ? document.getElementById('my_modal_2').showModal() : navigate('/Login', { state: { from: location } })}
                                disabled={producto.stock === 0}
                            >
                                {token ? (producto.stock > 0 ? t('formulario:productButton') : t('formulario:outOfStock')) : t('formulario:noToken')}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modal de Pago */}
            <dialog id="my_modal_2" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box max-w-2xl bg-base-100">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>

                    <form onSubmit={finalizarCompra} className="space-y-6">
                        <h3 className="text-2xl font-bold mb-6">📦 {producto.name}</h3>

                        <section>
                            <label className="label font-bold">{t('formulario:checkout.deliveryType')}</label>
                            <select className="select select-bordered w-full" value={tipoEntrega} onChange={(e) => setTipoEntrega(e.target.value)} required>
                                <option value="" disabled>{t('formulario:checkout.deliverySelect')}</option>
                                <option value="recogida">{t('formulario:checkout.pickup')}</option>
                                <option value="domicilio">{t('formulario:checkout.homeDelivery')}</option>
                            </select>
                        </section>

                        {tipoEntrega && (
                            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="flex items-center gap-4 mb-6 bg-base-200 p-4 rounded-lg">
                                    <p className="font-bold opacity-60 uppercase text-sm">{t('market:quantity')}:</p>
                                    <div className="join border border-base-300">
                                        <button type="button" className="btn join-item btn-sm" onClick={() => setCantidad(Math.max(1, cantidad - 1))}>-</button>
                                        <input type="number" className="input input-sm join-item w-16 text-center font-bold" value={cantidad} readOnly />
                                        <button type="button" className="btn join-item btn-sm" onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}>+</button>
                                    </div>
                                </div>

                                <div className="bg-primary text-primary-content p-4 rounded-lg flex justify-between items-center mb-6">
                                    <span className="font-bold uppercase">Total:</span>
                                    <span className="text-2xl font-black">{precioFinal}€</span>
                                </div>

                                {/* Formulario Tarjeta */}
                                <div className="grid grid-cols-1 gap-4">
                                    <input required type="text" placeholder={t('formulario:checkout.cardHolder')} className="input input-bordered w-full" />
                                    <input
                                        type="text" required placeholder="Nº Tarjeta"
                                        className={`input input-bordered w-full ${!tarjetaValida && "input-error"}`}
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
                                            type="text" placeholder="MM/AA" required
                                            className={`input input-bordered w-full ${!vencimientoValido && "input-error"}`}
                                            value={vencimiento}
                                            onChange={(e) => {
                                                let v = e.target.value.replace(/\D/g, "");
                                                if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2, 4);
                                                setVencimiento(v);
                                                setVencimientoValido(v.length === 5 ? esFechaValida(v) : true);
                                            }}
                                        />
                                        <input required type="password" placeholder="CVV" className="input input-bordered w-full" maxLength={4} />
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-block text-lg mt-4">
                                        Confirmar y Añadir
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </dialog>

            <div className="max-w-6xl mx-auto pb-20">
                <RatingSystem id_producto={id} userId={producto?.user_id} />
            </div>
        </div>
    );
}

export default Product;