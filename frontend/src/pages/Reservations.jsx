import { useState } from 'react'
import '../App.css'
import { useNavigate } from 'react-router'
import Footer from '../components/Footer'
import Header from '../components/Header'
import TableReservations from '../components/TableReservations'

function App() {
  const [count, setCount] = useState(0)
  const navigate = useNavigate()

  return (
   <div className="flex flex-col min-h-screen"> 
            
            <Header /> 
            
            {/* 2. Main: Estira el contenido variable y empuja el Footer. */}
            {/* Es fundamental que este elemento crezca y no tenga padding vertical, 
               para que TableReservations pueda llenarlo. */}
            <main className="grow"> 
                 {/* Aquí se renderiza tu componente TableReservations (Reservas) */}
                 <TableReservations /> 
            </main>

            <Footer />
        </div>
  )
}

export default App