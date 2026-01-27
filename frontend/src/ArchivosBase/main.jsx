import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../style/index.css'
import './i18n.js';

import Home from '../pages/Home.jsx'
import Login from '../pages/Login.jsx'
import Reservas from '../pages/Reservations.jsx'
import Market from '../pages/Market.jsx'
import SignUp from '../pages/SignUp.jsx'
import About from '../pages/about.jsx'
import Producto from '../pages/Product.jsx'
import Error from "../pages/404.jsx"
import Perfil from "../pages/perfil.jsx"
import Texto from "../pages/texto.jsx"
import AdminPage from "../pages/AdminPage.jsx"
import { AuthProvider } from '../context/AuthContext.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google'; // <--- 1. Importar

import { ThemeProvider } from "../context/ThemeContext.jsx";

import { BrowserRouter, Routes, Route } from 'react-router'
import ReactDOM from "react-dom/client"

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="132089921537-h1ijgechji2s3tbh51j1su0g49n1gf38.apps.googleusercontent.com">
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/reservas' element={<Reservas />} />
            <Route path='/productos' element={<Market />} />
            <Route path="/producto/:id" element={<Producto />} />

            <Route path='/registro' element={<SignUp />} />
            <Route path='/sobre-nosotros' element={<About />} />
            <Route path='/perfil' element={<Perfil />} />
            <Route path='/Aviso-legal' element={<Texto />} />
            <Route path='*' element={<Error />} />

            <Route path='/admin/dashboard' element={<AdminPage />} />

          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  </GoogleOAuthProvider>

)
