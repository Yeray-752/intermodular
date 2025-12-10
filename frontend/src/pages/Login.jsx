import { useState } from 'react'
import '../App.css'
import { useNavigate } from 'react-router'
import Login from '../components/Login'

function App() {
  const [count, setCount] = useState(0)
  const navigate = useNavigate()

  return (
    <>
      <Login/>
    </>
  )
}

export default App