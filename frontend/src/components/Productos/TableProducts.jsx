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
                        className="bg-info text-base-content rounded-2xl shadow-md hover:shadow-xl w-full max-w-[320px] flex flex-col p-5 cursor-pointer transition-all duration-300 group"
                    >
                        {/* Contenedor de Imagen (Igual que servicios) */}
                        <div className="relative mb-4">
                            <img
                                src={`${import.meta.env.VITE_API_URL}${item.image_url}`}
                                alt={item.name}
                                className="h-44 w-full object-contain bg-base-300-100 rounded-xl group-hover:scale-105 transition-transform duration-500"
                            />

                            <div className="absolute top-2 left-2">
                                {item.stock === 0 && (
                                    <span className="text-[11px] font-bold px-2 py-0.5 bg-base-300-content rounded-full shadow-sm">
                                        {t('outOfStock')}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Contenido (Igual que servicios) */}
                        <div className="flex flex-col grow">
                            <h2 className="text-lg font-bold mb-2 text-base-content line-clamp-1 group-hover:text-primary transition-colors">
                                {item.name}
                            </h2>

                            {/* Usamos un espacio para descripción o categoría si la tienes */}
                            <p className="text-sm text-base-content/70 font-medium mb-4 line-clamp-3 h-14">
                                {item.description || t('Descripción del producto no disponible.')}
                            </p>

                            <div className="mt-auto">
                                {/* Sección de nivel/estado (opcional, puedes quitarlo si no aplica) */}

                                {/* Footer de la Card: Precio y Botón Ver */}
                                <div className="flex items-center justify-between pt-4 border-t border-base-300">
                                    <span className="text-2xl font-extrabold text-secondary">
                                        {item.price}€
                                    </span>

                                    <button className="btn btn-primary btn-sm text-base-100 text-lg rounded-full px-6">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
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