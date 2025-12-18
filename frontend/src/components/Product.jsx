import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

function Product() {
    const navigate = useNavigate();
    const [tipoEntrega, setTipoEntrega] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [ciudadValida, setCiudadValida] = useState(true);

    const ciudades = [
        "Puerto del Rosario",
        "El Cotillo",
        "Corralejo",
        "Betancuria",
        "La Oliva",
        "Morro Jable",
    ];

    const cerrarModal = () => {
        const modal = document.getElementById('my_modal_2');
        if (modal) modal.close();
    };


    return (
        <div>
            <section className="pt-24 pb-24 flex justify-center">
                <div className="card lg:card-side bg-base-100 shadow-2xl max-w-5xl w-full">

                    <figure className="p-6">
                        <img
                            src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
                            alt="producto"
                            className="rounded-xl max-w-sm"
                        />
                    </figure>

                    <div className="card-body">
                        <h1 className="card-title text-4xl lg:text-5xl">
                            Nombre de producto
                        </h1>

                        <p className="text-justify">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...
                        </p>

                        <div className="grid grid-cols-3 items-center gap-4 mt-4">
                            <p className="font-semibold">Precio</p>

                            <div>
                                <p className="text-sm opacity-70">Valoración global</p>
                                <div className="rating rating-md rating-half pointer-events-none">
                                    <input type="radio" className="rating-hidden" />
                                    <input type="radio" className="mask mask-star-2 mask-half-1 bg-amber-400" checked disabled />
                                    <input type="radio" className="mask mask-star-2 mask-half-2 bg-amber-400" checked disabled />
                                    <input type="radio" className="mask mask-star-2 mask-half-1 bg-amber-400" checked disabled />
                                    <input type="radio" className="mask mask-star-2 mask-half-2 bg-amber-400" checked disabled />
                                    <input type="radio" className="mask mask-star-2 mask-half-1 bg-amber-400" checked disabled />
                                    <input type="radio" className="mask mask-star-2 mask-half-2 bg-amber-400" checked disabled />
                                    <input type="radio" className="mask mask-star-2 mask-half-1 bg-amber-400" checked disabled />
                                    <input type="radio" className="mask mask-star-2 mask-half-2 bg-amber-400" checked disabled />
                                    <input type="radio" className="mask mask-star-2 mask-half-1 bg-amber-400" checked disabled />
                                    <input type="radio" className="mask mask-star-2 mask-half-2 bg-amber-400" disabled />
                                </div>
                            </div>
                            <button className="btn btn-warning w-full" onClick={() => document.getElementById('my_modal_2').showModal()}>Comprar</button>
                            <dialog
                                id="my_modal_2"
                                className="modal modal-bottom sm:modal-middle"
                                onClick={(e) => e.target.id === "my_modal_2" && cerrarModal()}
                            >
                                <div className="modal-box max-w-2xl border border-base-300 shadow-2xl">
                                    <form method="dialog">
                                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                    </form>

                                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                        📦 Configuración de Pedido
                                    </h3>

                                    <div className="space-y-6">
                                        <section>
                                            <label className="label mb-7 font-bold">Tipo de entrega</label>
                                            <select
                                                className="select select-bordered w-full"
                                                value={tipoEntrega}
                                                onChange={(e) => setTipoEntrega(e.target.value)}
                                            >
                                                <option value="" disabled>Selecciona cómo recibirás tu producto</option>
                                                <option value="recogida">🏪 Recogida en tienda (Gratis)</option>
                                                <option value="domicilio">🚚 Envío a domicilio (+ 5% del precio original)</option>
                                            </select>
                                        </section>

                                        {tipoEntrega === "domicilio" && (
                                            <div className="bg-base-200 p-4 rounded-xl space-y-4 animate-fadeIn">
                                                <h4 className="font-bold text-sm uppercase opacity-60">Datos de Envío</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="form-control">
                                                        <span className="label-text mb-2 block">Dirección completa</span>
                                                        <input type="text" placeholder="Calle, número, piso..." className="input input-bordered w-full" />
                                                    </div>
                                                    <div className="form-control">
                                                        <span className="label-text mb-2 block">Ciudad</span>
                                                        <input
                                                            list="ciudades"
                                                            className={`input input-bordered w-full ${!ciudadValida ? "input-error" : ""}`}
                                                            placeholder="Ej: Madrid"
                                                            value={ciudad}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                setCiudad(value);
                                                                setCiudadValida(ciudades.includes(value));
                                                            }}
                                                        />
                                                        <datalist id="ciudades">
                                                            {ciudades.map((c) => <option key={c} value={c} />)}
                                                        </datalist>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* MENSAJE DE RECOGIDA */}
                                        {tipoEntrega === "recogida" && (
                                            <div className="alert alert-info shadow-sm bg-blue-50 border-blue-200 text-blue-800">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                <span>Podrás recoger tu pedido en 24h en nuestra tienda principal.</span>
                                            </div>
                                        )}

                                        {/* SECCIÓN 3: PAGO (Solo si se eligió una opción) */}
                                        {(tipoEntrega === "recogida" || tipoEntrega === "domicilio") && (
                                            <div className="divider text-xs opacity-50 uppercase">Información de Pago</div>
                                        )}

                                        {(tipoEntrega === "recogida" || tipoEntrega === "domicilio") && (
                                            <div className="space-y-4">
                                                <div className="form-control">
                                                    <span className="label-text font-medium mb-2 block">Titular de la tarjeta</span>
                                                    <input type="text" placeholder="Nombre como aparece en la tarjeta" className="input input-bordered w-full" autoComplete="cc-name" />
                                                </div>

                                                <div className="form-control">
                                                    <span className="label-text font-medium mb-2 block">Número de tarjeta</span>
                                                    <input
                                                        type="text"
                                                        placeholder="0000 0000 0000 0000"
                                                        className="input input-bordered w-full tracking-widest"
                                                        maxLength={19}
                                                        inputMode="numeric"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="form-control">
                                                        <span className="label-text mb-2 block font-medium">Vencimiento</span>
                                                        <input type="text" placeholder="MM/AA" className="input input-bordered w-full" maxLength={5} />
                                                    </div>
                                                    <div className="form-control">
                                                        <span className="label-text mb-2 block font-medium">CVV</span>
                                                        <input type="password" placeholder="***" className="input input-bordered w-full" maxLength={4} />
                                                    </div>
                                                </div>

                                                <div className="modal-action mt-8">
                                                    <button className="btn btn-primary btn-block text-lg">
                                                        Confirmar y Pagar
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Este form con backdrop es lo que permite el cierre al hacer click fuera en versiones nativas */}
                                <form method="dialog" className="modal-backdrop">
                                    <button>close</button>
                                </form>
                            </dialog>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Product;