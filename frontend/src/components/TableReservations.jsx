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
        "2026-01-20": "lleno",
        "2026-01-21": "medio",
        "2026-01-22": "disponible",
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

                            <figure className="h-[140px] w-[250px] aspect-video">
                                <img
                                    src={servicios.imagen}
                                    alt={servicios.nombre}
                                    className="h-[150px] w-[250px] object-cover"
                                />
                            </figure>

                            <div className="card-body p-2 grow flex flex-col items-center text-center">

                                <h2 className="card-title text-lg text-center mb-2">{servicios.nombre}</h2>
                                <p className="text-sm mb-3 grow">{servicios.descripcion}</p>



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

                                        <button
                                            className={`btn btn-sm text-white mr-2 ${servicioExpandido === servicios.id ? 'btn-error' : 'bg-orange-600'}`}
                                            onClick={() => document.getElementById(`modal_${servicios.id}`).showModal()}
                                        >
                                            {servicioExpandido === servicios.id ? 'Cerrar' : 'Reservar'}
                                        </button>
                                        <dialog id={`modal_${servicios.id}`} className="modal modal-bottom sm:modal-middle">
                                            <div className="modal-box max-w-md bg-base-100 p-6 shadow-2xl border border-base-200">

                                                <div className="flex justify-between items-center mb-6">
                                                    <h3 className="font-bold text-2xl text-primary">Reservar Cita</h3>
                                                    <span className="badge badge-ghost p-3">{servicios.nombre}</span>
                                                </div>

                                                <div className="form-control w-full mb-6">
                                                    <label className="label">
                                                        <span className="label-text font-semibold mb-5">¿Qué vehículo traerás?</span>
                                                    </label>
                                                    <select className="select select-bordered w-full bg-base-200" id="ns" name="Vehiculrewrewos" defaultValue='Seleciona un vehiculo'>
                                                        <option value="ewr">Toyota - Corolla</option>
                                                        <option value="rewrew">Toyota - Hilux</option>
                                                    </select>
                                                </div>

                                                <div className="flex flex-col items-center bg-base-200 rounded-xl p-4 mb-4">
                                                    <label className="label self-start pb-2">
                                                        <span className="label-text font-semibold">Selecciona la fecha:</span>
                                                    </label>                                                
                                                        <div className="mi-contenedor-calendario">
                                                            <Calendar
                                                            tileClassName={obtenerClaseDia}
                                                            className="custom-calendar" // Usaremos esta clase en el CSS
                                                            locale="es-ES"
                                                            minDetail="month"
                                                            next2Label={null} // Quita las flechas dobles >>
                                                            prev2Label={null} // Quita las flechas dobles <<
                                                            navigationLabel={({ date }) => (
                                                                <span className="font-bold text-lg capitalize">
                                                                    {date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                                                                </span>
                                                            )}
                                                        />
                                                        </div>
                                                </div>

                                                <div className="grid grid-cols-1 gap-2 bg-base-200/50 p-4 rounded-lg">
                                                    <p className="text-xs font-bold uppercase text-gray-400 mb-1">Estado de disponibilidad:</p>
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                        <span>Baja demanda (Recomendado)</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                                        <span>Demanda media</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-error">
                                                        <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]"></div>
                                                        <span className="font-medium">Alta demanda (Sujeto a cancelación)</span>
                                                    </div>
                                                </div>

                                                <div className="modal-action flex gap-2">
                                                    <form method="dialog" className="flex-1">
                                                        <button className="btn btn-ghost w-full">Cancelar</button>
                                                    </form>
                                                    <button className="btn btn-primary flex-1 shadow-lg shadow-primary/20" onClick={() => console.log("Reservar")}>
                                                        Confirmar Cita
                                                    </button>
                                                </div>
                                            </div>

                                            <form method="dialog" className="modal-backdrop backdrop-blur-sm bg-black/30">
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