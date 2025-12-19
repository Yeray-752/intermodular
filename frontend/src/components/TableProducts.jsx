import { useState } from 'react';
import '../App.css';
import { useNavigate } from "react-router";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../CalendarioCustom.css';
import serviciosTaller from "../assets/data/productosTaller.json";

function TableProducts({ search, props }) {
    const [datosTaller] = useState(serviciosTaller);
    const filtroBusqueda = (search || '').toLowerCase();
    const categorias = (props || '');

    const navigate = useNavigate();

    return (
        <>
            {datosTaller.filter((servicio) => {
                const coincideNombre = servicio.nombre.toLowerCase().includes(filtroBusqueda);
                const coincideCategoria = categorias === "" || categorias === "X" || servicio.categoria === categorias;
                return coincideNombre && coincideCategoria;
            })
                .map(servicios => {
                    return (
                        
                        <div key={servicios.id} onClick={() => navigate(`/Producto/${servicios.id}`)}  className='card bg-base-100 shadow-xl w-80 flex flex-col cursor-pointer hover:shadow-2xl transition-all duration-300'>

                            <figure className="h-[140px] w-[250px]">
                                <img
                                    src={servicios.imagen}
                                    alt={servicios.nombre}
                                    className="h-[150px] w-[250px] object-contain"
                                />
                            </figure>

                            <div className="card-body p-2 grow flex flex-col items-center text-center">

                                <h2 className="card-title text-lg text-center mb-2">{servicios.nombre}</h2>


                                <div className=" border-t border-gray-200 pt-3 w-full">

                                    <div className="card-actions items-center grid grid-cols-2">
                                            <p> Precio: <span className='text-xl font-extrabold text-orange-600'>{servicios.precio}€</span></p>
                                            <p> Unidades: <span className='text-xl font-extrabold text-orange-600'>{servicios.stock}</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
        </>
    );
}

export default TableProducts;