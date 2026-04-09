import { useState, useEffect, useRef, useMemo, useContext } from 'react';
import { AuthContext } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import { User, Car, Calendar, FileText, Lock, LogOut, Menu, X, Save, Plus, Clock, Bell, CheckCheck, Settings, Zap, Check, ChartNoAxesColumnIcon } from 'lucide-react';
import { data, useNavigate } from 'react-router';
import Footer from '../components/Principal/Footer'
import Header from '../components/Principal/Header'
import AdminButton from '../components/AdminComponents/AdminBoton'
import { useTranslation } from 'react-i18next';
import { workshopSchema } from '../schemas/perfilGeneralSchemas';
import SelectorCanarias from '../components/perfil/selectorCanarias';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from '../components/AdminComponents/PdfRender';
import { usePDF } from '@react-pdf/renderer';


function Perfil() {
    const [productos, setProductos] = useState([]);
    const [citaACancelar, setCitaACancelar] = useState(null);
    const [notificacionesPendientes, setNotificacionesPendientes] = useState(0);
    const [activeTab, setActiveTab] = useState('informacion');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const [loadingCitas, setLoadingCitas] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const { t, i18n } = useTranslation(['profile', 'notifications']);

    const [citas, setCitas] = useState([])
    const token = localStorage.getItem("token");
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [vehiculos, setVehiculos] = useState([]);
    const [loadingVehiculos, setLoadingVehiculos] = useState(false);
    const [formVehiculo, setFormVehiculo] = useState({
        matricula: '',
        marca: '',
        modelo: '',
        año: new Date().getFullYear()
    });
    const [notificaciones, setNotificaciones] = useState([]);
    const [loadingNotis, setLoadingNotis] = useState(false);

    const [cocheBuscado, setCocheBuscado] = useState([{}]);
    const [matricula, setMatricula] = useState('');
    const [open, setOpen] = useState(false)
    const dialogRef = useRef(null)
    const [modo, setModo] = useState(null);
    const { logout } = useContext(AuthContext)
    const [datos, setDatos] = useState({
        marca: '', modelo: '', anio: '', motor: '', combustible: '', matricula: ''
    });

    const [datosPdf, setDatosPdf] = useState(null)

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");
            // No hace falta el "if (!token)" aquí porque ProtectedRoute ya lo filtró fuera

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile/me`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserProfile(data);
                    console.log(data)
                } else {
                    // Si el servidor dice que el token no vale (expiró)
                    localStorage.removeItem("token");
                    navigate("/login");
                }
            } catch (error) {
                console.error("Error de red:", error);
            } finally {
                // CRUCIAL: Esto quita el mensaje de "Cargando..."
                setLoading(false);
            }
        };

        fetchUserData();
        traerCitas();
    }, [navigate]);

    const traerHistorial = async () => {
        const tokenSeguro = localStorage.getItem("token");

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/date`, {
                headers: { "Authorization": `Bearer ${tokenSeguro}` }
            });

            if (response.ok) {
                const data = await response.json();
                setCitas(data)
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    // Este Hook genera el documento y nos da una 'url'
    const [instance, updateInstance] = usePDF({
        document: datosPdf ? <InvoicePDF data={datosPdf} /> : <div />
    });

    // Cada vez que cambien los datos, actualizamos el PDF
    useEffect(() => {
        if (datosPdf) {
            updateInstance(<InvoicePDF data={datosPdf} />);
        }
    }, [datosPdf, updateInstance]);

    const handlePreview = () => {
        if (instance.url) {
            window.open(instance.url, '_blank');
        }
    };


    const traerProductos = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
            if (response.ok) {
                const data = await response.json();
                setProductos(data);
            }
        } catch (error) {
            console.error("Error al cargar productos:", error);
        }
    };

    const fetchNotificacionesCount = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/unread-count`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setNotificacionesPendientes(data.count);
            }
        } catch (error) {
            console.error("Error al obtener contador:", error);
        }
    };

    useEffect(() => {
        fetchNotificacionesCount();

        window.addEventListener('notificationsUpdated', fetchNotificacionesCount);

        return () => {
            window.removeEventListener('notificationsUpdated', fetchNotificacionesCount);
        };
    }, []);

    const traerNotificaciones = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        setLoadingNotis(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setNotificaciones(data);
                console.log(data)
            }
        } catch (error) {
            console.error("Error al cargar notificaciones:", error);
        } finally {
            setLoadingNotis(false);
        }
    };

    const marcarTodasComoLeidas = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/read-all`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept-language': i18n.language
                }

            });

            if (response.ok) {
                // CAMBIO: leido con "o" para coincidir con el objeto de la DB
                setNotificaciones(prev => prev.map(n => ({ ...n, leido: 1 })));
                window.dispatchEvent(new Event('notificationsUpdated'));
            }
        } catch (error) {
            console.error("Error al marcar todas:", error);
        }
    };

    const getStatusBadgeClass = (estado) => {
        switch (estado) {
            case 'pendiente':
                return 'badge-primary';

            case 'completada':
                return 'badge-success';
            case 'cancelada':
                return 'badge-error';
            default:
                return 'badge-warning';
        }
    };

    const marcarLeida = async (id) => {
        // CAMBIO: leido con "o"
        setNotificaciones(prev =>
            prev.map(n => n.id === id ? { ...n, leido: 1 } : n)
        );

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/${id}/read`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                window.dispatchEvent(new Event('notificationsUpdated'));
            }
        } catch (error) {
            console.error("Error al marcar como leída:", error);
        }
    };

    useEffect(() => {
        if (activeTab === 'notificaciones') {
            traerNotificaciones();
            traerProductos();
        }
    }, [activeTab]);

    const formatText = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    };




    useEffect(() => {
        const node = dialogRef.current; // Accedemos al elemento real del DOM
        if (!node) return;

        if (open) {
            node.showModal(); // Método nativo de HTML5
        } else {
            node.close();     // Método nativo de HTML5
        }
    }, [open])

    const enviarFormulario = async (e) => {
        e.preventDefault();
        console.log("Datos enviados:", datos);
        if (modo === 'manual') {

            try {
                console.log(datos);
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/vehicules`, {
                    method: 'POST',
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(datos)
                });


            } catch (err) {
                console.error("Error en la petición:", err);
                alert("No se pudo conectar con el servidor");
            }

        } else {
            buscarCoche(datos.matricula)
            console.log(datos.matricula)
        }

        // Opcional: Cerrar el modal después de la acción
        setOpen(false);
        // Aquí iría tu llamada a la API
    };


    const cocheUsuario = async () => {

        /* Toca hacer scraping */
        // Construimos la URL con los parámetros necesarios
        const url = `${import.meta.env.VITE_API_URL}/api/vehicules/`;

        try {
            const response = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error(`Error en la petición: ${response.status}`);
            }

            const data = await response.json(); // ¡No olvides convertir la respuesta a JSON!
            setCocheBuscado(await data)
            console.log(cocheBuscado)

        } catch (e) {
            console.error('Error capturado:', e.message);
        }
    }

    const buscarCoche = async (matricula) => {

        /* Toca hacer scraping */
        // Construimos la URL con los parámetros necesarios
        const url = `${import.meta.env.VITE_API_URL}/api/vehicules/matricula/secreta`;
        console.log('esta es la matricula' + matricula)
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ matricula })
            });

            if (!response.ok) {
                throw new Error(`Error en la petición: ${response.status}`);
            }


            cocheUsuario()
        } catch (error) {
            console.error("Error al cargar vehículos:", error);
        } finally {
            setLoadingVehiculos(false);
        }
    }



    useEffect(() => {
        const node = dialogRef.current; // Accedemos al elemento real del DOM
        if (!node) return;

        if (open) {
            node.showModal(); // Método nativo de HTML5
        } else {
            node.close();     // Método nativo de HTML5
        }
    }, [open])

    const manejarCambio = (e) => {
        setDatos({
            ...datos,
            [e.target.name]: e.target.value
        });
    };


    const traerCitas = async () => {

        const token = localStorage.getItem("token");
        if (!token) return;

        // 1. Intentar cargar desde sessionStorage primero
        const citasGuardadas = sessionStorage.getItem("misCitas");
        if (citasGuardadas) {
            setCitas(JSON.parse(citasGuardadas));
            setLoadingCitas(false);
            return;
        }

        setLoadingCitas(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/dates`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            if (response.ok) {
                const data = await response.json();
                setCitas(data);
                // 2. Guardar en sessionStorage para futuras visitas
                sessionStorage.setItem("misCitas", JSON.stringify(data));
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingCitas(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'citas') {
            traerCitas();
        }
        if (activeTab === 'vehiculos') {
            cocheUsuario()
        }
        if (activeTab === 'historial') {
            traerHistorial();
        }
    }, [activeTab]);

    const eliminarCitas = async (id) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/dates/${id}/cancelar`, {
                method: 'PATCH',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                // 1. Actualizar el estado local (React)
                const citasActualizadas = prevCitas =>
                    prevCitas.map(cita =>
                        cita.id === id ? { ...cita, estado: 'cancelada' } : cita
                    );

                setCitas(citasActualizadas);

                setCitas(prev => {
                    const newCitas = prev.map(c => c.id === id ? { ...c, estado: 'cancelada' } : c);
                    sessionStorage.setItem("misCitas", JSON.stringify(newCitas));
                    return newCitas;
                });

                alert(t('profile:cancel_success') || "Cita cancelada correctamente");
            } else {
                const errorData = await response.json();
                alert(errorData.error || "Error al cancelar la cita");
            }
        } catch (err) {
            console.error("Error en la petición:", err);
            alert("No se pudo conectar con el servidor");
        } finally {
            setCitaACancelar(null);
        }
    };

    const toggleLanguage = () => {
        const newLang = i18n.language === 'es' ? 'en' : 'es';
        i18n.changeLanguage(newLang);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("rol");
        sessionStorage.removeItem("misCitas");
        logout();
        navigate("/");

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        // Validamos con Zod
        const result = workshopSchema.safeParse(data);

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            setErrors(fieldErrors);
            return;
        }

        setErrors({});

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(result.data)
            });

            if (response.ok) {
                alert(t('profile:update_success') || " actualizado correctamente");
            } else {
                alert("Error al actualizar los datos");
            }
        } catch (error) {
            console.error("Error en el envío:", error);
        }
    };

    const campos = useMemo(() => [
        { name: "nombre", label: t('profile:name') || "Nombre / Taller", type: "text", value: userProfile?.nombre || "" },
        { name: "apellidos", label: t('profile:lastName') || "Apellidos", type: "text", value: userProfile?.apellidos || "" },
        { name: "direccion", label: t('profile:location') || "Dirección", type: "text", value: userProfile?.direccion || "" },
        { name: "isla", label: "isla", type: "text", value: userProfile?.isla || ""},
        { name: "municipio", label: "municipio", type: "text", value: userProfile?.municipio || ""},

    ], [userProfile, t]);

    const menuItems = useMemo(() => [
        { id: 'informacion', label: t('profile:account'), icon: User },
        { id: 'vehiculos', label: t('profile:myCars'), icon: Car },
        { id: 'notificaciones', label: t('profile:notifications_tab') || "Notificaciones", icon: Bell },
        { id: 'citas', label: t('profile:myAppointments'), icon: Calendar },
        { id: 'historial', label: t('profile:history'), icon: FileText },
        { id: 'seguridad', label: t('profile:security'), icon: Lock }
    ], [t]);

    const menuBtnStyle = (tab) => `
        w-full text-left px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-3
        ${activeTab === tab
            ? 'bg-base-100 text-primary font-semibold shadow-md'
            : 'text-base-content/70 hover:shadow-lg'}
    `;


    const descargarFactura = (cita) => {
        // Tomamos el precio base y el precio final de tu tabla 'dates' (imagen 1)
        const precioBase = parseFloat(cita.precio_estimado || 0);
        const precioFinal = parseFloat(cita.precio_final || 0);
        const diferencia = precioFinal - precioBase;

        const items = [{ desc: cita.servicio, qty: 1, price: precioBase }];

        if (diferencia > 0) {
            items.push({
                desc: `Cargo adicional: ${cita.justificacion_mecanico || 'Ajuste de taller'}`,
                qty: 1,
                price: diferencia
            });
        }

        setDatosPdf({
            id: cita.id,
            clientName: userProfile?.nombre || "Cliente",
            plate: cita.vehiculo_seleccionado,
            items: items,
            fecha: cita.fecha_cita
        });
    };

    const renderContent = () => {
        if (loading) return <div className="py-20 text-center font-bold">{t('profile:loadingProfileData')}</div>;
        switch (activeTab) {
            case 'informacion':
                return (
                    <div>
                        {/* Encabezado con Estilo de Perfil */}
                        <div className="flex flex-col md:flex-row items-center gap-6 mb-10 pb-8 border-b border-secondary-content">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-4xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                    <User size={40} strokeWidth={1.5} />
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-success rounded-full border-4 border-base-100 flex items-center justify-center" title="Cuenta Activa">
                                    <Check size={14} className="text-white" />
                                </div>
                            </div>

                            <div className="text-center md:text-left">
                                <h2 className="text-3xl mb-2 font-black text-base-content tracking-tight">
                                    {userProfile?.nombre || t('profile:profileInfo')}
                                </h2>
                                <p className="flex items-center justify-center md:justify-start gap-2 mt-1">
                                    <span className="badge py-3 px-4 rounded-lg font-bold uppercase tracking-wider text-accent text-[10px]">
                                        {t('profile:updateProfileData')}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Formulario Estilizado como Tarjeta */}
                        <form onSubmit={handleSubmit} className="bg-base-300 p-8 rounded-[2.5rem] border border-base-300 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
                                {campos.map((field) => (
                                    <div
                                        key={field.name}
                                        className={`form-control w-full ${field.name === 'direccion' || field.name === 'calle' ? 'md:col-span-2' : ''
                                            }`}
                                    >
                                        <label className="label">
                                            <span className="label-text text-xs font-black uppercase text-base-content">
                                                {field.label}
                                            </span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                name={field.name}
                                                type={field.type}
                                                defaultValue={field.value}
                                                placeholder={`Escribe tu ${field.label.toLowerCase()}...`}
                                                className={`input input-bordered w-full h-12 rounded-2xl bg-base-100 transition-all duration-300 text-neutral font-medium
                                ${errors[field.name]
                                                        ? 'border-error ring-2 ring-error/10'
                                                        : 'border-base-300 focus:border-primary focus:ring-4 focus:ring-primary/5'}`}
                                            />
                                            {errors[field.name] && (
                                                <div className="flex items-center gap-1 mt-2 ml-1 text-error">
                                                    <span className="text-[10px] font-bold uppercase">{errors[field.name][0]}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {/* Renderizado Condicional de Isla y Municipio */}
                                {(!userProfile?.isla || !userProfile?.municipio) ? (
                                    <div className="md:col-span-2 pt-6 border-t border-base-300/50">
                                        <h3 className="text-sm font-bold text-base-content mb-4 uppercase tracking-widest italic opacity-70">
                                            {t('profile:completeLocation') || "Completa tu ubicación en Canarias"}
                                        </h3>
                                        <div className="bg-base-100 p-4 rounded-2xl border border-base-300 shadow-inner">
                                            <SelectorCanarias />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {/* Si ya existen, se muestran como 2 inputs finales para completar el 2-1-2 */}
                                        <div className="form-control w-full">
                                            <label className="label"><span className="label-text text-xs font-black uppercase">Isla</span></label>
                                            <input disabled value={userProfile.isla} className="input input-bordered w-full h-12 rounded-2xl bg-base-200 opacity-60" />
                                        </div>
                                        <div className="form-control w-full">
                                            <label className="label"><span className="label-text text-xs font-black uppercase">Municipio</span></label>
                                            <input disabled value={userProfile.municipio} className="input input-bordered w-full h-12 rounded-2xl bg-base-200 opacity-60" />
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Botón de Acción Principal */}
                            <div className="flex justify-end mt-10">
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-lg h-16 px-10 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all gap-3 border-none text-white"
                                >
                                    <Save size={20} />
                                    <span className="font-bold tracking-wide">
                                        {t('profile:saveChanges')}
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                );
            case 'vehiculos':
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-accent flex items-center gap-3">
                                    <Car className="text-primary" size={32} />
                                    {t('profile:myCars') || "Mis Vehículos"}
                                </h2>
                                <p className="text-base-content/60 mt-1">
                                    {t('profile:manageVehiclesDesc') || "Gestiona los vehículos asociados a tu cuenta para tus citas."}
                                </p>
                            </div>

                            <button
                                onClick={() => setOpen(true)}
                                className="btn btn-primary shadow-lg shadow-primary/20 gap-2 rounded-xl text-base-100"
                            >
                                <Plus size={20} />
                                {t('profile:addVehicle') || "Añadir Vehículo"}
                            </button>
                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:w-170 sm:grid-cols-1 lg:w-205 place-self-center-safe">
                            {cocheBuscado && cocheBuscado.length > 0 ? (
                                cocheBuscado.map((coche) => (
                                    <div key={coche.matricula} className="p-8 bg-base-300 border border-base-300 rounded-[2.5rem] w-100 relative">

                                        <div key={coche.matricula} className="flex mb-6">
                                            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center shadow-sm">
                                                <Car className="text-[#ff5a1f]" size={26} />
                                            </div>
                                            <div className='w-full'>
                                                <h2 className="text-xl font-black text-accent leading-tight uppercase">
                                                    {coche.marca}{" "}
                                                    <span className="text-[#ff5a1f]">{coche.modelo}</span>

                                                </h2>
                                                <p className="text-xs font-bold tracking-[0.2em] text-base-content/40 mt-1">
                                                    {coche.matricula}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 py-4 border-y border-base-200">
                                            <div className="flex flex-col items-center gap-1">
                                                <Settings size={16} className="text-base-content/30" />
                                                <span className="text-[10px] font-bold uppercase text-base-content/40">Motor</span>
                                                <span className="text-xs font-bold">{coche.motor}</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-1 border-x border-base-200">
                                                <Zap size={16} className="text-base-content/30" />
                                                <span className="text-[10px] font-bold uppercase text-base-content/40">Combustible</span>
                                                <span className="text-xs font-bold">{coche.combustible}</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-1">
                                                <Calendar size={16} className="text-base-content/30" />
                                                <span className="text-[10px] font-bold uppercase text-base-content/40">Año</span>
                                                <span className="text-xs font-bold">{coche.año}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))

                            ) : (
                                <div className="col-span-full bg-base-200/30 border-2 border-dashed border-base-300 rounded-[2.5rem] p-12 text-center">
                                    <div className="bg-base-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                        <Car size={32} className="text-base-content/20" />
                                    </div>
                                    <h3 className="text-xl font-bold text-base-content">Tu garaje está vacío</h3>
                                    <p className="text-base-content/50 max-w-xs mx-auto mt-2">
                                        Añade tu primer vehículo para poder solicitar servicios y reparaciones.
                                    </p>
                                    <button
                                        onClick={() => setOpen(true)}
                                        className="btn btn-primary mt-6 rounded-xl"
                                    >
                                        Registrar mi primer coche
                                    </button>
                                </div>
                            )}




                        </div>

                        {/* MODAL ESTILIZADO */}
                        {open && (
                            <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                                <div className="bg-info w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden relative border border-base-300 animate-in zoom-in duration-300">

                                    <button
                                        onClick={() => { setOpen(false); setModo(null); }}
                                        className="absolute top-8 right-8 text-base-content/30 hover:text-accent transition-colors z-10"
                                    >
                                        <X size={28} />
                                    </button>

                                    <div className="p-10">
                                        {!modo ? (
                                            /* PASO 1: Selección de modo con estilo nuevo */
                                            <div className="py-4 text-center">
                                                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm mx-auto">
                                                    <Car className="text-[#ff5a1f]" size={32} />
                                                </div>
                                                <h3 className="text-2xl font-black mb-8 leading-tight">¿Cómo quieres añadir tu vehículo?</h3>
                                                <div className="flex flex-col gap-4">
                                                    <button
                                                        onClick={() => setModo('manual')}
                                                        className="group flex items-center gap-4 p-5 rounded-2xl border border-base-300 hover:border-[#ff5a1f] hover:bg-orange-50/50 transition-all text-left"
                                                    >
                                                        <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">📝</span>
                                                        <div>
                                                            <p className="font-bold text-base-content">Entrada Manual</p>
                                                            <p className="text-xs text-base-content/50">Introduce todos los datos</p>
                                                        </div>
                                                    </button>

                                                    <button
                                                        onClick={() => setModo('automatico')}
                                                        className="group flex items-center gap-4 p-5 rounded-2xl border border-base-300 hover:border-[#ff5a1f] hover:bg-orange-50/50 transition-all text-left"
                                                    >
                                                        <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">🤖</span>
                                                        <div>
                                                            <p className="font-bold text-base-content">Automático</p>
                                                            <p className="text-xs text-base-content/50">Solo con tu matrícula</p>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            /* PASO 2: El formulario estilizado */
                                            <>
                                                <div className="flex flex-col items-center mb-8">
                                                    <button
                                                        onClick={() => setModo(null)}
                                                        className="text-[10px] font-bold uppercase tracking-widest text-[#ff5a1f] mb-2 hover:underline"
                                                    >
                                                        ← Volver atrás
                                                    </button>
                                                    <h2 className="text-2xl font-black text-center text-accent leading-tight">
                                                        {modo === 'manual' ? 'Registrar Vehículo' : 'Búsqueda Rápida'}
                                                    </h2>
                                                </div>

                                                <form onSubmit={enviarFormulario} className="space-y-5">
                                                    {/* Input Matrícula Principal */}
                                                    <div>
                                                        <label className="text-[10px] font-bold uppercase tracking-widest text-base-content/40 ml-1 mb-1 block">Matrícula</label>
                                                        <input
                                                            required
                                                            className="w-full px-5 py-4 rounded-2xl border border-base-300 bg-base-200/30 focus:border-[#ff5a1f] focus:ring-1 focus:ring-[#ff5a1f] outline-none transition-all uppercase tracking-widest font-bold"
                                                            placeholder="1234BBB"
                                                            value={datos.matricula}
                                                            name="matricula"
                                                            onChange={manejarCambio}

                                                        />
                                                    </div>

                                                    {modo === 'manual' && (
                                                        <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-bottom-4 duration-500">
                                                            {/* MARCA */}
                                                            <div className="col-span-1">
                                                                <label className="text-[10px] font-bold uppercase tracking-widest text-base-content/40 ml-1 mb-1 block">Marca</label>
                                                                <input
                                                                    className="w-full px-5 py-4 rounded-2xl border border-base-300 bg-base-200/30 focus:border-[#ff5a1f] outline-none transition-all"
                                                                    value={datos.marca}
                                                                    name="marca"
                                                                    placeholder="Ej: Seat"
                                                                    onChange={manejarCambio}
                                                                />
                                                            </div>

                                                            {/* MODELO */}
                                                            <div className="col-span-1">
                                                                <label className="text-[10px] font-bold uppercase tracking-widest text-base-content/40 ml-1 mb-1 block">Modelo</label>
                                                                <input
                                                                    className="w-full px-5 py-4 rounded-2xl border border-base-300 bg-base-200/30 focus:border-[#ff5a1f] outline-none transition-all"
                                                                    value={datos.modelo}
                                                                    name="modelo"
                                                                    placeholder="Ej: Ibiza"
                                                                    onChange={manejarCambio}
                                                                />
                                                            </div>

                                                            {/* AÑO */}
                                                            <div className="col-span-1">
                                                                <label className="text-[10px] font-bold uppercase tracking-widest text-base-content/40 ml-1 mb-1 block">Año</label>
                                                                <input
                                                                    type="number"
                                                                    placeholder='2020'
                                                                    className="w-full px-5 py-4 rounded-2xl border border-base-300 bg-base-200/30 focus:border-[#ff5a1f] outline-none transition-all"
                                                                    value={datos.anio}
                                                                    name="anio"
                                                                    onChange={manejarCambio}
                                                                />
                                                            </div>

                                                            {/* MOTORIZACIÓN (Potencia/Cilindrada) */}
                                                            <div className="col-span-1">
                                                                <label className="text-[10px] font-bold uppercase tracking-widest text-base-content/40 ml-1 mb-1 block">Motor (CV/cc)</label>
                                                                <input
                                                                    placeholder="Ej: 1.8"
                                                                    className="w-full px-5 py-4 rounded-2xl border border-base-300 bg-base-200/30 focus:border-[#ff5a1f] outline-none transition-all"
                                                                    value={datos.motor}
                                                                    name="motor"
                                                                    onChange={manejarCambio}
                                                                />
                                                            </div>

                                                            {/* COMBUSTIBLE (Selector) */}
                                                            <div className="col-span-2">
                                                                <label className="text-[10px] font-bold uppercase tracking-widest text-base-content/40 ml-1 mb-1 block">Tipo de Combustible</label>
                                                                <select
                                                                    name="combustible"
                                                                    className="w-full px-5 py-4 rounded-2xl border  border-base-300 bg-info focus:border-[#ff5a1f] outline-none transition-all appearance-none cursor-pointer"
                                                                    value={datos.combustible}
                                                                    onChange={manejarCambio}
                                                                >
                                                                    <option value="">Seleccionar combustible...</option>
                                                                    <option value="gasolina">Gasolina</option>
                                                                    <option value="diesel">Diesel</option>
                                                                    <option value="electrico">Eléctrico</option>
                                                                    <option value="hibrido">Híbrido</option>
                                                                    <option value="glp">GLP</option>
                                                                    <option value="gnc">GNC</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <button
                                                        type="submit"
                                                        className="w-full bg-primary hover:bg-primary text-white font-black py-5 rounded-2xl mt-6 shadow-xl shadow-orange-200/50 transition-all active:scale-[0.97] uppercase tracking-widest text-sm"
                                                    >
                                                        {modo === 'manual' ? 'Confirmar Registro' : 'Consultar Matrícula'}
                                                    </button>
                                                </form>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'citas':
                return (
                    <div>
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold mb-2 text-base-content">{t('profile:myAppointments')}</h2>
                            <p className="text-base-content/70 text-sm">{t('profile:manageActiveAppointments')}</p>
                        </div>

                        <div className="space-y-4">
                            {loadingCitas ? (
                                <div className="py-10 text-center flex flex-col items-center gap-3">
                                    <span className="loading loading-spinner loading-lg text-primary"></span>
                                    <p className="font-bold">Cargando tus citas...</p>
                                </div>
                            ) : citas.length > 0 ? (
                                citas.map(citas => (
                                    <div className="p-6 border  bg-base-100 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4" key={citas.id}>
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                                <Calendar size={28} />
                                            </div>
                                            <div>
                                                <h4 className="font-extrabold text-lg text-accent uppercase tracking-tight">{citas.servicio}</h4>
                                                <p className="text-sm text-base-content/60 font-medium">{citas.vahiculo_selecionado}</p>
                                                <div className="flex items-center gap-2 mt-1 font-bold text-accent text-xs">
                                                    <Clock size={14} />
                                                    <span className='text-accent'>{citas.fecha_cita}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {citas.estado === 'pendiente' && (
                                            <button
                                                className="btn btn-ghost btn-sm text-error hover:bg-error/10"
                                                onClick={() => {
                                                    setCitaACancelar(citas.id);
                                                    document.getElementById('modal_confirmar_cancelacion').showModal();
                                                }}
                                            >
                                                {t('profile:cancel')}
                                            </button>
                                        )}

                                        <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-t-0 pt-3 md:pt-0">
                                            <span className={`badge badge-outline ${getStatusBadgeClass(citas.estado)} badge-md font-bold py-3 px-4 uppercase text-[10px]`}>
                                                {citas.estado}
                                            </span>

                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center py-10">No tienes citas programadas.</p>
                            )}




                        </div>
                    </div>
                );
            case 'notificaciones':

                const tn = (key, params) => t(`notifications:${key}`, params);

                return (
                    <div className="animate-in fade-in duration-500">
                        <div className="mb-8 flex justify-between items-end">
                            <div>
                                <h2 className="text-3xl font-bold mb-2 text-base-content">
                                    {t('profile:notifications_title') || "Mis Notificaciones"}
                                </h2>
                                <p className="text-base-content/70 text-sm">
                                    {t('profile:manage_notifications_desc') || "Mantente al tanto de tus citas y pedidos."}
                                </p>
                            </div>

                            {/* Botón de marcar todas: Solo aparece si hay alguna sin leer (leido == 0) */}
                            {notificaciones.length > 0 && notificaciones.some(n => !n.leido) && (
                                <button
                                    onClick={marcarTodasComoLeidas}
                                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1 transition-all"
                                >
                                    <CheckCheck size={14} /> Marcar todas como leídas
                                </button>
                            )}
                        </div>

                        <div className="space-y-4">
                            {loadingNotis ? (
                                <div className="py-10 text-center flex flex-col items-center gap-3">
                                    <span className="loading loading-spinner loading-lg text-primary"></span>
                                    <p className="font-bold italic opacity-70 text-sm">Cargando historial...</p>
                                </div>
                            ) : notificaciones.length > 0 ? (
                                notificaciones.map((noti) => {
                                    const params = typeof noti.parametros === 'string'
                                        ? JSON.parse(noti.parametros)
                                        : noti.parametros;

                                    let extraParams = { ...params };

                                    if (params.producto_id) {
                                        const producto = productos?.find(p => p.id === params.producto_id);
                                        extraParams.producto = producto?.name || 'producto';
                                    }

                                    const translationPath = `notifications.${noti.rol}`;
                                    const estaLeida = !!noti.leido;


                                    return (
                                        <div
                                            key={noti.id}
                                            // Mantenemos siempre bg-base-100 y eliminamos opacity-80
                                            className={`p-6 border rounded-2xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 bg-base-300
                ${estaLeida
                                                    ? 'border-base-200 shadow-none'
                                                    : 'border-primary/20 shadow-md ring-1 ring-primary/5'}`}
                                        >
                                            <div className="flex items-center gap-5">
                                                {/* CHECKBOX: Cambia de color según estado */}
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        className={`checkbox checkbox-sm transition-all ${estaLeida ? 'checkbox-success' : 'checkbox-primary'}`}
                                                        checked={estaLeida}
                                                        onChange={() => !estaLeida && marcarLeida(noti.id)}
                                                        disabled={estaLeida}
                                                    />
                                                </div>

                                                {/* ICONO CAMPANA: Mantenemos el color aunque esté leída para que no se "apague" */}
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors
                    ${estaLeida ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>
                                                    <Bell size={24} />
                                                </div>

                                                {/* CONTENIDO DE TEXTO: Eliminamos las clases que bajaban la opacidad al 40% */}
                                                <div>
                                                    <h4 className="font-extrabold text-lg tracking-tight text-base-content">
                                                        {tn(`${translationPath}.titles.${noti.tipo}`)}
                                                    </h4>
                                                    <p className="text-sm font-medium max-w-xl text-base-content/70">
                                                        {tn(`${translationPath}.messages.${noti.tipo}`, extraParams)}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-2 font-bold text-[10px] text-base-content/30 uppercase tracking-widest">
                                                        <Clock size={12} />
                                                        <span>{new Date(noti.creado_en).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* BADGE DE ESTADO */}
                                            <div className="hidden md:flex items-center">
                                                {estaLeida ? (
                                                    <div className="flex items-center gap-1 text-success opacity-80">
                                                        <span className="text-[10px] font-black uppercase tracking-tighter">Leída</span>
                                                        <Check size={14} strokeWidth={3} />
                                                    </div>
                                                ) : (
                                                    <span className="badge badge-primary badge-sm py-3 px-4 font-bold border-none shadow-sm animate-pulse">
                                                        Nueva
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                // ESTADO VACÍO
                                <div className="bg-base-200/30 border-2 border-dashed border-base-300 rounded-[2.5rem] p-16 text-center">
                                    <div className="w-16 h-16 bg-base-300/50 rounded-full flex items-center justify-center mx-auto mb-4 opacity-40">
                                        <Bell size={32} />
                                    </div>
                                    <p className="text-base-content/40 text-lg font-bold italic">
                                        Tu bandeja de entrada está limpia.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'historial':
                return (
                    <div className="animate-in fade-in duration-500">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold mb-2 text-base-content">{t('profile:history')}</h2>
                            <p className="text-base-content/70 text-sm">{t('profile:pastServicesHistory')}</p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="table w-full border-separate border-spacing-y-2">
                                <thead>
                                    <tr className="text-base-content/50 text-[10px] uppercase tracking-widest">
                                        <th className="bg-transparent">Servicio</th>
                                        <th className="bg-transparent">Fecha</th>
                                        <th className="bg-transparent">Vehículo</th>
                                        <th className="bg-transparent">Estado</th>
                                        <th className="bg-transparent text-right">Documentos</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {citas.filter(c => c.estado === 'completada').length > 0 ? (
                                        citas.filter(c => c.estado === 'completada').map((cita) => (
                                            <tr key={cita.id} className="bg-base-300 transition-colors rounded-xl">
                                                <td className="font-bold rounded-l-xl">{cita.servicio}</td>
                                                <td className="text-sm">{new Date(cita.fecha_cita).toLocaleDateString()}</td>
                                                <td className="text-xs">{cita.vehiculo_seleccionado}</td>
                                                <td>
                                                    <div className="badge badge-success badge-outline font-bold text-[10px] uppercase">
                                                        {cita.estado}
                                                    </div>
                                                </td>
                                                <td className="text-right rounded-r-xl">
                                                    <div className="flex justify-end gap-3 items-center">
                                                        {/* Paso 1: Generar los datos */}
                                                        <button
                                                            onClick={() => descargarFactura(cita)}
                                                            className={`btn btn-ghost btn-xs underline ${datosPdf?.id === cita.id ? 'text-success hidden' : 'text-primary'}`}
                                                        >
                                                            {datosPdf?.id === cita.id ? '✓ Datos listos' : 'Generar Factura'}
                                                        </button>

                                                        {/* Paso 2: Acciones cuando el PDF está listo */}
                                                        {datosPdf?.id === cita.id && instance.url && (
                                                            <div className="flex gap-2 animate-in zoom-in duration-300">
                                                                {/* BOTÓN PARA VISUALIZAR */}
                                                                <button
                                                                    onClick={() => window.open(instance.url, '_blank')}
                                                                    className="btn h-full btn-primary btn-xs text-base-100 items-center "
                                                                    title="Visualizar PDF"
                                                                >
                                                                    Ver
                                                                </button>

                                                                {/* BOTÓN PARA DESCARGAR */}
                                                                <a
                                                                    href={instance.url}
                                                                    download={`Factura_${cita.id}.pdf`}
                                                                    className="btn h-full btn-primary btn-xs text-base-100 items-center"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M7.5 12 12 16.5m0 0L16.5 12M12 16.5V3" />
                                                                    </svg>
                                                                    Descargar
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="5" className="text-center py-10 opacity-50">No hay citas completadas.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'seguridad':
                return (
                    <div className='justify-self-center-safe'>
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold mb-2 text-base-content">{t('profile:security')}</h2>
                            <p className="text-base-content/70 text-sm">{t('profile:updatePasswordInfo')}</p>
                        </div>

                        <div className="max-w-md space-y-6">
                            <div className="form-control w-full">
                                <label className="label uppercase text-[10px] font-bold text-base-content/60">{t('profile:currentPassword')}</label>
                                <input type="password" placeholder="••••••••" className="input input-bordered focus:input-primary w-full bg-base-100" />
                            </div>
                            <div className="form-control w-full">
                                <label className="label uppercase text-[10px] font-bold text-base-content/60">{t('profile:newPassword')}</label>
                                <input type="password" placeholder="••••••••" className="input input-bordered focus:input-primary w-full bg-base-100" />
                            </div>
                            <button className="btn bg-primary text-base-100 border-0 shadow-lg shadow-primary/20 gap-2">
                                <Lock size={18} />
                                {t('profile:updatePassword')}
                            </button>
                        </div>
                    </div>
                );
            // Otros casos (citas, historial, password) omitidos por brevedad pero se mantienen igual que en tu lógica original
            default:
                return <p className="text-base-content/50">Selecciona una opción del menú.</p>;
        }
    }

    return (
        <div className='bg-base-300 min-h-screen flex flex-col'>
            <Header />

            <div className="lg:hidden bg-base-100 border-b border-base-300 p-4">
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="flex items-center gap-2 text-accent font-semibold"
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    <span>{t('profile:menu')}</span>
                </button>
            </div>

            <main className='flex-1 p-4 md:p-6 lg:p-8'>
                <div className='flex flex-col lg:flex-row max-w-7xl mx-auto gap-6'>
                    <aside className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:flex flex-col bg-info w-full lg:w-72 flex-none p-6 rounded-2xl shadow-xl`}>
                        <div className="mb-10 hidden lg:block">
                            <h1 className='text-3xl font-black text-base-content tracking-tight'>AKOTAN</h1>
                        </div>
                        <nav className='space-y-2 flex-1'>
                            {menuItems.map(item => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        className={menuBtnStyle(item.id)}
                                        onClick={() => {
                                            setActiveTab(item.id);
                                            setMobileMenuOpen(false);
                                        }}
                                    >
                                        <Icon size={20} />
                                        <span>{item.label}</span>

                                        {/* 👇 AÑADE ESTO */}
                                        {item.id === 'notificaciones' && notificacionesPendientes > 0 && (
                                            <span className="ml-auto badge badge-error badge-sm">
                                                {notificacionesPendientes}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </nav>
                        <div className="mt-4 border-t border-base-300 space-y-1">
                            <AdminButton />
                            <button onClick={toggleLanguage} className='w-full text-left px-4 py-3 text-xs font-bold uppercase text-base-content/50 hover:text-primary flex items-center gap-3'>
                                <span className="text-lg">🌐</span>
                                <span>{i18n.language === 'es' ? 'English (EN)' : 'Español (ES)'}</span>
                            </button>
                            <button onClick={handleLogout} className='w-full text-left px-4 py-3 text-error/70 hover:bg-error/10 rounded-xl flex items-center gap-3 transition-all'>
                                <LogOut size={20} />
                                <span>{t('profile:logout')}</span>
                            </button>
                        </div>
                    </aside>

                    <section className='bg-info flex-1 p-6 md:p-8 lg:p-10 w-220 rounded-2xl shadow-lg max-h-155 overflow-y-auto custom-scrollbar'>
                        {renderContent()}
                    </section>
                </div>
                {/* Modal de Confirmación de Cancelación */}
                <dialog id="modal_confirmar_cancelacion" className="modal modal-bottom sm:modal-middle backdrop-blur-sm">
                    <div className="modal-box bg-base-100 rounded-2xl shadow-2xl border border-base-200">
                        <div className="flex flex-col items-center text-center gap-4 py-4">
                            <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center">
                                <X size={40} />
                            </div>
                            <div>
                                <h3 className="font-black text-2xl text-base-content">{t('profile:cancel_appointment_title') || "¿Cancelar cita?"}</h3>
                                <p className="text-base-content/60 mt-2 font-medium">
                                    {t('profile:cancel_warning') || "Esta acción no se puede deshacer. Perderás tu turno en el taller."}
                                </p>
                            </div>
                        </div>
                        <div className="modal-action grid grid-cols-2 gap-3">
                            <button
                                className="btn btn-ghost font-bold"
                                onClick={() => document.getElementById('modal_confirmar_cancelacion').close()}
                            >
                                {t('profile:keep_appointment') || "No, mantener"}
                            </button>
                            <button
                                className="btn btn-error font-bold text-white shadow-lg shadow-error/20"
                                onClick={() => {
                                    if (citaACancelar) {
                                        eliminarCitas(citaACancelar);
                                        document.getElementById('modal_confirmar_cancelacion').close();
                                    }
                                }}
                            >
                                {t('profile:confirm_cancel_btn') || "Sí, cancelar"}
                            </button>
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>
            </main>
            <Footer />

        </div>
    );
}

export default Perfil;