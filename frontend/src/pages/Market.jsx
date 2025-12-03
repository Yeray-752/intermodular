import { useState } from 'react'
import '../App.css'
import { useNavigate } from 'react-router'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Sales from '../components/Sales'
import WhoWeAre from '../components/WhoWeAre'

function App() {
  const [count, setCount] = useState(0)
  const navigate = useNavigate()

  return (
    <>
      <Header />
      <Footer />
    </>
  )
}

export default App