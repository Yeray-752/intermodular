
function Product() {
    return (
        <div>
            <div className="hero min-h-screen">
                <div className="hero-content flex-col lg:flex-row shadow-2xl">
                    <img
                        src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
                        className="max-w-sm rounded-lg shadow-2xl"
                    />
                    <div>
                        <h1 className="text-5xl font-bold">Nombre de producto</h1>
                        <p className="py-6">
                            Descripción de producto
                        </p>
                        <div className="grid grid-cols-2 justify-items-center">
                            <p>Precio</p>
                            <button className="w-full px-4 py-3 bg-linear-to-r from-orange-600 to-orange-700 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-orange-800 transition-all duration-300">
                                Comprar
                                </button>
                        </div>
                    </div>
                </div>
            </div>





        </div>
    );
}

export default Product;