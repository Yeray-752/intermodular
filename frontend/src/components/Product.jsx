import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

function Product() {

    const [serviciosTaller, setServiciosTaller] = useState('')

    useEffect(() => {
    // Reemplaza esta URL por la de tu API real
    fetch('http://localhost:3000/api/productos')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al conectar con la API');
        }
        return response.json();
      })
      .then(data => {
        setServiciosTaller(data); // Aquí guardas el JSON que insertamos en MariaDB
      })
      .catch(err => {
        setError(err.message);
      });
  }, []);

    const { id } = useParams();

    const producto = serviciosTaller.find(p => p.id === parseInt(id));

    const [tipoEntrega, setTipoEntrega] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [ciudadValida, setCiudadValida] = useState(true);

    const [tarjeta, setTarjeta] = useState("");
    const [tarjetaValida, setTarjetaValida] = useState(true);

    const [vencimiento, setVencimiento] = useState("");
    const [vencimientoValido, setVencimientoValido] = useState(true);

    const ciudades = [
        "Puerto del Rosario", "El Cotillo", "Corralejo",
        "Betancuria", "La Oliva", "Morro Jable",
    ];

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

        let suma = 0;
        let alternar = false;

        for (let i = limpio.length - 1; i >= 0; i--) {
            let n = parseInt(limpio[i], 10);

            if (alternar) {
                n *= 2;
                if (n > 9) n -= 9;
            }

            suma += n;
            alternar = !alternar;
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
            <section className="pt-24 pb-24 flex justify-center px-4">
                <div className="card lg:card-side bg-base-100 shadow-2xl max-w-6xl w-full">

                    <figure className="p-6 bg-neutral-100 lg:w-1/2">
                        <img
                            src={producto.imagen}
                            alt={producto.nombre}
                            className="rounded-xl w-full h-80 object-contain"
                        />
                    </figure>

                    <div className="card-body lg:w-1/2">
                        <div className="badge badge-outline mb-2">{producto.categoria}</div>
                        <h1 className="card-title text-4xl font-bold mb-4">
                            {producto.nombre}
                        </h1>

                        <p className="text-justify text-base-content/80 mb-6">
                            {producto.descripcion}
                        </p>

                        <div className="flex flex-wrap gap-16 mb-8">
                            <div>
                                <p className="text-sm opacity-60 font-bold uppercase">Precio Unitario</p>
                                <p className="text-3xl font-black text-primary">{producto.precio}€</p>
                            </div>
                            <div>
                                <p className="text-sm opacity-60 font-bold uppercase">Disponibilidad</p>
                                <p className={`text-xl font-bold ${producto.stock > 0 ? 'text-success' : 'text-error'}`}>
                                    {producto.stock > 0 ? `${producto.stock} en stock` : 'Agotado'}
                                </p>
                            </div>
                            <div className="mb-6">
                                <p className="text-sm opacity-60 font-bold uppercase">Valoración: {producto.valoracion_global}/5</p>
                                <div className="rating rating-md rating-half pointer-events-none">
                                    {[...Array(10)].map((_, i) => (
                                        <input
                                            key={i}
                                            type="radio"
                                            className={`mask mask-star-2 ${i % 2 === 0 ? 'mask-half-1' : 'mask-half-2'} bg-amber-400`}
                                            checked={i + 1 <= producto.valoracion_global * 2}
                                            disabled
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="card-actions">
                            <button
                                className="btn btn-warning btn-block text-lg font-bold"
                                onClick={() => document.getElementById('my_modal_2').showModal()}
                                disabled={producto.stock === 0}
                            >
                                {producto.stock > 0 ? 'Realizar Pedido' : 'Producto sin existencias'}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <dialog id="my_modal_2" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box max-w-2xl">

                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                            ✕
                        </button>
                    </form>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            alert("¡Compra realizada con éxito!");
                            cerrarModal();
                        }}
                    >
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            📦 Pedido: {producto.nombre}
                        </h3>

                        <div className="space-y-6">

                            <section>
                                <label className="label mb-2 font-bold">Tipo de entrega</label>
                                <select
                                    className="select select-bordered w-full"
                                    value={tipoEntrega}
                                    onChange={(e) => setTipoEntrega(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>
                                        Selecciona cómo recibirás tu producto
                                    </option>
                                    <option value="recogida">🏪 Recogida en taller (Gratis)</option>
                                    <option value="domicilio">
                                        🚚 Envío a domicilio (+ 5% del precio original)
                                    </option>
                                </select>
                            </section>

                            {tipoEntrega === "domicilio" && (
                                <div className="bg-base-200 p-4 rounded-xl space-y-4 animate-fadeIn">
                                    <h4 className="font-bold text-sm uppercase opacity-60 text-primary">
                                        Datos de Envío
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="form-control">
                                            <span className="label-text mb-2 block">
                                                Dirección completa
                                            </span>
                                            <input
                                                required
                                                type="text"
                                                placeholder="Calle, número, piso..."
                                                className="input input-bordered w-full"
                                            />
                                        </div>

                                        <div className="form-control">
                                            <span className="label-text mb-2 block">Ciudad</span>
                                            <input
                                                required
                                                list="ciudades"
                                                placeholder="Ej: Puerto del Rosario"
                                                className={`input input-bordered w-full ${!ciudadValida ? "input-error" : ""
                                                    }`}
                                                value={ciudad}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setCiudad(value);
                                                    setCiudadValida(ciudades.includes(value));
                                                }}
                                            />
                                            <datalist id="ciudades">
                                                {ciudades.map((c) => (
                                                    <option key={c} value={c} />
                                                ))}
                                            </datalist>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {tipoEntrega === "recogida" && (
                                <div className="alert alert-info shadow-sm">
                                    <span>
                                        Podrás recoger tu pieza en 24h en nuestro taller principal.
                                    </span>
                                </div>
                            )}

                            {(tipoEntrega === "recogida" || tipoEntrega === "domicilio") && (
                                <>
                                    <div className="divider text-xs opacity-50 uppercase font-bold">
                                        Resumen de Pago
                                    </div>

                                    <div className="flex justify-between items-center bg-primary text-primary-content p-4 rounded-lg">
                                        <span className="font-bold">TOTAL FINAL:</span>
                                        <span className="text-2xl font-black">{precioFinal}€</span>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="form-control">
                                            <span className="label-text mb-2 block font-medium">
                                                Titular de la tarjeta
                                            </span>
                                            <input
                                                required
                                                type="text"
                                                placeholder="Nombre completo"
                                                className="input input-bordered w-full"
                                            />
                                        </div>

                                        <div className="form-control">
                                            <span className="label-text mb-2 block font-medium">
                                                Número de tarjeta
                                            </span>

                                            <input
                                                type="text"
                                                required
                                                placeholder="0000 0000 0000 0000"
                                                className={`input input-bordered w-full tracking-widest ${!tarjetaValida ? "input-error" : ""
                                                    }`}
                                                value={tarjeta}
                                                onChange={(e) => {
                                                    const value = e.target.value
                                                        .replace(/[^\d]/g, "")
                                                        .replace(/(.{4})/g, "$1 ")
                                                        .trim();

                                                    setTarjeta(value);
                                                    setTarjetaValida(esTarjetaValida(value));
                                                }}
                                                maxLength={19}
                                            />

                                            {!tarjetaValida && (
                                                <span className="text-error text-sm mt-1">
                                                    Número de tarjeta no válido
                                                </span>
                                            )}
                                        </div>


                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="form-control">
                                                <span className="label-text mb-2 block font-medium">
                                                    Vencimiento
                                                </span>
                                                <input
                                                    type="text"
                                                    placeholder="MM/AA"
                                                    value={vencimiento}
                                                    maxLength={5}
                                                    className={`input input-bordered w-full ${!vencimientoValido ? "input-error" : ""}`}
                                                    onChange={(e) => {
                                                        let value = e.target.value.replace(/\D/g, "");
                                                        if (value.length > 2) {
                                                            value = value.slice(0, 2) + "/" + value.slice(2, 4);
                                                        }
                                                        setVencimiento(value);

                                                        if (value.length === 5) {
                                                            setVencimientoValido(esFechaValida(value));
                                                        } else {
                                                            setVencimientoValido(true);
                                                        }
                                                    }}
                                                />

                                                {!vencimientoValido && (
                                                    <span className="text-error text-sm mt-1">Fecha no válida</span>
                                                )}

                                            </div>

                                            <div className="form-control">
                                                <span className="label-text mb-2 block font-medium">
                                                    CVV
                                                </span>
                                                <input
                                                    required
                                                    type="password"
                                                    placeholder="***"
                                                    className="input input-bordered w-full"
                                                    maxLength={4}
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-block text-lg mt-6"
                                        >
                                            Confirmar Pago de {precioFinal}€
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
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


