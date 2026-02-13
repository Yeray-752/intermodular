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
                        className="bg-base-100 text-base-content rounded-2xl shadow-md hover:shadow-xl w-full max-w-[320px] flex flex-col p-5"
                    >
                        <div className="relative mb-4">
                            <img
                                src={servicio.image_url}
                                alt={servicio.name}
                                className="h-44 w-full object-cover rounded-xl"
                            />
                            <span className="absolute top-2 right-2 text-md font-medium bg-primary text-base-100 px-3 py-1 rounded-full">
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
                {/* 1. Quitamos 'overflow-y-auto' de aquí para dárselo solo al contenido central */}
                <div className="modal-box max-w-lg p-0 max-h-[90vh] rounded-2xl bg-base-100 text-base-content shadow-2xl flex flex-col overflow-hidden">

                    {servicioSeleccionado ? (
                        <div className="flex flex-col h-full overflow-hidden">

                            {/* HEADER - Fijo arriba */}
                            <div className="sticky top-0 z-30 header-custom px-6 py-5 border-b border-calendar-divider bg-base-100">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-extrabold text-2xl tracking-tight text-calendar-main">
                                            {t('bookTitle')}
                                        </h3>
                                        <p className="text-xs text-calendar-muted mt-0.5">{t('cita')}</p>
                                    </div>
                                    <button
                                        className="btn btn-sm btn-circle btn-ghost text-calendar-main"
                                        onClick={() => document.getElementById('modal_reserva_unico').close()}
                                    >✕</button>
                                </div>
                                <div className="mt-3">
                                    <span className="badge-custom font-bold px-3 py-1">
                                        {servicioSeleccionado.name}
                                    </span>
                                </div>
                            </div>

                            {/* CONTENIDO CENTRAL - Este es el que hace SCROLL */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-calendar-inner">
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-bold mb-3 text-calendar-main">{t('vehicleQuestion')}</span>
                                    </label>
                                    <select className="input-custom w-full transition-all" defaultValue={0}>
                                        <option disabled value={0}>{t('selectVehicle')}</option>
                                        <option>Mi Toyota Corolla</option>
                                        <option>Añadir nuevo vehículo...</option>
                                    </select>
                                </div>

                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-bold mb-3 text-calendar-main">{t('motivo')}</span>
                                    </label>
                                    <textarea
                                        placeholder={t('descripcion')}
                                        className="input-custom w-full h-24"
                                    />
                                </div>

                                <div className="bg-calendar-card rounded-2xl p-4 border border-calendar-divider">
                                    <label className="label pt-0">
                                        <span className="label-text font-bold mb-2 text-calendar-main">{t('selectDate')}</span>
                                    </label>

                                    <div className="mi-contenedor-calendario">
                                        <Calendar
                                            tileClassName={obtenerClaseDia}
                                            locale={lang === 'es' ? 'es-ES' : 'en-US'}
                                            className="mx-auto"
                                        />
                                    </div>

                                    {/* LEYENDA */}
                                    <div className="flex flex-wrap justify-center gap-4 text-[10px] uppercase font-bold tracking-widest text-calendar-muted mt-4">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e] shadow-sm"></div>
                                            <span>{t('lowDemand')}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#fbbf24] shadow-sm"></div>
                                            <span>{t('mediumDemand')}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444] shadow-sm"></div>
                                            <span>{t('highDemand')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* FOOTER - Fijo abajo */}
                            <div className="sticky bottom-0 z-30 header-custom p-6 border-t border-calendar-divider bg-base-100">
                                <form method="dialog" className="flex gap-3 w-full">
                                    <button
                                        className="btn btn-ghost flex-1 font-bold text-calendar-muted"
                                        onClick={() => cerrarModal()}
                                    >
                                        {t('cancel')}
                                    </button>
                                    <button className="btn-primary-custom flex-2 shadow-lg font-bold">
                                        {token ? t('confirm') : t('noToken')}
                                    </button>
                                </form>
                            </div>

                        </div>
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