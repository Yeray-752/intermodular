import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../CalendarioCustom.css';
import '../App.css';

function TableReservations({ search, categoriaId, servicios }) {
    const { t, i18n } = useTranslation('servicios');
    const [servicioExpandido, setServicioExpandido] = useState(null);
    const filtroBusqueda = (search || '').toLowerCase();
    const lang = i18n.language?.split('-')[0] || 'es';

    // Lógica para colorear la dificultad (Frontend)
    const getDifficultyColor = (level) => {
        switch (level) {
            case 'low': return 'text-green-500';
            case 'medium': return 'text-yellow-500';
            case 'high': return 'text-red-500';
            default: return '';
        }
    };

    // Simulación de estados para el calendario
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

    const serviciosFiltrados = servicios.filter((s) => {
        const coincideNombre = s.name?.toLowerCase().includes(filtroBusqueda);
        const coincideCat = !categoriaId || s.category_id === categoriaId;
        return coincideNombre && coincideCat;
    });

    return (
        <>
            {serviciosFiltrados.map(servicio => (
                <div key={servicio.id} className='card bg-base-100 shadow-xl h-full w-80 flex flex-col border border-base-300'>
                    <figure className="h-[140px] w-full p-2">
                        <img
                            src={servicio.image_url}
                            alt={servicio.name}
                            className="h-full w-full object-cover rounded-xl"
                        />
                    </figure>

                    <div className="card-body p-4 grow flex flex-col items-center text-center">
                        <h2 className="card-title text-lg mb-2 font-bold">{servicio.name}</h2>
                        <p className="text-sm mb-3 grow line-clamp-3 text-base-content/70">{servicio.description}</p>

                        <div className="mt-auto border-t border-base-300 pt-3 w-full">
                            <div className="flex justify-between text-xs mb-2">
                                <p><span className="font-semibold">{t('duration')}:</span> {servicio.duration}</p>
                                {/* Dificultad: La clave es 'low'/'medium'/'high' para el color y la traducción */}
                                <p>
                                    <span className="font-semibold">{t('difficulty')}:</span>{" "}
                                    <span className={`font-bold ${getDifficultyColor(servicio.difficulty)}`}>
                                        {t(`levels.${servicio.difficulty}`)}
                                    </span>
                                </p>
                            </div>

                            <div className="card-actions justify-between items-center">
                                <div className="text-xl font-extrabold text-orange-600">
                                    {servicio.price}€
                                </div>

                                <button
                                    className="btn btn-sm btn-primary text-white"
                                    onClick={() => {
                                        setServicioExpandido(servicio.id);
                                        document.getElementById(`modal_${servicio.id}`).showModal();
                                    }}
                                >
                                    {t('book')}
                                </button>

                                {/* MODAL DINÁMICO */}
                                <dialog id={`modal_${servicio.id}`} className="modal modal-bottom sm:modal-middle text-left">
                                    <div className="modal-box max-w-md bg-base-100 p-6">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="font-bold text-2xl text-primary">{t('bookTitle')}</h3>
                                            <span className="badge badge-ghost p-3">{servicio.name}</span>
                                        </div>

                                        <div className="form-control w-full mb-6">
                                            <label className="label">
                                                <span className="label-text font-semibold">{t('vehicleQuestion')}</span>
                                            </label>
                                            <select className="select select-bordered w-full bg-base-200">
                                                <option disabled selected>{t('selectVehicle')}</option>
                                                <option>Mi Toyota Corolla</option>
                                            </select>
                                        </div>

                                        <div className="flex flex-col items-center bg-base-200 rounded-xl p-4 mb-4">
                                            <label className="label self-start pb-2">
                                                <span className="label-text font-semibold">{t('selectDate')}</span>
                                            </label>
                                            <Calendar
                                                tileClassName={obtenerClaseDia}
                                                className="custom-calendar"
                                                locale={lang === 'es' ? 'es-ES' : 'en-US'}
                                            />
                                        </div>

                                        {/* Leyenda de colores basada en tu JSON */}
                                        <div className="grid grid-cols-1 gap-1 mb-4 text-xs">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                <span>{t('lowDemand')}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                                <span>{t('highDemand')}</span>
                                            </div>
                                        </div>

                                        <div className="modal-action">
                                            <form method="dialog" className="flex gap-2 w-full">
                                                <button className="btn flex-1" onClick={() => setServicioExpandido(null)}>{t('cancel')}</button>
                                                <button className="btn btn-primary flex-1">{t('confirm')}</button>
                                            </form>
                                        </div>
                                    </div>
                                    <form method="dialog" className="modal-backdrop">
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