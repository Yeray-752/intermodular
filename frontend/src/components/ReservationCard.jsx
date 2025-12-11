import { Link } from "react-router-dom";

function ReservationCard() {

    return (
        <div className="w-72 m-7 ">
            <Link to="/producto">
                <div className="card bg-base-100  shadow-xl">
                    <figure>
                        <img
                            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                            alt="Shoes"
                            width={100}/>
                    </figure>
                    <p>Nombre de la cita</p>
                    <div className="card-body">
                        <div className="grid grid-cols-2 gap-1">
                            <p>Precio</p>
                            <p>Dificultad</p>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default ReservationCard;