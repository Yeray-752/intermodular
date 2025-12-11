import { useState } from 'react'
import '../App.css'
import { useNavigate } from 'react-router'
import ProductCard from "./ProductCard"

function TableProducts() {
    const [search, setSearch] = useState("");
    return (
        <div>

            <div className="TableProducts">

                <input className='input mt-20 w-100' type="text" onChange={(e) => setSearch(e.target.value)} placeholder="Motor 4 tiempos..." />


                <div className="container-Produts mt-20">
                    <div className="grid grid-cols-3 justify-items-center">
                        {/*Hacer un while para mostrar todos los productos con el paginador incluido,
                        Dentro del elemento producto creamos el link hacia la página del mismoproducto según el id*/}
                        <ProductCard />
                        <ProductCard />
                        <ProductCard />
                        <ProductCard />
                        <ProductCard />
                        <ProductCard />
                        <ProductCard />
                        <ProductCard />
                        <ProductCard />
                    </div>
                </div>
            </div>

            <div className="join">
                <button className="join-item btn">1</button>
                <button className="join-item btn btn-active">2</button>
                <button className="join-item btn">3</button>
                <button className="join-item btn">4</button>
            </div>
        </div>
    );
}

export default TableProducts;