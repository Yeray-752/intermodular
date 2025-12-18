import { useState } from 'react'
import '../App.css'
import { useNavigate } from 'react-router'
import Footer from '../components/Footer'
import Header from '../components/Header'
import WhoWeAre from '../components/WhoWeAre'

function Perfil() {
    const [count, setCount] = useState(0)
    const navigate = useNavigate()

    return (

        <div className='bg-white'>
            <Header />
            <div className='flex justify-center w-full p-4'>
                <div className='flex bg-gray-300 w-full max-w-[1300px] gap-4 p-4'>
                    <div className='bg-gray-100 w-60 flex-none p-4'>
                        Izquierda
                    </div>
                    <div className='bg-gray-100 flex-1 p-4'>
                        Derecha (ocupa el resto)
                    </div>

                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Perfil;