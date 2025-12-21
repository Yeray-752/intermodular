import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

function TableProducts({ search, props: categoriaSeleccionada, productos }) {
    const { t } = useTranslation('product');
    const navigate = useNavigate();
    const filtroBusqueda = (search || '').toLowerCase();

    // Filtramos los productos que vienen del padre
    const productosFiltrados = productos.filter((servicio) => {
        const coincideNombre = servicio.nombre.toLowerCase().includes(filtroBusqueda);
        const coincideCategoria = !categoriaSeleccionada || servicio.categoria === categoriaSeleccionada;
        return coincideNombre && coincideCategoria;
    });

    return (
        <>
            {productosFiltrados.map(servicios => (
                <div key={servicios.id} onClick={() => navigate(`/Producto/${servicios.id}`)} className='card bg-base-100 shadow-xl w-80 flex flex-col cursor-pointer hover:shadow-2xl transition-all duration-300'>
                    <figure className="h-[140px] w-[250px]">
                        <img src={servicios.imagen} alt={servicios.nombre} className="h-[150px] w-[250px] object-contain" />
                    </figure>
                    <div className="card-body p-2 grow flex flex-col items-center text-center">
                        <h2 className="card-title text-lg text-center mb-2">{servicios.nombre}</h2>
                        <div className="border-t border-gray-200 pt-3 w-full">
                            <div className="card-actions items-center grid grid-cols-2">
                                <p>{t('price')}: <span className='text-xl font-extrabold text-orange-600'>{servicios.precio}€</span></p>
                                <p>{t('stock')}: <span className='text-xl font-extrabold text-orange-600'>{servicios.stock}</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}

export default TableProducts;