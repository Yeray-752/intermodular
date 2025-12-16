import { useState } from 'react';
import '../App.css';
import { useNavigate } from 'react-router';
import ReservationCard from "./ReservationCard";
import serviciosTaller from "../assets/data/serviciosTaller.json"
import { Link } from 'react-router-dom';

function TableReservations({search}) {
    const [datosTaller, setdatosTaller] = useState(serviciosTaller);
    const filtroBusqueda = (search || '').toLowerCase();
    
    return (
        <>
            {datosTaller.filter(servicios => servicios.nombre.toLowerCase().includes(filtroBusqueda)).map(servicios => {
                return(
                    <Link to={`/servicios/${servicios.id}`} key={servicios.id}>
                        <div className='card bg-base-100 shadow-xl h-100 w-80 flex flex-col'> 
                            
                           
                            <figure className="aspect-video"> 
                                <img
                                    src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                                    alt={servicios.nombre}
                                    className="w-full h-full object-cover"
                                />
                            </figure>
                            
                            
                            <div className="card-body p-2 grow flex flex-col items-center text-center">
                                
             
                                <h2 className="card-title text-lg text-center mb-2">{servicios.nombre}</h2>
                                <p className="text-sm text-gray-900 mb-3 grow">{servicios.descripcion}</p>

                                <div className="mt-auto border-t border-gray-200 pt-3">
                                    
                                    <div className="flex justify-between text-xs space-x-8 mb-2">
                                        <p>
                                            <span className="font-semibold">Duración:</span> {servicios.duracion}
                                        </p>
                                        <p>
                                            <span className="font-semibold"> Dificultad:</span> {servicios.dificultad}
                                        </p>
                                    </div>
                                    
                                  
                                    <div className="card-actions justify-between items-center">
                                        <div className="text-2xl font-extrabold text-orange-600">
                                            <p className='pl-5'>{servicios.precio}€</p>
                                        </div>
                                        <button className="btn btn-sm text-white bg-orange-600 mr-2">
                                            Reservar
                                        </button>
                                    </div>
                                    
                                </div>

                            </div>
                        </div>
                    </Link>
                );
            })}
        </>
    );
}

export default TableReservations;