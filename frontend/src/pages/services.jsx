import { useState } from 'react'
import '../App.css'
import { useNavigate } from 'react-router'
import Footer from "../components/Footer";
import Header from "../components/Header";
import reparacionImg from "../assets/img/reparacion.webp";
import productosImg from "../assets/img/motor.webp";
import { Link } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0)
  const navigate = useNavigate()

  return (
    <div>
      <Header />

      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center bg-neutral-100 p-5 rounded-2xl">

          <Link to="/reservas">
            <div
              className="hero h-[600px] w-[400px]"
              style={{
                backgroundImage: `url(${reparacionImg})`,
              }}
            >
              <div className="hero-overlay"></div>
              <div className="hero-content text-neutral-content text-center">
                <div className="max-w-md">
                  <h1 className="mb-5 text-3xl font-bold">Reservas</h1>
                  <p className="mb-5">Reparaciones de todo tipo en una gran cantidad de modelos,
                    tambien hacemos exámenes de la ITV.</p>
                </div>
              </div>
            </div>
          </Link>



          <div className="divider divider-horizontal mx-4">OR</div>

          <Link to="/productos">
            <div
              className="hero h-[600px] w-[400px]"
              style={{
                backgroundImage: `url(${productosImg})`,
              }}
            >
              <div className="hero-overlay"></div>
              <div className="hero-content text-neutral-content text-center">
                <div className="max-w-md">
                  <h1 className="mb-5 text-3xl font-bold">Productos</h1>
                  <p className="mb-5">
                    Frenos, amortiguadores, neumáticos, volantes, lunas y cristales. Todo, en nuestra tienda.
                  </p>
                </div>
              </div>
            </div>
          </Link>

        </div>
      </div>


      <Footer />
    </div>


  )
}

export default App