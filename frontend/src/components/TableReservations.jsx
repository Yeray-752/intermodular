import { useState } from 'react';
import '../App.css';
import { useNavigate } from 'react-router';
import ReservationCard from "./ReservationCard";

function TableReservations() {
    const [search, setSearch] = useState("");

    return (
        // Contenedor principal con altura mínima de viewport completa
        <div className="flex w-full min-h-screen">
            
            {/* Barra lateral: Ocupa toda la altura de la pantalla */}
            <aside className="w-60 bg-gray-100 border-r border-gray-300 p-4 flex flex-col min-h-screen sticky top-0">
                <p className="text-xs font-semibold mb-4">Filtros</p>
                
                {/* Aquí puedes agregar tus filtros */}
                <div className="space-y-4">
                    {/* Ejemplo de filtros */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Categoría</label>
                        <select className="w-full border rounded px-2 py-1 text-sm">
                            <option>Todas</option>
                            <option>Coches</option>
                            <option>Motos</option>
                            <option>Revisión</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-2">Fecha</label>
                        <input type="date" className="w-full border rounded px-2 py-1 text-sm" />
                    </div>
                </div>
                
                <div className="grow" />
            </aside>

            {/* Contenido principal */}
            <div className="flex flex-col grow items-end p-4">
                
                {/* Búsqueda (comentado) */}
                {/* <input
                    className='input mt-4 w-96'
                    type="text"
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Motor 4 tiempos..."
                /> */}

                {/* Grid de tarjetas */}
                <div className="w-full pt-4">
                    <div className="grid grid-cols-3 gap-4 justify-items-center">
                        <ReservationCard />
                        <ReservationCard />
                        <ReservationCard />
                        <ReservationCard />
                        <ReservationCard />
                        <ReservationCard />
                        <ReservationCard />
                        <ReservationCard />
                        <ReservationCard />
                    </div>
                </div>

                {/* Paginación */}
                <div className="w-full flex justify-center mt-8">
                    <button className="join-item btn btn-active">1</button>
                    <button className="join-item btn">2</button>
                    <button className="join-item btn">3</button>
                    <button className="join-item btn">4</button>
                </div>
            </div>
        </div>
    );
}

export default TableReservations;