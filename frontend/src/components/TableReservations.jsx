import { useTranslation } from 'react-i18next';
import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../style/CalendarioCustom.css';
import '../style/App.css';

function TableReservations({ search, categoriaId, servicios }) {
    const { t, i18n } = useTranslation('servicios');
    const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
    const token = localStorage.getItem("token");
    const location = useLocation();
    const navigate = useNavigate();
    const lang = i18n.language?.split('-')[0] || 'es';

    const serviciosFiltrados = useMemo(() => {
        const filtro = (search || '').toLowerCase();
        return (servicios || []).filter((s) => {
            const coincideNombre = s.name?.toLowerCase().includes(filtro);
            const coincideCat = !categoriaId || s.category_id === categoriaId;
            return coincideNombre && coincideCat;
        });
    }, [servicios, search, categoriaId]);

    const getDifficultyColor = (level) => {
        switch (level) {
            case 'low': return 'text-success'; // DaisyUI semantic color
            case 'medium': return 'text-warning'; // DaisyUI semantic color
            case 'high': return 'text-error'; // DaisyUI semantic color
            default: return '';
        }
    };

    const datosReservas = { "2026-01-20": "lleno", "2026-01-21": "medio", "2026-01-22": "disponible" };

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

    const abrirModal = (servicio) => {
        setServicioSeleccionado(servicio);
        document.getElementById('modal_reserva_unico').showModal();
    };
    const cerrarModal = () => {
        document.getElementById('modal_reserva_unico').close();
    };

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 justify-items-center">
                {serviciosFiltrados.map((servicio) => (
                    <div
                        key={servicio.id}
                        className="bg-base-100 text-base-content rounded-2xl shadow-md hover:shadow-xl w-full max-w-[320px] flex flex-col p-4 border border-base-300"
                    >
                        <div className="relative mb-4">
                            <img
                                src={servicio.image_url}
                                alt={servicio.name}
                                className="h-44 w-full object-cover rounded-xl"
                            />
                            <span className="absolute top-2 right-2 text-xs font-semibold bg-primary text-base-100 px-3 py-1 rounded-full">
                                {servicio.duration}
                            </span>
                        </div>

                        <div className="flex flex-col grow">
                            <h2 className="text-lg font-bold mb-2 text-base-content line-clamp-1">{servicio.name}</h2>
                            <p className="text-sm text-base-content font-semibold mb-4 line-clamp-3 h-14">{servicio.description}</p>

                            <div className="mt-auto">
                                <p className="text-xs mb-4">
                                    <span className="font-semibold text-lg">{t('difficulty')}:</span>{" "}
                                    <span className={`font-semibold text-lg ${getDifficultyColor(servicio.difficulty)}`}>
                                        {t(`levels.${servicio.difficulty}`)}
                                    </span>
                                </p>
                                <div className="flex items-center justify-between pt-4 border-t border-base-300">
                                    <span className="text-2xl font-extrabold text-secondary">{servicio.price}€</span>
                                    <button
                                        className="btn btn-primary btn-sm text-base-100 text-lg rounded-full px-6"
                                        onClick={() => abrirModal(servicio)}
                                    >
                                        {t('book')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL ÚNICO */}
            <dialog id="modal_reserva_unico" className="modal modal-bottom sm:modal-middle backdrop-blur-sm">
                <div className="modal-box max-w-lg p-0 overflow-y-auto max-h-[90vh] rounded-2xl bg-base-100 text-base-content shadow-2xl border border-base-300 flex flex-col">

                    {servicioSeleccionado ? (
                        <>
                            {/* HEADER */}
                            <div className="sticky top-0 z-20 bg-base-100/90 backdrop-blur-md px-6 py-5 border-b border-base-300">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-extrabold text-2xl tracking-tight">
                                            {t('bookTitle')}
                                        </h3>
                                        <p className="text-xs opacity-60 mt-0.5">{t('cita')}</p>
                                    </div>
                                    <button
                                        className="btn btn-sm btn-circle btn-ghost"
                                        onClick={() => document.getElementById('modal_reserva_unico').close()}
                                    >✕</button>
                                </div>
                                <div className="mt-3">
                                    <span className="badge badge-primary badge-outline font-bold px-3 py-3">
                                        {servicioSeleccionado.name}
                                    </span>
                                </div>
                            </div>

                            {/* CONTENIDO */}
                            <div className="p-6 space-y-6">
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-bold mb-3">{t('vehicleQuestion')}</span>
                                    </label>
                                    <select className="select select-bordered w-full bg-base-200 focus:ring-2 focus:ring-primary/20 transition-all" defaultValue={0}>
                                        <option disabled value={0}>{t('selectVehicle')}</option>
                                        <option>Mi Toyota Corolla</option>
                                        <option>Añadir nuevo vehículo...</option>
                                    </select>
                                </div>

                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-bold mb-3">{t('motivo')}</span>
                                    </label>
                                    <textarea
                                        placeholder={t('descripcion')}
                                        className="textarea textarea-bordered w-full bg-base-200 focus:ring-2 focus:ring-primary/20 h-24"
                                    />
                                </div>

                                <div className="bg-base-200 rounded-2xl p-4 border border-base-300">
                                    <label className="label pt-0">
                                        <span className="label-text font-bold mb-2">{t('selectDate')}</span>
                                    </label>

                                    <div className="bg-base-100 rounded-xl shadow-sm p-2 mb-4 border border-base-300 overflow-hidden text-base-content">
                                        <Calendar
                                            tileClassName={obtenerClaseDia}
                                            locale={lang === 'es' ? 'es-ES' : 'en-US'}
                                            className="mx-auto border-none bg-base-100 text-base-content"
                                        />
                                    </div>

                                    <div className="flex flex-wrap justify-center gap-4 text-[10px] uppercase font-bold tracking-widest opacity-60">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-success shadow-sm"></div>
                                            <span>{t('lowDemand')}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-warning shadow-sm"></div>
                                            <span>{t('mediumDemand')}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-error shadow-sm"></div>
                                            <span>{t('highDemand')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* FOOTER */}
                            <div className="sticky bottom-0 z-20 bg-base-100/90 backdrop-blur-md p-6 border-t border-base-300">
                                <form method="dialog" className="flex gap-3 w-full">
                                    <button
                                        className="btn btn-ghost flex-1 font-bold opacity-60"
                                        onClick={() => cerrarModal()}
                                    >
                                        {t('cancel')}
                                    </button>
                                    <button className="btn btn-primary flex-2 shadow-lg shadow-primary/20 font-bold">
                                        {token ? t('confirm') : t('noToken')}
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="py-24 flex flex-col items-center justify-center gap-4">
                            <span className="loading loading-ring loading-lg text-primary"></span>
                            <p className="text-base-content opacity-40 font-medium animate-pulse uppercase tracking-widest text-sm">Cargando servicio...</p>
                        </div>
                    )}
                </div>
            </dialog>
        </div>
    );
}

export default TableReservations;