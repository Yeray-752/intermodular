import { useState } from 'react'
import '../App.css'
import { useNavigate } from 'react-router'
import Footer from '../components/Footer'
import Header from '../components/Header'
import WhoWeAre from '../components/WhoWeAre'

function App() {
  const [count, setCount] = useState(0)
  const navigate = useNavigate()

  return (

    <div className='bg-base-200'>
      <Header />
      <WhoWeAre />
      <Footer />
    </div>
  )
}

export default App