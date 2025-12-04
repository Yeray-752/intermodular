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
      <div className='min-h-screen flex flex-col bg-gray-900'>
        <Header />
        <div className='h-300 bg-white text-black'>
          <p>Hola que hace</p>
        <Sales />
        <WhoWeAre />¡
        </div>
        <Footer />
      </div>
    </>
  )
}

export default App
