import { useState } from 'react'
import '../style/App.css'
import { useNavigate } from 'react-router'
import Login from '../components/Sesion/Login'
import Header from '../components/Principal/Header'
import Footer from '../components/Principal/Footer'

function App() {
  const [count, setCount] = useState(0)
  const navigate = useNavigate()

  return (
    <>
      <Header />
      <Login />
    </>
  )
}

export default App