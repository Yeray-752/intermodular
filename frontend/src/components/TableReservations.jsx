import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../style/CalendarioCustom.css';
import '../style/App.css';

function TableReservations({ search, categoriaId, servicios }) {
    const { t, i18n } = useTranslation('servicios');
    const [servicioExpandido, setServicioExpandido] = useState(null);
    const filtroBusqueda = (search || '').toLowerCase();
    const lang = i18n.language?.split('-')[0] || 'es';

    const token = localStorage.getItem("token");
    const location = useLocation();
        const navigate = useNavigate();

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
            {serviciosFiltrados.map((servicio) => (
                <div
                    key={servicio.id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 w-80 flex flex-col p-4"
                >
                    {/* IMAGEN */}
                    <div className="relative mb-4">
                        <img
                            src={servicio.image_url}
                            alt={servicio.name}
                            className="h-40 w-full object-cover rounded-xl"
                        />

                        {/* DURACIÓN DISCRETA */}
                        <span className="absolute top-2 right-2 text-xs font-semibold bg-indigo-600 text-white px-3 py-1 rounded-full">
                            {servicio.duration}
                        </span>
                    </div>

                    {/* CONTENIDO */}
                    <h2 className="text-lg font-bold mb-1 text-gray-900">
                        {servicio.name}
                    </h2>

                    <p className="text-sm text-gray-500 mb-3 leading-relaxed">
                        {servicio.description}
                    </p>

                    {/* DIFICULTAD */}
                    <p className="text-xs mb-4">
                        <span className="font-semibold">{t('difficulty')}:</span>{" "}
                        <span className={`font-semibold ${getDifficultyColor(servicio.difficulty)}`}>
                            {t(`levels.${servicio.difficulty}`)}
                        </span>
                    </p>

                    {/* FOOTER */}
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-2xl font-extrabold text-orange-500">
                            {servicio.price}€
                        </span>

                        <button
                            className="btn btn-primary btn-sm rounded-full px-6"
                            onClick={() => {
                                setServicioExpandido(servicio.id);
                                document.getElementById(`modal_${servicio.id}`).showModal();
                            }}
                        >
                            {t('book')}
                        </button>
                    </div>

                    {/* MODAL */}
                    <dialog
                        id={`modal_${servicio.id}`}
                        className="modal modal-bottom sm:modal-middle"
                    >
                        <div className="modal-box max-w-lg rounded-2xl shadow-xl">
                            {/* HEADER */}
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-primary">
                                    {t('bookTitle')}
                                </h3>
                                <span className="badge badge-outline">
                                    {servicio.name}
                                </span>
                            </div>

                            {/* VEHÍCULO */}
                            <div className="form-control mb-5">
                                <label className="label font-semibold">
                                    {t('vehicleQuestion')}
                                </label>
                                <select className="select select-bordered">
                                    <option disabled selected>
                                        {t('selectVehicle')}
                                    </option>
                                    <option>Mi Toyota Corolla</option>
                                </select>
                            </div>

                            {/* CALENDARIO */}
                            <div className="bg-base-200 rounded-xl p-4 mb-4">
                                <label className="label font-semibold">
                                    {t('selectDate')}
                                </label>
                                <Calendar
                                    tileClassName={obtenerClaseDia}
                                    className="custom-calendar mx-auto"
                                    locale={lang === 'es' ? 'es-ES' : 'en-US'}
                                />
                            </div>

                            {/* LEYENDA */}
                            <div className="grid grid-cols-3 gap-3 text-xs mb-6 text-center">
                                <div className="flex items-center justify-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                    {t('lowDemand')}
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                                    {t('mediumDemand')}
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                                    {t('highDemand')}
                                </div>
                        </div>
                        <div>

                                {token ?
                                    <button
                                        className="btn btn-sm btn-primary text-white"
                                        onClick={() => {
                                            setServicioExpandido(servicio.id);
                                            document.getElementById(`modal_${servicio.id}`).showModal();
                                        }}
                                    >
                                        {t('book')}
                                    </button>
                                    :
                                    <button
                                        className="btn btn-sm btn-primary text-white"
                                        onClick={() => navigate('/Login', { state: { from: location } })}
                                    >
                                        {t('noToken')}
                                    </button>
                                }
                            

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
                                            <select className="select select-bordered w-full bg-base-200" defaultValue={0}>
                                                <option disabled value={0}>{t('selectVehicle')}</option>
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

                        {/* BACKDROP */}
                        <form method="dialog" className="modal-backdrop">
                            <button onClick={() => setServicioExpandido(null)}>
                                close
                            </button>
                        </form>
                    </dialog>
                </div>
            ))}



        </>
    );
}

export default TableReservations;