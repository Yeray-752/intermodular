import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";

export default function RatingSystem({ id_producto, userid_producto }) {
    const { t } = useTranslation("rating");
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);

    // 1. Cargar reviews al montar el componente o cambiar el producto
    useEffect(() => {
        if (id_producto) {
            fetchRatings();
        }
    }, [id_producto]);

    const fetchRatings = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/rating/${id_producto}`);
            if (!res.ok) throw new Error("Error al obtener valoraciones");
            const data = await res.json();
            setReviews(data);

            // Auto-rellenar si el usuario ya tiene una opinión
            const myReview = data.find(r => Number(r.id_usuario) === Number(userid_producto));
            if (myReview) {
                setComment(myReview.comment);
                setRating(myReview.rating);
            }
        } catch (err) {
            console.error("Error en fetchRatings:", err);
        }
    };

    // 2. Función de envío corregid_productoa
    const handleSend = async () => {
        // 1. Forzamos la conversión a número para evitar el NULL en el backend
        const productid_productoNum = Number(id_producto);

        console.log("Datos a enviar:", { productid_productoNum, rating, comment });

        if (!productid_productoNum || isNaN(productid_productoNum)) {
            alert("Error: No se ha detectado el producto actual.");
            return;
        }

        try {
            const res = await fetch(`http://localhost:3000/api/rating`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    id_producto: productid_productoNum, // Nombre exacto que espera el backend
                    rating: rating,
                    comment: comment
                })
            });

            if (res.ok) {
                alert("¡Opinión enviada!");
                fetchRatings(); // Refresca la lista
            } else {
                const data = await res.json();
                alert("Error del servid_productoor: " + data.error);
            }
        } catch (err) {
            alert("Error de conexión: " + err.message);
        }
    };
    return (
        <div className='mx-8 my-10'>
            <div className="grid_producto grid_producto-cols-1 lg:grid_producto-cols-2 gap-12 items-start">

                {/* FORMULARIO */}
                <div className="card bg-base-100 shadow-xl border border-base-200">
                    <div className="card-body">
                        <h2 className="card-title text-2xl mb-4">{t("opinion_title")}</h2>

                        <p className="text-sm opacity-70 mb-2">Tu puntuación:</p>
                        <div className="rating rating-lg rating-half mb-6">
                            <input type="radio" name="rating-main" className="rating-hidden" />
                            {[...Array(10)].map((_, i) => (
                                <input
                                    key={i}
                                    type="radio"
                                    name="rating-main"
                                    className={`mask mask-star-2 bg-amber-400 ${i % 2 === 0 ? 'mask-half-1' : 'mask-half-2'}`}
                                    onChange={() => setRating((i + 1) / 2)}
                                    checked={rating === (i + 1) / 2}
                                />
                            ))}
                        </div>

                        <div className="form-control">
                            <textarea
                                className="textarea textarea-bordered h-32 text-base"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder={t("placeholder_textarea")}
                            />
                        </div>

                        <div className="card-actions justify-end mt-4">
                            <button
                                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                                onClick={handleSend}
                                disabled={loading}
                            >
                                {loading ? "Enviando..." : t("btn_send")}
                            </button>
                        </div>
                    </div>
                </div>

                {/* LISTADO DE REVIEWS */}
                <div className='flex flex-col gap-6'>
                    <h3 className="text-xl font-bold px-2">Opiniones de otros usuarios</h3>
                    {reviews.length === 0 ? (
                        <div className="alert bg-base-200">No hay valoraciones aún. ¡Sé el primero!</div>
                    ) : (
                        reviews.map((rev) => (
                            /* 1. Usamos rev.id (el de la valoración) como key única */
                            <div key={rev.id} className='card bg-base-100 shadow-md border border-base-200'>
                                <div className='p-5'>
                                    <div className='flex justify-between items-center mb-3'>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar placeholder">
                                                <div className="bg-neutral text-neutral-content rounded-full w-8">
                                                    {/* 2. Mostramos la inicial del nombre real */}
                                                    <span>{rev.nombre?.charAt(0).toUpperCase()}</span>
                                                </div>
                                            </div>
                                            {/* 3. Cambiamos username por nombre y apellidos */}
                                            <span className='font-bold'>{rev.nombre} {rev.apellidos}</span>
                                        </div>

                                        <div className="rating rating-sm rating-half pointer-events-none">
                                            {[...Array(10)].map((_, i) => (
                                                <input
                                                    key={i}
                                                    type="radio"
                                                    name={`rating-list-${rev.id}`} /* Name único por fila */
                                                    className={`mask mask-star-2 bg-amber-400 ${i % 2 === 0 ? 'mask-half-1' : 'mask-half-2'}`}
                                                    checked={Math.round(rev.rating * 2) === (i + 1)}
                                                    readOnly
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <p className='text-left text-base-content/80 italic'>
                                        "{rev.comment}"
                                    </p>

                                    <div className="flex justify-between items-center mt-4">
                                        <span className="text-xs opacity-50">
                                            {new Date(rev.created_at).toLocaleDateString()}
                                        </span>
                                        {/* 4. Verificación de si es el comentario del usuario logueado */}
                                        {rev.id_usuario === userid_producto && (
                                            <div className="badge badge-outline badge-info text-xs">Tu comentario</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}