import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../App.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../CalendarioCustom.css';
import serviciosTaller from "../assets/data/serviciosTaller.json";

function TableReservations({ search, props: categoriaSeleccionada }) {
    const { i18n } = useTranslation();
    
    // 1. Determinar idioma actual (es o en)
    const lang = i18n.language?.split('-')[0] || 'es';
    
    // 2. Extraer datos del JSON según el idioma
    const datosTaller = serviciosTaller[lang]?.services || [];

    // 3. Diccionario local para textos que no vienen en el JSON de servicios
    const ui = {
        es: {
            duracion: "Duración",
            dificultad: "Dificultad",
            reservar: "Reservar",
            cerrar: "Cerrar",
            tituloModal: "Reservar Cita",
            preguntaVehiculo: "¿Qué vehículo traerás?",
            placeholderVehiculo: "Selecciona un vehículo",
            fecha: "Selecciona la fecha:",
            cancelar: "Cancelar",
            confirmar: "Confirmar Cita",
            alta: "Alta demanda (Sujeto a cancelación)",
            media: "Demanda media",
            baja: "Baja demanda (Recomendado)",
            estadoDispo: "Estado de disponibilidad:"
        },
        en: {
            duracion: "Duration",
            dificultad: "Difficulty",
            reservar: "Book",
            cerrar: "Close",
            tituloModal: "Book Appointment",
            preguntaVehiculo: "Which vehicle will you bring?",
            placeholderVehiculo: "Select a vehicle",
            fecha: "Select date:",
            cancelar: "Cancel",
            confirmar: "Confirm Appointment",
            alta: "High demand (Subject to cancellation)",
            media: "Medium demand",
            baja: "Low demand (Recommended)",
            estadoDispo: "Availability status:"
        }
    }[lang];

    const [servicioExpandido, setServicioExpandido] = useState(null);
    const filtroBusqueda = (search || '').toLowerCase();

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
                const coincideCategoria = 
                    categoriaSeleccionada === "" || 
                    categoriaSeleccionada === "X" || 
                    servicio.categoria === categoriaSeleccionada;
                return coincideNombre && coincideCategoria;
            })
            .map(servicio => (
                <div key={servicio.id} className='card bg-base-100 shadow-xl h-100 w-80 flex flex-col'>
                    <figure className="h-[140px] w-[250px] aspect-video">
                        <img
                            src={servicio.imagen}
                            alt={servicio.nombre}
                            className="h-[150px] w-[250px] object-cover"
                        />
                    </figure>

                    <div className="card-body p-2 grow flex flex-col items-center text-center">
                        <h2 className="card-title text-lg text-center mb-2">{servicio.nombre}</h2>
                        <p className="text-sm mb-3 grow">{servicio.descripcion}</p>

                        <div className="mt-auto border-t border-gray-200 pt-3 w-full">
                            <div className="flex justify-between text-xs space-x-8 mb-2">
                                <p><span className="font-semibold">{ui.duracion}:</span> {servicio.duracion}</p>
                                <p><span className="font-semibold">{ui.dificultad}:</span> {servicio.dificultad}</p>
                            </div>

                            <div className="card-actions justify-between items-center">
                                <div className="text-2xl font-extrabold text-orange-600">
                                    <p className='pl-5'>{servicio.precio}€</p>
                                </div>

                                <button
                                    className={`btn btn-sm text-white mr-2 ${servicioExpandido === servicio.id ? 'btn-error' : 'bg-orange-600'}`}
                                    onClick={() => {
                                        setServicioExpandido(servicio.id);
                                        document.getElementById(`modal_${servicio.id}`).showModal();
                                    }}
                                >
                                    {ui.reservar}
                                </button>

                                <dialog id={`modal_${servicio.id}`} className="modal modal-bottom sm:modal-middle">
                                    <div className="modal-box max-w-md bg-base-100 p-6 shadow-2xl border border-base-200">
                                        
                                        <div className="flex justify-between items-center mb-6 text-left">
                                            <h3 className="font-bold text-2xl text-primary">{ui.tituloModal}</h3>
                                            <span className="badge badge-ghost p-3">{servicio.nombre}</span>
                                        </div>

                                        <div className="form-control w-full mb-6">
                                            <label className="label">
                                                <span className="label-text font-semibold mb-2">{ui.preguntaVehiculo}</span>
                                            </label>
                                            <select className="select select-bordered w-full bg-base-200">
                                                <option disabled selected>{ui.placeholderVehiculo}</option>
                                                <option>Toyota - Corolla</option>
                                                <option>Toyota - Hilux</option>
                                            </select>
                                        </div>

                                        <div className="flex flex-col items-center bg-base-200 rounded-xl p-4 mb-4">
                                            <label className="label self-start pb-2">
                                                <span className="label-text font-semibold">{ui.fecha}</span>
                                            </label>
                                            <Calendar
                                                tileClassName={obtenerClaseDia}
                                                className="custom-calendar"
                                                locale={lang === 'es' ? 'es-ES' : 'en-US'}
                                                minDetail="month"
                                                navigationLabel={({ date }) => (
                                                    <span className="font-bold text-lg capitalize">
                                                        {date.toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { month: 'long', year: 'numeric' })}
                                                    </span>
                                                )}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 gap-2 bg-base-200/50 p-4 rounded-lg text-left mb-4">
                                            <p className="text-xs font-bold uppercase text-gray-400 mb-1">{ui.estadoDispo}</p>
                                            <div className="flex items-center gap-2 text-xs">
                                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                <span>{ui.baja}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs">
                                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                                <span>{ui.media}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-error">
                                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                <span className="font-medium">{ui.alta}</span>
                                            </div>
                                        </div>

                                        <div className="modal-action flex gap-2">
                                            <form method="dialog" className="flex-1">
                                                <button className="btn btn-ghost w-full" onClick={() => setServicioExpandido(null)}>{ui.cancelar}</button>
                                            </form>
                                            <button className="btn btn-primary flex-1 shadow-lg shadow-primary/20" onClick={() => console.log("Reservar")}>
                                                {ui.confirmar}
                                            </button>
                                        </div>
                                    </div>
                                    <form method="dialog" className="modal-backdrop backdrop-blur-sm bg-black/30">
                                        <button onClick={() => setServicioExpandido(null)}>close</button>
                                    </form>
                                </dialog>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}

export default TableReservations;