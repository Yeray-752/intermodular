import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Reservas from './pages/Reservations.jsx'
import Market from './pages/Market.jsx'
import SignUp from './pages/SignUp.jsx'
import About from './pages/about.jsx'
import Producto from './pages/Product.jsx'
import Error from "./pages/404.jsx"
import Services from "./pages/services.jsx"
import Perfil from "./pages/perfil.jsx"
import Texto from "./pages/texto.jsx"

import { BrowserRouter, Routes, Route } from 'react-router'
import ReactDOM from "react-dom/client"

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/reservas' element={<Reservas />} />
      <Route path='/productos' element={<Market />} />
      <Route path="/producto/:id" element={<Producto />} />

      <Route path='/registro' element={<SignUp />} />
      <Route path='/sobre-nosotros' element={<About />} />
      <Route path='/servicios' element={<Services />} />
      <Route path='/sobre-nosotros' element={<About />} />
      <Route path='/perfil' element={<Perfil />} />
      <Route path='/Aviso-legal' element={<Texto />} />
      <Route path='*' element={<Error />} />
    </Routes>
  </BrowserRouter>,
)
