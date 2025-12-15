import { Link } from "react-router-dom";

export default function ReservationCard() {
  return (
    <div className="w-72 m-7">
      <Link to="/producto">
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          <figure className="relative h-44 overflow-hidden group">
            <img
              src="https://img.daisyui.com/images/stock/daisyui-hat-1.webp"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </figure>

          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              Cambio de aceite
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Servicio completo de cambio de aceite y revisión rápida del vehículo.
            </p>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-100 p-2 rounded-xl text-center">
                <p className="font-semibold text-gray-700">Precio</p>
                <p className="text-gray-500">$35</p>
              </div>
              <div className="bg-gray-100 p-2 rounded-xl text-center">
                <p className="font-semibold text-gray-700">Dificultad</p>
                <p className="text-gray-500">Baja</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
