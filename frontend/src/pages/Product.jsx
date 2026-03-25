import { useState } from 'react'
import '../style/index.css'
import { useNavigate } from 'react-router'
import Footer from '../components/Principal/Footer'
import Header from '../components/Principal/Header'
import ProductoInfo from '../components/Productos/Product'

function Producto() {
  //Producto es cuando le doy adentro de una carta de producto

  return (
    <>
      <Header />
      <ProductoInfo />
      <Footer />
    </>
  )
}

export default Producto