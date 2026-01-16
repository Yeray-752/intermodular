import { useNavigate } from "react-router-dom"; // Asegúrate de usar 'react-router-dom'
import { useTranslation } from "react-i18next";

function TableProducts({ search, props: categoriaSeleccionada, productos }) {
    const { t } = useTranslation('market'); // Cambié a 'market' para coincidir con tus namespaces
    const navigate = useNavigate();
    const filtroBusqueda = (search || '').toLowerCase();

    // Filtramos los productos que vienen del backend
    const productosFiltrados = productos.filter((servicio) => {
        // Usamos los nombres de campos de tu DB: .name y .category_id
        const coincideNombre = servicio.name?.toLowerCase().includes(filtroBusqueda);
        const coincideCategoria = !categoriaSeleccionada || servicio.category_id === categoriaSeleccionada;
        return coincideNombre && coincideCategoria;
    });

    return (
        <>
            {productosFiltrados.map(item => (
                <div 
                    key={item.id} 
                    // IMPORTANTE: '/producto/' en minúsculas para coincidir con main.jsx
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
            ))}
        </>
    );
}

export default TableProducts;