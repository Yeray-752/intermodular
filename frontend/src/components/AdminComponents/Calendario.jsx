import React, { useState } from 'react';
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
      className="absolute z-9999 p-4 bg-white border border-gray-200 rounded-lg shadow-xl pointer-events-none w-72"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(15px, -50%)', 
      }}
    >
      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-l border-b border-gray-200 rotate-45"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          <h3 className="text-lg font-bold text-gray-900 leading-tight">{title}</h3>
        </div>
        <p className="text-sm text-gray-600 mb-1 font-medium italic">{vehiculo}</p>
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

  const handleEventDrop = (info) => {
    setPendingChange(info);
    setShowConfirm(true);
  };

  const confirmChange = async () => {
    const { event } = pendingChange;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:3000/api/dates/${event.id}/update`, {
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
    <div className="mt-6 bg-base-100 border-3 border-neutral rounded-2xl relative">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-lg">
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

      {hoveredEvent && ReactDOM.createPortal(
        <EventTooltip info={hoveredEvent} position={tooltipPosition} />,
        document.body
      )}
    </div>
  );
};

export default CalendarioSemanalTailwind;