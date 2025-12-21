import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function Product() {
    const { id } = useParams();
    const { t } = useTranslation(['market', 'formulario']);
    const navigate = useNavigate();

    const listaProductos = t("products", { ns: 'market', returnObjects: true }) || [];
    const producto = listaProductos.find(p => p.id === parseInt(id));

    const [tipoEntrega, setTipoEntrega] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [ciudadValida, setCiudadValida] = useState(true);
    const [tarjeta, setTarjeta] = useState("");
    const [tarjetaValida, setTarjetaValida] = useState(true);
    const [vencimiento, setVencimiento] = useState("");
    const [vencimientoValido, setVencimientoValido] = useState(true);

    if (!producto) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl font-bold">Producto no encontrado</p>
                <button onClick={() => navigate(-1)} className="btn btn-ghost">Volver</button>
            </div>
        );
    }

    const ciudades = ["Puerto del Rosario", "El Cotillo", "Corralejo", "Betancuria", "La Oliva", "Morro Jable"];

    const cerrarModal = () => {
        const modal = document.getElementById('my_modal_2');
        if (modal) modal.close();
    };

    const precioOriginal = producto.precio;
    const precioFinal = tipoEntrega === "domicilio"
        ? (precioOriginal * 1.05).toFixed(2)
        : precioOriginal.toFixed(2);

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

    return (
        <div className="min-h-screen bg-base-200">
            <div className="max-w-6xl mx-auto pt-6 px-4">
                <button onClick={() => navigate(-1)} className="btn btn-sm btn-ghost gap-2">
                    ← {t('home:back', { defaultValue: 'Volver' })}
                </button>
            </div>

            <section className="pt-10 pb-24 flex justify-center px-4">
                <div className="card lg:card-side bg-base-100 shadow-2xl max-w-6xl w-full">
                    <figure className="p-6 bg-neutral-100 lg:w-1/2">
                        <img src={producto.imagen} alt={producto.nombre} className="rounded-xl w-full h-80 object-contain" />
                    </figure>

                    <div className="card-body lg:w-1/2">
                        <div className="badge badge-outline mb-2">{producto.categoria}</div>
                        <h1 className="card-title text-4xl font-bold mb-4">{producto.nombre}</h1>
                        <p className="text-justify text-base-content/80 mb-6">{producto.descripcion}</p>

                        <div className="flex flex-wrap gap-16 mb-8">
                            <div>
                                <p className="text-sm opacity-60 font-bold uppercase">{t('market:price')}</p>
                                <p className="text-3xl font-black text-primary">{producto.precio}€</p>
                            </div>
                            <div>
                                <p className="text-sm opacity-60 font-bold uppercase">{t('market:stock')}</p>
                                <p className={`text-xl font-bold ${producto.stock > 0 ? 'text-success' : 'text-error'}`}>
                                    {producto.stock > 0 ? `${producto.stock} ${t('market:stock')}` : t('market:outOfStock')}
                                </p>
                            </div>
                        </div>

                        <div className="card-actions">
                            <button
                                className="btn btn-warning btn-block text-lg font-bold"
                                onClick={() => document.getElementById('my_modal_2').showModal()}
                                disabled={producto.stock === 0}
                            >
                                {/* Forzamos el namespace 'market' antes de la clave */}
                                {producto.stock > 0 ? t('formulario:productButton') : t('formulario:outOfStock')}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <dialog id="my_modal_2" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box max-w-2xl">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>

                    <form onSubmit={(e) => {
                        e.preventDefault();
                        if (!tarjetaValida || !vencimientoValido || (tipoEntrega === "domicilio" && !ciudadValida)) {
                            alert(t('formulario:checkout.errorValidation'));
                            return;
                        }
                        alert(t('formulario:checkout.success'));
                        cerrarModal();
                        navigate('/');
                    }}>
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            📦 {t('formulario:checkout.title')}: {producto.nombre}
                        </h3>

                        <div className="space-y-6">
                            <section>
                                <label className="label mb-2 font-bold">{t('formulario:checkout.deliveryType')}</label>
                                <select className="select select-bordered w-full" value={tipoEntrega} onChange={(e) => setTipoEntrega(e.target.value)} required>
                                    <option value="" disabled>{t('formulario:checkout.deliverySelect')}</option>
                                    <option value="recogida">{t('formulario:checkout.pickup')}</option>
                                    <option value="domicilio">{t('formulario:checkout.homeDelivery')}</option>
                                </select>
                            </section>

                            {tipoEntrega === "domicilio" && (
                                <div className="bg-base-200 p-4 rounded-xl space-y-4">
                                    <h4 className="font-bold text-sm uppercase opacity-60 text-primary">{t('formulario:checkout.shippingData')}</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="form-control">
                                            <span className="label-text mb-2 block">{t('formulario:checkout.address')}</span>
                                            <input required type="text" placeholder={t('formulario:checkout.addressPlaceholder')} className="input input-bordered w-full" />
                                        </div>
                                        <div className="form-control">
                                            <span className="label-text mb-2 block">{t('formulario:checkout.city')}</span>
                                            <input
                                                required
                                                list="ciudades"
                                                placeholder={t('formulario:checkout.cityPlaceholder')}
                                                className={`input input-bordered w-full ${!ciudadValida ? "input-error" : ""}`}
                                                value={ciudad}
                                                onChange={(e) => {
                                                    setCiudad(e.target.value);
                                                    setCiudadValida(ciudades.includes(e.target.value));
                                                }}
                                            />
                                            <datalist id="ciudades">
                                                {ciudades.map((c) => <option key={c} value={c} />)}
                                            </datalist>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {tipoEntrega === "recogida" && (
                                <div className="alert alert-info shadow-sm">
                                    <span>{t('formulario:checkout.pickupAlert')}</span>
                                </div>
                            )}

                            {(tipoEntrega === "recogida" || tipoEntrega === "domicilio") && (
                                <>
                                    <div className="divider text-xs opacity-50 uppercase font-bold">{t('formulario:checkout.paymentSummary')}</div>
                                    <div className="flex justify-between items-center bg-primary text-primary-content p-4 rounded-lg">
                                        <span className="font-bold">{t('formulario:checkout.total')}:</span>
                                        <span className="text-2xl font-black">{precioFinal}€</span>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="form-control">
                                            <span className="label-text mb-2 block font-medium">{t('formulario:checkout.cardHolder')}</span>
                                            <input required type="text" placeholder={t('formulario:checkout.cardHolderPlaceholder')} className="input input-bordered w-full" />
                                        </div>
                                        <div className="form-control">
                                            <span className="label-text mb-2 block font-medium">{t('formulario:checkout.cardNumber')}</span>
                                            <input
                                                type="text"
                                                required
                                                placeholder="0000 0000 0000 0000"
                                                className={`input input-bordered w-full ${!tarjetaValida ? "input-error" : ""}`}
                                                value={tarjeta}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/[^\d]/g, "").replace(/(.{4})/g, "$1 ").trim();
                                                    setTarjeta(val);
                                                    setTarjetaValida(esTarjetaValida(val));
                                                }}
                                                maxLength={19}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="form-control">
                                                <span className="label-text mb-2 block font-medium">{t('formulario:checkout.expiry')}</span>
                                                <input
                                                    type="text"
                                                    placeholder="MM/AA"
                                                    value={vencimiento}
                                                    className={`input input-bordered w-full ${!vencimientoValido ? "input-error" : ""}`}
                                                    onChange={(e) => {
                                                        let val = e.target.value.replace(/\D/g, "");
                                                        if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2, 4);
                                                        setVencimiento(val);
                                                        setVencimientoValido(val.length === 5 ? esFechaValida(val) : true);
                                                    }}
                                                    required
                                                />
                                            </div>
                                            <div className="form-control">
                                                <span className="label-text mb-2 block font-medium">{t('formulario:checkout.cvv')}</span>
                                                <input required type="password" placeholder="***" className="input input-bordered w-full" maxLength={4} />
                                            </div>
                                        </div>
                                        <button type="submit" className="btn btn-primary btn-block text-lg mt-6">
                                            {t('formulario:checkout.confirmButton')} {precioFinal}€
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
}

export default Product;