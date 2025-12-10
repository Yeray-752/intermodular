import { useState } from 'react'
import '../App.css'
import { useNavigate } from 'react-router'
import Login from '../components/Login'
import Header from '../components/Header'
import Footer from '../components/Footer'

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