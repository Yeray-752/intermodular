import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Cambiamos 'props' por 'categoriaId' para que coincida con lo que envía el padre
function TableProducts({ search, categoriaId, productos }) {
    const { t } = useTranslation('market');
    const navigate = useNavigate();
    const filtroBusqueda = (search || '').toLowerCase();

    // Filtramos los productos
    const productosFiltrados = productos.filter((item) => {
        // 1. Coincidencia por texto
        const coincideNombre = item.name?.toLowerCase().includes(filtroBusqueda);
        
        // 2. Coincidencia por ID de categoría
        // Si categoriaId es null, no hay filtro (true). 
        // Si hay valor, comparamos con el category_id que viene de MariaDB.
        const coincideCategoria = !categoriaId || item.category_id === categoriaId;
        
        return coincideNombre && coincideCategoria;
    });

    return (
        <>
            {productosFiltrados.length > 0 ? (
                productosFiltrados.map(item => (
                    <div 
                        key={item.id} 
                        onClick={() => navigate(`/producto/${item.id}`)} 
                        className='card bg-base-100 shadow-xl w-80 flex flex-col cursor-pointer hover:shadow-2xl transition-all duration-300'
                    >
                        <figure className="h-[140px] w-full p-4">
                            <img 
                                src={item.image_url} 
                                alt={item.name} 
                                className="h-full w-full object-contain" 
                            />
                        </figure>
                        <div className="card-body p-4 grow flex flex-col items-center text-center">
                            <h2 className="card-title text-lg text-center mb-2">{item.name}</h2>
                            <div className="border-t border-gray-200 pt-3 w-full">
                                <div className="card-actions items-center grid grid-cols-2">
                                    <p className="text-sm">
                                        {t('price')}: <br/>
                                        <span className='text-lg font-extrabold text-orange-600'>{item.price}€</span>
                                    </p>
                                    <p className="text-sm">
                                        {t('stock')}: <br/>
                                        <span className='text-lg font-extrabold text-orange-600'>{item.stock}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                /* Mensaje por si el filtro deja la lista vacía */
                <div className="col-span-full py-10 text-center text-gray-500">
                    <p className="text-xl">{t('noProductsFound', 'No se han encontrado productos')}</p>
                </div>
            )}
        </>
    );
}

export default TableProducts;