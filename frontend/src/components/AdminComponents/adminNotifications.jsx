import React, { useState, useEffect } from 'react';
import { Bell, Clock, Check, CheckCheck, Package, AlertTriangle, Info, Wrench, ShoppingCart, CalendarCheck } from 'lucide-react';
import { useTranslation } from "react-i18next";

const AdminNotifications = () => {
    const { t, i18n } = useTranslation(["admin", "notifications"]);
    const [notificaciones, setNotificaciones] = useState([]);
    const [loading, setLoading] = useState(true);

    const tt = (rol, tipo) => t(`notifications:notifications.${rol}.titles.${tipo}`);
    const tn = (rol, tipo, params) => t(`notifications:notifications.${rol}.messages.${tipo}`, params);


    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/admin`, {
                headers: {
                    'accept-language': i18n.language,
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error("Error en la respuesta del servidor");

            const data = await response.json();
            setNotificaciones(data);
        } catch (error) {
            console.error("Error cargando notificaciones de admin:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchNotifications(); }, [i18n.language]);

    const marcarLeida = async (id) => {
        try {
            await fetch(`/api/notifications/${id}/read`, { method: 'PUT' });
            setNotificaciones(prev => prev.map(n => n.id === id ? { ...n, leido: 1 } : n));
        } catch (error) {
            console.error("Error al marcar como leída");
        }
    };

    const marcarTodasComoLeidas = async () => {
        try {
            await fetch('/api/notifications/read-all', { method: 'PUT' });
            setNotificaciones(prev => prev.map(n => ({ ...n, leido: 1 })));
        } catch (error) {
            console.error("Error al marcar todas");
        }
    };

    if (loading) return (
        <div className="py-20 text-center flex flex-col items-center gap-3">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="font-bold italic opacity-70">Cargando panel de control...</p>
        </div>
    );

    return (
        <div className="animate-in fade-in duration-500">
            {/* CABECERA */}
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
                        <Bell className="text-primary" size={32} />
                        {t("notificaciones.centro_de_control")}
                    </h2>
                    <p className="text-base-content/50 text-sm font-medium">
                        {t("notificaciones.alertas")}.
                    </p>
                </div>

                {notificaciones.some(n => !n.leido) && (
                    <button
                        onClick={marcarTodasComoLeidas}
                        className="btn btn-ghost btn-sm text-primary font-black hover:bg-primary/10 rounded-xl transition-all gap-2"
                    >
                        <CheckCheck size={16} /> {t("notificaciones.marcar_leido")}
                    </button>
                )}
            </div>

            {/* LISTADO */}
            <div className="space-y-4">
                {notificaciones.length > 0 ? (
                    notificaciones.map((noti) => {
                        const params = typeof noti.parametros === 'string' ? JSON.parse(noti.parametros) : noti.parametros;
                        const estaLeida = !!noti.leido;

                        // Icono dinámico según el tipo de acción
                        const getIcon = () => {
                            if (noti.tipo.includes('producto')) return <Package size={24} />;
                            if (noti.tipo.includes('servicio')) return <Wrench size={24} />;
                            if (noti.tipo.includes('venta') || noti.tipo.includes('compra')) return <ShoppingCart size={24} />;
                            if (noti.tipo.includes('cita')) return <CalendarCheck size={24} />;
                            return <AlertTriangle size={24} />;
                        };

                        return (
                            <div
                                key={noti.id}
                                className={`group p-6 border rounded-4xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 bg-base-100
                                ${estaLeida ? 'border-base-200 opacity-70' : 'border-primary/20 shadow-xl shadow-primary/5 ring-1 ring-primary/5'}`}
                            >
                                <div className="flex items-center gap-5">
                                    {/* Indicador de lectura */}
                                    <div
                                        onClick={() => !estaLeida && marcarLeida(noti.id)}
                                        className={`w-4 h-4 rounded-full border-2 cursor-pointer transition-all ${estaLeida ? 'bg-success border-success' : 'bg-transparent border-primary animate-pulse'}`}
                                    />

                                    {/* Icono de Acción */}
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all shadow-inner
                                        ${estaLeida ? 'bg-base-200 text-base-content/30' : 'bg-primary text-white rotate-3 group-hover:rotate-0'}`}>
                                        {getIcon()}
                                    </div>

                                    {/* Texto */}
                                    <div>
                                        <h4 className={`font-black text-lg tracking-tight ${estaLeida ? 'text-base-content/50' : 'text-base-content'}`}>
                                            {tt(noti.rol, noti.tipo)}
                                        </h4>
                                        <p className="text-sm font-medium text-base-content/60 max-w-2xl">
                                            {/* Aquí inyectamos el nombre del producto que viene del JOIN o de los parámetros */}
                                            {tn(noti.rol, noti.tipo, {
                                                ...params,
                                                producto: noti.producto_nombre || params.producto || params.nombre_original
                                            })}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2 font-bold text-[10px] text-base-content/30 uppercase tracking-widest">
                                            <Clock size={12} />
                                            <span>{new Date(noti.creado_en).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Botón Acción Rápida */}
                                {!estaLeida && (
                                    <button
                                        onClick={() => marcarLeida(noti.id)}
                                        className="btn btn-circle btn-ghost btn-sm text-base-content/20 hover:text-success"
                                    >
                                        <Check size={20} />
                                    </button>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="bg-base-200/30 border-2 border-dashed border-base-300 rounded-[3rem] py-24 text-center">
                        <Bell size={48} className="mx-auto mb-4 opacity-10" />
                        <p className="text-base-content/40 text-lg font-black italic">{t("notificaciones.nada")}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminNotifications;