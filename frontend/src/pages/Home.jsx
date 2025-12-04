import { useState } from 'react'
import '../App.css'
import { useNavigate } from 'react-router'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Sales from '../components/Sales'
import WhoWeAre from '../components/WhoWeAre'
import Imagenprincipal from '../assets/img/Imagenprincipal.webp'

function App() {
  const [count, setCount] = useState(0)
  const navigate = useNavigate()

  return (
    <>
      <div className='min-h-screen flex flex-col bg-gray-900'>
        <Header />
        <main className="bg-gray-200 py-12 px-6">
          <section className="p-10 rounded-lg bg-gray-700 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            <div className="rounded-lg overflow-hidden shadow-lg">
              <img src={Imagenprincipal} alt="Motocicleta en taller" className="w-full h-auto object-cover" />
            </div>


            <div>
              <h2 className="text-4xl font-bold text-white mb-4">Personalización y Reparación de Motocicletas</h2>
              <p className="text-lg text-white mb-6">
                En Akotan nos especializamos en transformar tu moto en una obra de arte. Desde mantenimiento hasta modificaciones únicas, trabajamos con pasión y precisión.
              </p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">Ver servicios</button>
            </div>
          </section>


          <section className="mt-10">
            <h3 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Ofertas del Mes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-30">

              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <h4 className="text-xl font-bold text-blue-600 mb-2">Cambio de aceite</h4>
                <p className="text-gray-600 mb-4">Incluye revisión completa por solo 29,99€</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Reservar</button>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <h4 className="text-xl font-bold text-blue-600 mb-2">Cambio de aceite</h4>
                <p className="text-gray-600 mb-4">Incluye revisión completa por solo 29,99€</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Reservar</button>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <h4 className="text-xl font-bold text-blue-600 mb-2">Cambio de aceite</h4>
                <p className="text-gray-600 mb-4">Incluye revisión completa por solo 29,99€</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Reservar</button>
              </div>

            </div>
          </section>
          <section className="mt-10 p-10 rounded-lg bg-gray-700 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            <div className="rounded-lg overflow-hidden shadow-lg">
              <img src={Imagenprincipal} alt="Motocicleta en taller" className="w-full h-auto object-cover" />
            </div>


            <div>
              <h2 className="text-4xl font-bold text-white mb-4">Personalización y Reparación de Motocicletas</h2>
              <p className="text-lg text-white mb-6">
                En Akotan nos especializamos en transformar tu moto en una obra de arte. Desde mantenimiento hasta modificaciones únicas, trabajamos con pasión y precisión.
              </p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">Ver servicios</button>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  )
}

export default App
