import { useState } from 'react';
import '../App.css';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../CalendarioCustom.css';
import serviciosTaller from "../assets/data/serviciosTaller.json";

function TableReservations({ search, props }) {
    const [datosTaller] = useState(serviciosTaller);
    const filtroBusqueda = (search || '').toLowerCase();
    const categorias = (props || '');

    // ESTADO para controlar qué calendario está abierto
    const [servicioExpandido, setServicioExpandido] = useState(null);

    const toggleCalendario = (id) => {
        setServicioExpandido(servicioExpandido === id ? null : id);
    };

    const datosReservas = {
        "2025-12-20": "lleno",
        "2025-12-21": "medio",
        "2025-12-22": "disponible",
    };

    const obtenerClaseDia = ({ date, view }) => {
        if (view === 'month') {
            const fechaKey = date.toLocaleDateString('en-CA');
            const estado = datosReservas[fechaKey];
            if (estado === 'lleno') return 'dia-rojo';
            if (estado === 'medio') return 'dia-amarillo';
            if (estado === 'disponible') return 'dia-verde';
        }
        return null;
    };

    return (
        <>
            {datosTaller.filter((servicio) => {
                const coincideNombre = servicio.nombre.toLowerCase().includes(filtroBusqueda);
                const coincideCategoria = categorias === "" || categorias === "X" || servicio.categoria === categorias;
                return coincideNombre && coincideCategoria;
            })
                .map(servicios => {
                    return (
                        <div key={servicios.id} className='card bg-base-100 shadow-xl h-100 w-80 flex flex-col'>

                            <figure className="aspect-video">
                                <img
                                    src={servicios.imagen}
                                    alt={servicios.nombre}
                                    className="w-full h-full object-cover"
                                />
                            </figure>

                            <div className="card-body p-2 grow flex flex-col items-center text-center">

                                <h2 className="card-title text-lg text-center mb-2">{servicios.nombre}</h2>
                                <p className="text-sm text-gray-900 mb-3 grow">{servicios.descripcion}</p>

                                

                                <div className="mt-auto border-t border-gray-200 pt-3 w-full">
                                    <div className="flex justify-between text-xs space-x-8 mb-2">
                                        <p>
                                            <span className="font-semibold">Duración:</span> {servicios.duracion}
                                        </p>
                                        <p>
                                            <span className="font-semibold"> Dificultad:</span> {servicios.dificultad}
                                        </p>
                                    </div>

                                    <div className="card-actions justify-between items-center">
                                        <div className="text-2xl font-extrabold text-orange-600">
                                            <p className='pl-5'>{servicios.precio}€</p>
                                        </div>

                                        {/* Botón que ahora dispara el toggle */}
                                        <button
                                            className={`btn btn-sm text-white mr-2 ${servicioExpandido === servicios.id ? 'btn-error' : 'bg-orange-600'}`}
                                            onClick={() => document.getElementById(`modal_${servicios.id}`).showModal()}
                                        >
                                            {servicioExpandido === servicios.id ? 'Cerrar' : 'Reservar'}
                                        </button>
                                        <dialog id={`modal_${servicios.id}`} className="modal">
                                        <div className="modal-box max-w-md">
                                            <h3 className="font-bold text-lg mb-4">Reservar: {servicios.nombre}</h3>

                                            Vehiculos: <select name="Vehiculrewrewos" id="ns">
                                                <option value="ewr">Toyota</option>
                                                <option value="rewrew">Toyota</option>
                                            </select>
                                            
                                            <div className="py-2 flex justify-center">
                                                {/* EL CALENDARIO DENTRO DEL MODAL */}
                                                <Calendar
                                                    tileClassName={obtenerClaseDia}
                                                    className="rounded-lg border-none shadow-sm"
                                                />
                                            </div>

                                            <p className="text-xs text-left text-gray-500 mt-4">
                                                Selecciona un día disponible:<br />
                                                Verde: Poco trabajo.<br />
                                                Amarillo: Hay algo de trabajo.<br />
                                                Rojo: Mucho trabajo (Muchas posibilidades de cancelar la cita.)
                                            </p>

                                            <div className="modal-action">
                                                <form method="dialog">
                                                    {/* Botón para cerrar el modal */}
                                                    <button className="btn">Cerrar</button>
                                                </form>
                                            </div>
                                        </div>
                                        
                                        {/* Click fuera para cerrar */}
                                        <form method="dialog" className="modal-backdrop">
                                            <button>close</button>
                                        </form>
                                    </dialog>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
        </>
    );
}

export default TableReservations;