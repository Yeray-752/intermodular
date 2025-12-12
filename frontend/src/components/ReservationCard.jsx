import { Link } from "react-router-dom";

function ReservationCard() {

    return (
        <div className="w-72 m-7 ">
            <div className="card bg-base-100  shadow-xl" onClick={() => document.getElementById('my_modal_1').showModal()}>
                <figure>
                    <img
                        src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                        alt="Shoes"
                        width={100} />
                </figure>
                <p>Nombre de la cita</p>
                <div className="card-body">
                    <div className="grid grid-cols-2 gap-1">
                        <p>Precio</p>
                        <p>Dificultad</p>
                    </div>
                </div>
            </div>
            <dialog id="my_modal_1" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Pedir cita</h3>
                    <p className="py-4">Debería mostrarse esto cada vez que le doy a una carta de cita, cada modal debería ser distinto ya que el id contendría el id de la cita</p>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
}

export default ReservationCard;