import React, { useState } from 'react';
import ReactDOM from 'react-dom'; // Necesario para el Portal
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import "./calendario.css";

// Componente para el cuadro flotante personalizado (Tooltip)
// Usamos Tailwind para darle un estilo moderno
const EventTooltip = ({ info, position }) => {
  if (!info) return null;

  // Extraemos datos útiles del evento
  const { title, start } = info;
  const descripcion = info.extendedProps?.descripcion || 'Sin descripción adicional'; // Asumiendo que envías esto en tus eventos
  const hora = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      className="absolute z-[9999] p-4 bg-white border border-gray-200 rounded-lg shadow-xl pointer-events-none w-72"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -110%)', // Centrado horizontal, arriba del cursor
      }}
    >
      {/* Triángulo del bocadillo */}
      <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-gray-200 rotate-45"></div>

      {/* Contenido del cuadro */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-primary rounded-full"></div> {/* Punto de color */}
          <h3 className="text-lg font-bold text-gray-900 leading-tight">
            {title}
          </h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">
          <span className="font-semibold text-gray-700">Hora:</span> {hora}
        </p>
        
        <div className="bg-gray-50 p-2.5 rounded border border-gray-100">
          <p className="text-xs text-gray-500 italic">
            {descripcion}
          </p>
        </div>
      </div>
    </div>
  );
};

// Componente principal
const CalendarioSemanalTailwind = ({ initialEvents, onUpdateAppointment }) => {
  // --- ESTADO PARA EL HOVER ---
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Tu función original de actualización (sin cambios)
  const handleEventChange = async (changeInfo) => {
    const { event } = changeInfo;
    const token = localStorage.getItem('token');
  
    const datosParaEnviar = {
        fechaCita: event.startStr 
    };

    try {
        const response = await fetch(`http://localhost:3000/api/dates/${event.id}/update`, {
            method: 'PATCH',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(datosParaEnviar)
        });

        if (response.ok) {
            alert("Cita movida y confirmada");
        } else {
            changeInfo.revert();
        }
    } catch (error) {
        changeInfo.revert();
    }
  };

  // --- NUEVAS FUNCIONES PARA EL HOVER MEJORADO ---
  const handleMouseEnter = (info) => {
    const rect = info.el.getBoundingClientRect(); // Obtenemos la posición del evento en pantalla
    
    // Guardamos la info del evento y la posición donde debe aparecer el cuadro
    setHoveredEvent(info.event);
    setTooltipPosition({
      x: rect.left + rect.width / 2 + window.scrollX, // Centro horizontal del evento
      y: rect.top + window.scrollY, // Parte superior del evento
    });

    // Opcional: efecto visual sutil en el borde del evento
    info.el.style.borderColor = '#1d4ed8'; // blue-700
  };

  const handleMouseLeave = (info) => {
    // Limpiamos el estado para ocultar el cuadro
    setHoveredEvent(null);
    info.el.style.borderColor = ''; // Restauramos borde
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
            
            // Eventos de interacción
            eventDrop={handleEventChange}
            eventResize={handleEventChange}
            
            // --- EVENTOS DE HOVER ACTUALIZADOS ---
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

      {/* --- PORTAL DEL TOOLTIP --- */}
      {/* Renderizamos el cuadro flotante al final del <body> para evitar problemas de z-index */}
      {hoveredEvent && ReactDOM.createPortal(
        <EventTooltip info={hoveredEvent} position={tooltipPosition} />,
        document.body
      )}
    </div>
  );
};

export default CalendarioSemanalTailwind;