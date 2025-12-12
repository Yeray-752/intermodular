import { useState } from 'react'
import '../App.css'
import { useNavigate } from 'react-router'
import Footer from '../components/Footer'
import Header from '../components/Header'
import ProductoInfo from '../components/Product'

function Producto() {
  //Producto es cuando le doy adentro de una carta de producto
  const [count, setCount] = useState(0)
  const navigate = useNavigate()

  return (
    <>
      <Header />
      <ProductoInfo/>
      <Footer />
    </>
  )
}

export default Producto