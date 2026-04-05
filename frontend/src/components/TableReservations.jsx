import { useTranslation } from 'react-i18next';
import { useState, useMemo, useEffect } from 'react'; // Añadido useEffect
import { useNavigate, useLocation } from "react-router-dom";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../style/CalendarioCustom.css';
import '../style/index.css';

function TableReservations({ search, categoriaId, servicios }) {
    const { t, i18n } = useTranslation('servicios');
    const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const lang = i18n.language?.split('-')[0] || 'es';



    const [misVehiculos, setMisVehiculos] = useState([]);
    const [vehiculoMatricula, setVehiculoMatricula] = useState(""); // Guardaremos la matrícula
    const [motivo, setMotivo] = useState("");
    const [fecha, setFecha] = useState(new Date());


    // 1. Cargar los vehículos del usuario al montar el componente
    useEffect(() => {
        if (token) {
            fetch("http://localhost:3000/api/vehicules", { // Ajusta a tu endpoint real
                headers: { "Authorization": `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setMisVehiculos(data);
                })
                .catch(err => console.error("Error cargando vehículos:", err));
        }
    }, [token]);

    const enviarConsulta = async () => {
        try {
            const año = fecha.getFullYear();
            const mes = String(fecha.getMonth() + 1).padStart(2, '0');
            const dia = String(fecha.getDate()).padStart(2, '0');

            // Formato SQL estándar: YYYY-MM-DD HH:mm:ss
            // Quitamos la 'Z' y preferiblemente usamos un espacio en lugar de la 'T'
            const fechaSQL = `${año}-${mes}-${dia} 12:00:00`;

            const datosReserva = {
                servicio: String(servicioSeleccionado.name),
                vehiculoSeleccionado: String(vehiculoMatricula),
                comentarios: motivo || "",
                fechaCita: fechaSQL // Enviamos el formato limpio
            };

            const response = await fetch("http://localhost:3000/api/dates", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(datosReserva)
            });

            if (response.ok) {
                cerrarModal();
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Función para manejar el cambio de select y la redirección
    const handleVehiculoChange = (e) => {
        const value = e.target.value;
        if (value === "ADD_NEW") {
            cerrarModal();
            // Navega a tu sección de perfil y pasa un estado para abrir la pestaña de coches si es necesario
            navigate("/profile", { state: { activeTab: "vehicles" } });
        } else {
            setVehiculoMatricula(value);
        }
    };

    // ... (Mantén serviciosFiltrados, getDifficultyColor y obtenerClaseDia igual)
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
            case 'low': return 'text-success';
            case 'medium': return 'text-warning';
            case 'high': return 'text-error';
            default: return '';
        }
    };

    const datosReservas2 = { "2026-01-20": "lleno", "2026-01-21": "medio", "2026-01-22": "disponible" };

    const obtenerClaseDia = ({ date, view }) => {
        if (view === 'month') {
            const fechaKey = date.toLocaleDateString('en-CA');
            const estado = datosReservas2[fechaKey];
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
            {/* Renderizado de Cards de servicio... igual que antes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 justify-items-center">
                {serviciosFiltrados.map((servicio) => (
                    <div key={servicio.id} className="bg-base-100 text-base-content rounded-2xl shadow-md hover:shadow-xl w-full max-w-[320px] flex flex-col p-5">
                        <div className="relative mb-4">
                            <img src={servicio.image_url} alt={servicio.name} className="h-44 w-full object-cover rounded-xl" />
                            <span className="absolute top-2 right-2 text-md font-medium bg-primary text-base-100 px-3 py-1 rounded-full">{servicio.duration}</span>
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
                                    <button className="btn btn-primary btn-sm text-base-100 text-lg rounded-full px-6" onClick={() => abrirModal(servicio)}>{t('book')}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <dialog id="modal_reserva_unico" className="modal modal-bottom sm:modal-middle backdrop-blur-sm">
                <div className="modal-box max-w-lg p-0 max-h-[90vh] rounded-2xl bg-base-100 text-base-content shadow-2xl flex flex-col overflow-hidden">
                    {servicioSeleccionado ? (
                        <div className="flex flex-col h-full overflow-hidden">
                            {/* Header del Modal */}
                            <div className="sticky top-0 z-30 header-custom px-6 py-5 border-b border-calendar-divider bg-base-100">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-extrabold text-2xl tracking-tight text-calendar-main">{t('bookTitle')}</h3>
                                        <p className="text-xs text-calendar-muted mt-0.5">{t('cita')}</p>
                                    </div>
                                    <button className="btn btn-sm btn-circle btn-ghost text-calendar-main" onClick={cerrarModal}>✕</button>
                                </div>
                                <div className="mt-3">
                                    <span className="badge-custom font-bold px-3 py-1">{servicioSeleccionado.name}</span>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-calendar-inner">
                                {/* SECCIÓN DE VEHÍCULOS DINÁMICA */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-bold mb-3 text-calendar-main">{t('vehicleQuestion')}</span>
                                    </label>
                                    <select
                                        onChange={(e) => {
                                            if (e.target.value === "ADD_NEW") {
                                                cerrarModal();
                                                navigate("/perfil", { state: { section: "cars" } });
                                            } else {
                                                setVehiculoMatricula(e.target.value);
                                            }
                                        }}
                                        className="input-custom w-full"
                                        defaultValue={0}
                                    >
                                        <option disabled value={0}>{t('selectVehicle')}</option>

                                        {/* Iteramos sobre los vehículos reales de tu tabla MariaDB */}
                                        {misVehiculos.map((v) => (
                                            <option key={v.matricula} value={v.matricula}>
                                                {v.marca} {v.modelo} - {v.matricula}
                                            </option>
                                        ))}

                                        <option value="ADD_NEW" className="text-primary font-bold">
                                            + Añadir nuevo vehículo...
                                        </option>
                                    </select>
                                </div>

                                {/* Motivo y Calendario... (Igual que antes) */}
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-bold mb-3 text-calendar-main">{t('motivo')}</span>
                                    </label>
                                    <textarea
                                        placeholder={t('descripcion')}
                                        className="input-custom w-full h-24"
                                        onChange={(e) => setMotivo(e.target.value)}
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
                                            onChange={(e) => setFecha(e)}
                                        />
                                    </div>
                                    {/* Leyenda de colores... */}
                                </div>
                            </div>

                            {/* Footer del Modal */}
                            <div className="sticky bottom-0 z-30 header-custom p-6 border-t border-calendar-divider bg-base-100">
                                <div className="flex gap-3 w-full">
                                    <button className="btn btn-ghost flex-1 font-bold text-calendar-muted" onClick={cerrarModal}>
                                        {t('cancel')}
                                    </button>
                                    <button
                                        onClick={enviarConsulta}
                                        className="btn-primary-custom flex-2 shadow-lg font-bold"
                                        disabled={!vehiculoMatricula}
                                    >
                                        {token ? t('confirm') : t('noToken')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="py-24 flex flex-col items-center justify-center gap-4">
                            <span className="loading loading-ring loading-lg text-primary"></span>
                            <p className="text-base-content opacity-40 font-medium animate-pulse">Cargando...</p>
                        </div>
                    )}
                </div>
            </dialog>
        </div>
    );
}

export default TableReservations;