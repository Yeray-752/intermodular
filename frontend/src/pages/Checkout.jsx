import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { ShoppingBag, CreditCard, MapPin, AlertCircle, ArrowLeft, Trash2 } from 'lucide-react';

function Checkout() {
    const navigate = useNavigate();
    const { t } = useTranslation(['market', 'formulario']);
    const token = localStorage.getItem("token");

    // Estados de datos
    const [cart, setCart] = useState({ items: [], totalCarrito: "0.00" });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Estados del formulario (Basados en tu Product.jsx)
    const [tipoEntrega, setTipoEntrega] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [ciudadValida, setCiudadValida] = useState(true);
    const [tarjeta, setTarjeta] = useState("");
    const [tarjetaValida, setTarjetaValida] = useState(true);
    const [vencimiento, setVencimiento] = useState("");
    const [vencimientoValido, setVencimientoValido] = useState(true);
    const [nombreTarjeta, setNombreTarjeta] = useState("");

    const ciudades = ["Puerto del Rosario", "El Cotillo", "Corralejo", "Betancuria", "La Oliva", "Morro Jable"];

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setCart(data);
            }
        } catch (error) {
            console.error("Error al cargar el carrito:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- LÓGICA DE VALIDACIÓN (REPLICADA DE TU ARCHIVO) ---
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

    const handleFinalizarCompra = async (e) => {
        e.preventDefault();

        if (!tarjetaValida || !vencimientoValido || (tipoEntrega === "domicilio" && !ciudadValida)) {
            alert(t('formulario:checkout.errorValidation'));
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/checkout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    tipoEntrega,
                    ciudad: tipoEntrega === "domicilio" ? ciudad : "Tienda",
                    nombreTarjeta
                })
            });

            if (response.ok) {
                // 1. Avisamos al Header que el carrito se vació
                window.dispatchEvent(new Event('cartUpdated'));

                // 2. ¡NUEVO! Avisamos al Header que hay una nueva notificación
                // Esto hará que el Header llame a /unread-count y pinte el círculo rojo
                window.dispatchEvent(new Event('notificationsUpdated'));

                navigate('/perfil');
            } else {
                const err = await response.json();
                alert(err.error);
            }
        } catch (error) {
            alert("Error en el servidor");
        }
    };

    if (loading) return <div className="min-h-screen flex justify-center items-center"><span className="loading loading-dots loading-lg"></span></div>;

    const hayErroresStock = cart.items?.some(item => item.cantidad > item.stock);

    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <button onClick={() => navigate(-1)} className="btn btn-ghost gap-2 mb-6">
                    <ArrowLeft size={20} /> {t('formulario:back')}
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* CARRITO GIGANTE */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-4xl font-black flex items-center gap-4 mb-8">
                            <ShoppingBag className="text-primary" size={40} /> {t('market:cartTitle') || 'Tu Carrito'}
                        </h2>

                        {cart.items.length === 0 ? (
                            <div className="text-center py-20 bg-base-100 rounded-2xl shadow">
                                <p className="text-xl opacity-50">El carrito está vacío</p>
                            </div>
                        ) : (
                            cart.items.map((item) => (
                                <div key={item.id_producto} className={`card card-side bg-base-100 shadow-xl border-2 ${item.cantidad > item.stock ? 'border-error' : 'border-transparent'}`}>
                                    <figure className="w-40 md:w-56">
                                        <img src={`${import.meta.env.VITE_API_URL}${item.image_url}`} alt={item.name} className="h-full object-cover" />
                                    </figure>
                                    <div className="card-body">
                                        <div className="flex justify-between items-start">
                                            <h3 className="card-title text-2xl">{item.name}</h3>
                                            <p className="text-right font-bold text-2xl text-primary">${item.subtotal}</p>
                                        </div>
                                        <p className="text-base-content/60">{item.precio_unitario} € / ud</p>

                                        <div className="card-actions justify-between items-center mt-4">
                                            <div className="badge badge-ghost badge-lg gap-2">
                                                Cantidad: <span className="font-bold">{item.cantidad}</span>
                                            </div>
                                            {item.cantidad > item.stock && (
                                                <div className="text-error flex items-center gap-1 font-bold animate-pulse">
                                                    <AlertCircle size={18} /> Solo {item.stock} en stock
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* RESUMEN sticky */}
                    <div className="lg:col-span-1">
                        <div className="card bg-base-100 shadow-2xl sticky top-24">
                            <div className="card-body">
                                <h3 className="font-bold text-xl border-b pb-2">Resumen</h3>
                                <div className="flex justify-between py-6 text-3xl font-black">
                                    <span>Total</span>
                                    <span className="text-primary">{cart.totalCarrito}€</span>
                                </div>

                                <button
                                    disabled={hayErroresStock || cart.items.length === 0}
                                    onClick={() => setShowModal(true)}
                                    className="btn btn-primary btn-block btn-lg shadow-lg text-white"
                                >
                                    {hayErroresStock ? 'Ajustar Stock' : 'Confirmar Pedido'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL DE PAGO (Replica la estética de tu Product.jsx) */}
            {showModal && (
                <div className="modal modal-open modal-bottom sm:modal-middle">
                    <div className="modal-box max-w-2xl bg-base-100 rounded-2xl border border-base-300">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => setShowModal(false)}>✕</button>

                        <form onSubmit={handleFinalizarCompra} className="space-y-6">
                            <div className="flex items-center gap-3 mb-6 border-b pb-4">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <CreditCard className="text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold">Finalizar Pedido</h3>
                            </div>

                            {/* TIPO DE ENTREGA */}
                            <section>
                                <label className="label font-semibold">{t('formulario:checkout.deliveryType')}</label>
                                <select
                                    className="select select-bordered w-full"
                                    value={tipoEntrega}
                                    onChange={(e) => setTipoEntrega(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>{t('formulario:checkout.deliverySelect')}</option>
                                    <option value="recogida">{t('formulario:checkout.pickup')}</option>
                                    <option value="domicilio">{t('formulario:checkout.homeDelivery')}</option>
                                </select>
                            </section>

                            {/* CIUDAD (Solo si es domicilio) */}
                            {tipoEntrega === "domicilio" && (
                                <section className="animate-in fade-in slide-in-from-top-4 duration-300">
                                    <label className="label font-semibold">Ciudad de entrega</label>
                                    <select
                                        className={`select select-bordered w-full ${!ciudadValida ? 'select-error' : ''}`}
                                        value={ciudad}
                                        onChange={(e) => {
                                            setCiudad(e.target.value);
                                            setCiudadValida(ciudades.includes(e.target.value));
                                        }}
                                        required
                                    >
                                        <option value="" disabled>Selecciona tu ciudad</option>
                                        {ciudades.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </section>
                            )}

                            {/* DATOS DE TARJETA (Solo si eligió entrega) */}
                            {tipoEntrega && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                                    <div className="divider text-xs opacity-50 uppercase">Información de Pago</div>

                                    <input
                                        required
                                        type="text"
                                        placeholder={t('formulario:checkout.cardHolder')}
                                        className="input input-bordered w-full"
                                        value={nombreTarjeta}
                                        onChange={(e) => setNombreTarjeta(e.target.value)}
                                    />

                                    <input
                                        type="text"
                                        required
                                        placeholder="Nº Tarjeta (Luhn check)"
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
                                            type="text"
                                            placeholder="MM/AA"
                                            required
                                            className={`input input-bordered w-full ${!vencimientoValido && "input-error"}`}
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
                                            className="input input-bordered w-full"
                                            maxLength={4}
                                        />
                                    </div>

                                    <button type="submit" className="btn btn-primary btn-block btn-lg mt-6 shadow-xl text-white">
                                        Pagar {cart.totalCarrito}€
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Checkout;