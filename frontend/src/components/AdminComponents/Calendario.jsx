import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import "./calendario.css";

// Componente para el cuadro flotante posicionado a la DERECHA
const EventTooltip = ({ info, position }) => {
  if (!info) return null;

  const { title, start } = info;
  const descripcion = info.extendedProps?.descripcion || 'Sin descripción adicional'; 
  const hora = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const vehiculo = info.extendedProps?.vehiculo || 'No hay vehiculo';

  return (
    <div
      className="absolute z-[9999] p-4 bg-white border border-gray-200 rounded-lg shadow-xl pointer-events-none w-72"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        // Se mueve 15px a la derecha para no tocar el evento y se centra verticalmente
        transform: 'translate(15px, -50%)', 
      }}
    >
      {/* Triángulo del bocadillo (Lado izquierdo) */}
      <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-l border-b border-gray-200 rotate-45"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          <h3 className="text-lg font-bold text-gray-900 leading-tight">
            {title}
          </h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">
          <span className="font-semibold text-gray-700">Hora:</span> {hora}
        </p>
        <p>{vehiculo}</p>
        
        <div className="bg-gray-50 p-2.5 rounded border border-gray-100">
          <p className="text-xs text-gray-500 italic">
            {descripcion}
          </p>
        </div>
      </div>
    </div>
  );
};

const CalendarioSemanalTailwind = ({ initialEvents, onUpdateAppointment }) => {
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleEventChange = async (changeInfo) => {
    const { event } = changeInfo;
    const token = localStorage.getItem('token');
    const datosParaEnviar = { fechaCita: event.startStr };

    try {
        const response = await fetch(`http://localhost:3000/api/dates/${event.id}/update`, {
            method: 'PATCH',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(datosParaEnviar)
        });

        if (!response.ok) changeInfo.revert();
    } catch (error) {
        changeInfo.revert();
    }
  };

  const handleMouseEnter = (info) => {
    const rect = info.el.getBoundingClientRect();
    
    setHoveredEvent(info.event);
    setTooltipPosition({
      // X: Borde derecho del evento
      x: rect.right + window.scrollX, 
      // Y: Centro vertical del evento
      y: rect.top + (rect.height / 2) + window.scrollY, 
    });

    info.el.style.borderColor = '#1d4ed8';
  };

  const handleMouseLeave = (info) => {
    setHoveredEvent(null);
    info.el.style.borderColor = ''; 
  };

  return (
    <div className="mt-6 bg-base-100 border-3 border-neutral rounded-2xl relative">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <div className="calendar-container overflow-hidden">
          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            locale={esLocale}
            events={initialEvents}
            editable={true}
            selectable={true}
            slotMinTime="08:00:00"
            slotMaxTime="18:00:00"
            allDaySlot={false}
            height="525px"
            eventDrop={handleEventChange}
            eventResize={handleEventChange}
            eventMouseEnter={handleMouseEnter}
            eventMouseLeave={handleMouseLeave}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'timeGridWeek,timeGridDay'
            }}
          />
        </div>
      </div>

      {hoveredEvent && ReactDOM.createPortal(
        <EventTooltip info={hoveredEvent} position={tooltipPosition} />,
        document.body
      )}
    </div>
  );
};

export default CalendarioSemanalTailwind;