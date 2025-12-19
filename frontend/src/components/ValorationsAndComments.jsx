import { useState } from 'react'
import '../App.css'
import { useNavigate } from 'react-router'
import Footer from '../components/Footer'
import Header from '../components/Header'
import TableProducts from '../components/TableProducts'

function App() {
    const [count, setCount] = useState(0)
    const navigate = useNavigate()

    return (
        <>
            <div className='mx-8'>
                <div className="grid grid-cols-2 items-start gap-8">
                    <div className="card bg-base-100 shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title">
                                ¡Danos tu opinión!
                            </h2>

                            <div className="rating rating-lg rating-half mb-4">
                                <input type="radio" name="rating-11" className="rating-hidden" />
                                <input type="radio" name="rating-11" className="mask mask-star-2 mask-half-1 bg-amber-400" aria-label="0.5 star" />
                                <input type="radio" name="rating-11" className="mask mask-star-2 mask-half-2 bg-amber-400" aria-label="1 star" />
                                <input type="radio" name="rating-11" className="mask mask-star-2 mask-half-1 bg-amber-400" aria-label="1.5 star" defaultChecked />
                                <input type="radio" name="rating-11" className="mask mask-star-2 mask-half-2 bg-amber-400" aria-label="2 star" />
                                <input type="radio" name="rating-11" className="mask mask-star-2 mask-half-1 bg-amber-400" aria-label="2.5 star" />
                                <input type="radio" name="rating-11" className="mask mask-star-2 mask-half-2 bg-amber-400" aria-label="3 star" />
                                <input type="radio" name="rating-11" className="mask mask-star-2 mask-half-1 bg-amber-400" aria-label="3.5 star" />
                                <input type="radio" name="rating-11" className="mask mask-star-2 mask-half-2 bg-amber-400" aria-label="4 star" />
                                <input type="radio" name="rating-11" className="mask mask-star-2 mask-half-1 bg-amber-400" aria-label="4.5 star" />
                                <input type="radio" name="rating-11" className="mask mask-star-2 mask-half-2 bg-amber-400" aria-label="5 star" />
                            </div>

                            <fieldset className="fieldset">
                                <textarea
                                    className="textarea h-24"
                                    placeholder="Escriba un comentario si lo desea..."
                                ></textarea>
                            </fieldset>

                            <div className="card-actions">
                                <button className="btn btn-primary btn-sm">
                                    Enviar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Hacer un while para cada uno de los comentarios */}
                    <div className='card bg-base-100 shadow-sm'>
                        <div className='grid grid-cols-3'>
                            <p>Imagen de perfil</p>
                            <p>Nombre del usuario</p>
                            <div className="rating rating-md rating-half pointer-events-none">
                                <input type="radio" className="rating-hidden" />

                                <input type="radio" className="mask mask-star-2 mask-half-1 bg-amber-400" checked disabled />
                                <input type="radio" className="mask mask-star-2 mask-half-2 bg-amber-400" checked disabled />
                                <input type="radio" className="mask mask-star-2 mask-half-1 bg-amber-400" checked disabled />
                                <input type="radio" className="mask mask-star-2 mask-half-2 bg-amber-400" checked disabled />
                                <input type="radio" className="mask mask-star-2 mask-half-1 bg-amber-400" checked disabled />
                                <input type="radio" className="mask mask-star-2 mask-half-2 bg-amber-400" checked disabled />
                                <input type="radio" className="mask mask-star-2 mask-half-1 bg-amber-400" checked disabled />
                                <input type="radio" className="mask mask-star-2 mask-half-2 bg-amber-400" checked disabled />
                                <input type="radio" className="mask mask-star-2 mask-half-1 bg-amber-400" checked disabled />
                                <input type="radio" className="mask mask-star-2 mask-half-2 bg-amber-400" disabled />
                            </div>

                        </div>

                        <p className='pt-5 text-left'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
                    </div>
                </div>
            </div>

        </>
    )
}

export default App