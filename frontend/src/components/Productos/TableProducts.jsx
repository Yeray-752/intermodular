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
                        className="group h-100 sm:h-full sm:w-full bg-base-100 rounded-xl shadow-sm hover:shadow-xl cursor-pointer overflow-hidden flex flex-col"
                    >
                        {/* IMAGEN: Tamaño fijo escalado al contenedor */}
                        <div className="relative h-75 sm:h-60 aspect-square w-full p-3 overflow-hidden text-base-content">
                            <img
                                src={item.image_url}
                                alt={item.name}
                                className="h-60 w-full object-contain group-hover:scale-110 transition-transform duration-500"
                            />

                            {/* Stock: Usando primary para el azul-indigo y base-400 para el neutro */}
                            <div className="absolute top-2 left-2">
                                {item.stock === 0 && (
                                    <span className="text-[11px] font-bold px-2 py-0.5 bg-neutral-content rounded-full shadow-sm">
                                        AGOTADO
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* CONTENIDO: Colores adaptables */}
                        <div className="p-4 h-30 sm:h-35 flex flex-col grow bg-base-100 text-base-content">
                            <h2 className="font-bold text-sm md:text-base line-clamp-2 h-10 md:h-12 mb-2 group-hover:text-primary transition-colors">
                                {item.name}
                            </h2>

                            <div className="mt-auto flex items-center justify-between pt-3 border-t border-base-300">
                                {/* Precio en color Warning (Naranja/Amarillo adaptable) */}
                                <span className="text-lg md:text-xl font-black text-secondary">
                                    {item.price}<span className="text-sm ml-0.5">€</span>
                                </span>

                                {/* Botón con colores de tema */}
                                <button className="p-2 rounded-full bg-primary/10 text-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="col-span-full py-10 text-center w-full">
                    <p className="text-base-content/50 text-sm italic">{t('noProductsFound')}</p>
                </div>
            )}
        </>
    );
}

export default TableProducts;