import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

function TableProducts({ search, categoriaId, productos }) {
    const { t } = useTranslation('market');
    const navigate = useNavigate();

    const productosFiltrados = useMemo(() => {
        const filtro = (search || '').toLowerCase();
        return (productos || []).filter((item) => {
            const coincideNombre = item.name?.toLowerCase().includes(filtro);
            const coincideCategoria = !categoriaId || item.category_id === categoriaId;
            return coincideNombre && coincideCategoria;
        });
    }, [search, categoriaId, productos]);

    return (
        <>
            {productosFiltrados.length > 0 ? (
                productosFiltrados.map(item => (
                    <div 
                        key={item.id} 
                        onClick={() => navigate(`/producto/${item.id}`)} 
                        className="group h-100 sm:h-full sm:w-full bg-white rounded-xl border border-gray-100 hover:border-indigo-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
                    >
                        {/* IMAGEN: Tamaño fijo escalado al contenedor */}
                        <div className="relative h-75 sm:h-60 aspect-square w-full bg-white p-3 overflow-hidden">
                            <img 
                                src={item.image_url} 
                                alt={item.name} 
                                className="h-60 w-full object-contain group-hover:scale-110 transition-transform duration-500" 
                            />
                            
                            {/* Stock: Color Indigo (como la duración en Reservas) */}
                            <div className="absolute top-2 left-2">
                                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm ${
                                    item.stock > 0 ? 'bg-indigo-600 text-white' : 'bg-slate-400 text-white'
                                }`}>
                                    {item.stock > 0 ? `STOCK: ${item.stock}` : 'AGOTADO'}
                                </span>
                            </div>
                        </div>

                        {/* CONTENIDO: Colores de TableReservations */}
                        <div className="p-4 h-30 sm:h-35 flex flex-col grow bg-white">
                            <h2 className="text-slate-800 font-bold text-sm md:text-base line-clamp-2 h-10 md:h-12 mb-2 group-hover:text-indigo-600 transition-colors">
                                {item.name}
                            </h2>
                            
                            <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
                                {/* Precio en Naranja (como en Reservas) */}
                                <span className="text-lg md:text-xl font-black text-orange-500">
                                    {item.price}<span className="text-sm ml-0.5">€</span>
                                </span>
                                
                                {/* Botón con color Indigo */}
                                <button className="p-2 rounded-full bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="col-span-full py-10 text-center w-full">
                    <p className="text-slate-400 text-sm italic">{t('noProductsFound')}</p>
                </div>
            )}
        </>
    );
}

export default TableProducts;