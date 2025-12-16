import { useState } from 'react'
import '../App.css'
import { useNavigate } from 'react-router'
import Footer from '../components/Footer'
import Header from '../components/Header'
import TableReservations from '../components/TableReservations'

function App() {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-screen">

      <Header />


      <main className="grow">

        <div className=" w-full min-h-screen">


          {/* <nav>
            <form className='mt-5'>
              <input className="btn btn-square" type="reset" value="×" />
              <input className="btn" type="checkbox" name="frameworks" aria-label="Mantenimiento Básico" />
              <input className="btn" type="checkbox" name="frameworks" aria-label="Sistema de Frenos" />
              <input className="btn" type="checkbox" name="frameworks" aria-label="Neumáticos" />
              <input className="btn" type="checkbox" name="frameworks" aria-label="Sistema Eléctrico" />
              <input className="btn" type="checkbox" name="frameworks" aria-label="Suspensión" />
              <input className="btn" type="checkbox" name="frameworks" aria-label="Motor" />
              <input className="btn" type="checkbox" name="frameworks" aria-label="Transmisión" />
              <input className="btn" type="checkbox" name="frameworks" aria-label="Climatización" />
              <input className="btn" type="checkbox" name="frameworks" aria-label="Sistema de Escape" />
              <input className="btn" type="checkbox" name="frameworks" aria-label="Diagnóstico" />
              <input className="btn" type="checkbox" name="frameworks" aria-label="Carrocería" />
            </form>
          </nav> */}


          <div className="flex-col grow p-4 justify-items-center">


            <label className="input mt-10">
              <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </g>
              </svg>
              <input type="search" onChange={(e) => setSearch(e.target.value)} required placeholder="Search" />
            </label>

            <nav className='space-x-1.5 mt-8 mb-5'>
              <span className='btn rounded-2xl mt-2'>Mantenimiento Básico</span>
              <span className='btn rounded-2xl mt-2'>Sistema de Frenos</span>
              <span className='btn rounded-2xl mt-2'>Neumáticos</span>
              <span className='btn rounded-2xl mt-2'>Sistema Eléctrico</span>
              <span className='btn rounded-2xl mt-2'>Suspensión</span>
              <span className='btn rounded-2xl mt-2'>Motor</span>
              <span className='btn rounded-2xl mt-2'>Transmisión</span>
              <span className='btn rounded-2xl mt-2'>Climatización</span>
              <span className='btn rounded-2xl mt-2'>Sistema de Escape</span>
              <span className='btn rounded-2xl mt-2'>Diagnóstico</span>
              <span className='btn rounded-2xl mt-2'>Carrocería</span>
            </nav>
            <div className="lg:w-[1000px] 2xl:w-[1350px] pt-4 ">
              <div className="grid lg:grid-cols-3 2xl:grid-cols-4 gap-4 justify-items-center">
                <TableReservations search={search}/>
                {console.log(search)}
                
              </div>
            </div>

            
          </div>
        </div>

      </main>

      <Footer />
    </div>
  )
}

export default App