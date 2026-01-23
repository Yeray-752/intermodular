import { useState } from 'react'
import '../style/App.css'
import { useNavigate } from 'react-router'
import Footer from '../components/Principal/Footer'
import Header from '../components/Principal/Header'
import ProductoInfo from '../components/Productos/Product'
import Valorations from "../components/Productos/ValorationsAndComments"

function Producto() {
  //Producto es cuando le doy adentro de una carta de producto
  const [count, setCount] = useState(0)
  const navigate = useNavigate()

  return (
    <>
      <Header />
      
      <div className='bg-base-200'>
        <ProductoInfo />
        <Valorations />
        <Footer />
      </div>



    </>
  )
}

export default Producto