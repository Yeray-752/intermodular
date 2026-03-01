import React from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import "./calendario.css"

const CalendarioSemanalTailwind = ({ initialEvents, onUpdateAppointment }) => {
  
  // Esta función se dispara cuando el admin suelta la cita en una nueva hora
 const handleEventChange = async (changeInfo) => {
    const { event } = changeInfo;
    const token = localStorage.getItem('token');
  
    // Solo enviamos el ID y la fecha formateada que da FullCalendar
    const datosParaEnviar = {
        fechaCita: event.startStr // Ejemplo: "2024-05-20T11:30:00"
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
        console.log('hola')

        if (response.ok) {
            alert("Cita movida y confirmada");
        } else {
            changeInfo.revert(); // Si el server falla, la cita vuelve a las 09:00
        }
    } catch (error) {
        changeInfo.revert();
    }
};

  return (
    <div className="mt-6 bg-base-100 border-3 border-neutral rounded-2xl">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <div className="calendar-container overflow-hidden">
          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            locale={esLocale}
            events={initialEvents}
            editable={true} // Permite arrastrar
            selectable={true}
            slotMinTime="08:00:00"
            slotMaxTime="18:00:00"
            allDaySlot={false}
            height="525px"
            
            // Eventos de interacción
            eventDrop={handleEventChange}   // Cuando se arrastra y suelta
            eventResize={handleEventChange} // Cuando se estira el tiempo
            
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'timeGridWeek,timeGridDay'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarioSemanalTailwind;