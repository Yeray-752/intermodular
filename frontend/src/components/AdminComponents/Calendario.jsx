import React from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import "./calendario.css"

const CalendarioSemanalTailwind = ({ initialEvents }) => {
  
  // Función para manejar cuando se hace clic en una hora vacía
  const handleDateSelect = (selectInfo) => {
    const title = prompt('Introduce el título del nuevo evento:');
    let calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // Limpiar selección

    if (title) {
      calendarApi.addEvent({
        id: String(Date.now()),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }
  };

  return (
    <div className="mt-6 bg-base-100 border-3 border-neutral rounded-2xl">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        
        {/* Contenedor con estilos de Tailwind para "atacar" a FullCalendar */}
        <div className="calendar-container overflow-hidden">
          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            dayHeaderFormat={{ 
              weekday: 'long', 
              day: 'numeric', 
              omitCommas: true // Evita que aparezca una coma entre el nombre y el número
            }}
            events={initialEvents}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'timeGridWeek,timeGridDay'
            }}
            locale={esLocale}
            slotMinTime="08:00:00"
            slotMaxTime="16:00:00"
            allDaySlot={false}
            height="525px"
            
            // Personalización visual con clases de Tailwind mediante inyección de CSS o estilos directos
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            hiddenDays={[0]}
            timeZone="local"
            // Eventos de prueba
            

            select={handleDateSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarioSemanalTailwind;