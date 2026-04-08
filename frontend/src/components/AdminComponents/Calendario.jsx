import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import "./calendario.css";



// --- TOOLTIP (DERECHA) ---
const EventTooltip = ({ info, position }) => {
  if (!info) return null;
  const { title, start } = info;
  const descripcion = info.extendedProps?.descripcion || 'Sin descripción adicional';
  const hora = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const vehiculo = info.extendedProps?.vehiculo || 'No hay vehiculo';



  return (
    <div
      className="absolute z-9999 p-4 bg-info text-base-content border border-gray-200 rounded-lg shadow-xl pointer-events-none w-72"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(15px, -50%)',
      }}
    >
      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-base-300 border-l border-b text-base-content+ rotate-45"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          <h3 className="text-lg font-bold leading-tight">{title}</h3>
        </div>
        <p className="text-sm mb-1 font-medium italic">{vehiculo}</p>
        <div className="bg-gray-50 p-2.5 rounded border border-gray-100">
          <p className="text-xs text-gray-500">{descripcion}</p>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
const CalendarioSemanalTailwind = ({ initialEvents }) => {
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingChange, setPendingChange] = useState(null);
  const [nuevoPrecio, setNuevoPrecio] = useState(80);
  const [justificacion, setJustificacion] = useState("");
  const [selectedEventId, setSelectedEventId] = useState(null);

  let cuerpo = {
    precio: nuevoPrecio,
    justificacion: justificacion
  };

  const servicioTerminado = async (id, estado) => {
    const token = localStorage.getItem("token");
    if (!token) return;





    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/dates/actualizar/${id}/${estado}`, {
        method: 'PATCH',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        // ENVIAMOS LOS DATOS DEL MODAL AL BACKEND
        body: JSON.stringify(cuerpo)
      });

      if (response.ok) {
        // Si usas un estado de "reservas" para los eventos:
        // setReservas(prev => prev.filter(res => res.id !== id));

        setModalConfirmar(false); // Cerramos el modal
        alert("Servicio finalizado correctamente");

        // Opcional: recargar calendario
        // window.location.reload(); 
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Error al actualizar");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleEventDrop = (info) => {
    setPendingChange(info);
    setShowConfirm(true);
  };

  const [modalConfirmar, setModalConfirmar] = useState(false)

  const handleEventClick = (info) => {
    setSelectedEventId(info.event.id); // Guardamos el ID del evento de FullCalendar
    setModalConfirmar(true);
  };

  const confirmChange = async () => {
    const { event } = pendingChange;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/dates/${event.id}/update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ fechaCita: event.startStr })
      });
      if (!res.ok) pendingChange.revert();
    } catch {
      pendingChange.revert();
    }
    setShowConfirm(false);
    setPendingChange(null);
  };

  const cancelChange = () => {
    pendingChange.revert();
    setShowConfirm(false);
    setPendingChange(null);
  };

  // Formateo de fecha para el Modal
  const getNuevaFechaInfo = () => {
    if (!pendingChange) return null;
    const date = pendingChange.event.start;
    return {
      dia: date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }),
      hora: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="mt-6 bg-base-100 border-neutral rounded-2xl relative">
      <div className="max-w-6xl mx-auto bg-base-300 p-6 rounded-xl shadow-lg">
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          locale={esLocale}
          events={initialEvents}
          editable={true}
          slotMinTime="08:00:00"
          slotMaxTime="18:00:00"
          allDaySlot={false}
          height="525px"
          eventDrop={handleEventDrop}
          eventResize={handleEventDrop}
          eventClick={handleEventClick}
          eventMouseEnter={(info) => {
            const rect = info.el.getBoundingClientRect();
            setHoveredEvent(info.event);
            setTooltipPosition({ x: rect.right + window.scrollX, y: rect.top + (rect.height / 2) + window.scrollY });
          }}
          eventMouseLeave={() => setHoveredEvent(null)}
        />
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-10000 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-slate-100 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
              <AlertCircle className="text-orange-500" /> ¿Confirmar cambio?
            </h3>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <CalendarIcon size={18} className="text-slate-400" />
                <span className="text-sm font-bold capitalize">{getNuevaFechaInfo()?.dia}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <Clock size={18} className="text-slate-400" />
                <span className="text-sm font-bold">{getNuevaFechaInfo()?.hora} hs</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={cancelChange} className="py-3 rounded-xl font-bold text-slate-400 hover:bg-slate-50 transition-colors">
                Cancelar
              </button>
              <button onClick={confirmChange} className="py-3 rounded-xl font-bold bg-slate-900 text-white hover:bg-black transition-all shadow-lg">
                Sí, cambiar
              </button>
            </div>
          </div>
        </div>
      )}

      {modalConfirmar && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-120 p-6 border border-slate-100 animate-in fade-in zoom-in duration-200">

            <h3 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
              <AlertCircle className="text-orange-500" /> ¿Confirmar cambio?
            </h3>

            <div className="space-y-3 mb-6">
              {/* Información de referencia */}
              <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <CalendarIcon size={18} className="text-slate-400" />
                <p className="text-sm">Tiempo estimado: <span className="font-bold">1h</span> y precio estimado: <span className="font-bold text-blue-600 font-mono">80€</span></p>
              </div>

              {/* Input para el Cambio de Precio */}
              <div className="flex flex-col gap-2 text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Nuevo precio del servicio (€)</label>
                <input
                  type="number"
                  value={nuevoPrecio}
                  onChange={(e) => setNuevoPrecio(e.target.value)}
                  placeholder="Ej: 90"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-lg font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Input para la Justificación */}
              <div className="flex flex-col gap-2 text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Justificación del cambio</label>
                <textarea
                  value={justificacion}
                  onChange={(e) => setJustificacion(e.target.value)}
                  placeholder="Ej: Se tardó 1 hora más porque el tornillo estaba oxidado..."
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all h-24 resize-none"
                />
              </div>
            </div>

            {/* Botones */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setModalConfirmar(false)}
                className="py-3 rounded-xl font-bold text-slate-400 hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => servicioTerminado(selectedEventId, 'completada')} // Pasamos el ID y el nuevo estado
                className="py-3 rounded-xl font-bold bg-slate-900 text-white hover:bg-black transition-all shadow-lg active:scale-95"
              >
                Terminar servicio
              </button>
            </div>

          </div>
        </div>
      )}

      {hoveredEvent && ReactDOM.createPortal(
        <EventTooltip info={hoveredEvent} position={tooltipPosition} />,
        document.body
      )}
    </div>
  );
};

export default CalendarioSemanalTailwind;