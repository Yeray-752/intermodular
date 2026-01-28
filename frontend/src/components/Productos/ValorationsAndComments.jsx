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

    // 2. Función de envío
    const handleSend = async () => {
        setLoading(true);
        const productIdNum = Number(id_producto);

        console.log("Datos a enviar:", { productIdNum, rating, comment });

        if (!productIdNum || isNaN(productIdNum)) {
            alert("Error: No se ha detectado el producto actual.");
            setLoading(false);
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
                    id_producto: productIdNum,
                    rating: rating,
                    comment: comment
                })
            });

            if (res.ok) {
                alert("¡Opinión enviada!");
                fetchRatings();
            } else {
                const data = await res.json();
                alert("Error del servidor: " + data.error);
            }
        } catch (err) {
            alert("Error de conexión: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* FORMULARIO - Cambiado a bg-base-100 */}
            <div className="space-y-6 rounded-xl p-8 shadow-lg bg-base-100 border border-base-300">

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </div>
                    <p className="text-lg font-semibold text-base-content">{t("opinion_title")}</p>
                </div>

                <div>
                    <label className="text-xs font-medium text-base-content/70 mb-2 block">
                        {t('puntuacion')}
                    </label>
                    <div className="rating rating-lg gap-2">
                        {[1, 2, 3, 4, 5].map(n => (
                            <input
                                key={n}
                                type="radio"
                                name="rating-main"
                                className="mask mask-star-2 bg-amber-400 hover:bg-amber-500 transition-colors duration-200"
                                checked={rating === n}
                                onChange={() => setRating(n)}
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-xs font-medium text-base-content/70 mb-2 block">
                        {t("placeholder_textarea")}
                    </label>
                    <textarea
                        className="textarea textarea-bordered w-full min-h-[120px] focus:textarea-primary transition-all duration-200 bg-base-100 text-base-content"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder={t("placeholder_textarea")}
                    />
                </div>

                <button
                    className={`btn btn-primary w-full shadow-md hover:shadow-lg transition-all duration-200 ${loading ? 'loading' : ''}`}
                    onClick={handleSend}
                    disabled={loading || rating === 0}
                >
                    {loading ? "Enviando..." : t("btn_send")}
                </button>
            </div>

            {/* LISTA OPINIONES */}
            <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-base-content">
                        {t('opinion')} ({reviews.length})
                    </h3>
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">

                    {reviews.length === 0 && (
                        <div className="text-center py-12 bg-base-200 rounded-xl">
                            <svg className="w-16 h-16 text-base-content/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <p className="text-sm text-base-content/50 italic">
                                {t('noOpinion')}
                            </p>
                        </div>
                    )}

                    {reviews.map((rev) => (
                        <div
                            key={rev.id}
                            className="bg-base-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 border border-base-300"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="text-sm font-semibold text-primary">
                                            {rev.nombre?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-base-content text-sm">
                                            {rev.nombre} {rev.apellidos}
                                        </p>
                                        <p className="text-xs text-base-content/50">
                                            {new Date(rev.created_at).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className="rating rating-sm pointer-events-none">
                                        {[1, 2, 3, 4, 5].map(n => (
                                            <input
                                                key={n}
                                                type="radio"
                                                name={`rating-list-${rev.id}`}
                                                className="mask mask-star-2 bg-amber-400"
                                                checked={Math.round(rev.rating) === n}
                                                readOnly
                                            />
                                        ))}
                                    </div>
                                    {rev.id_usuario === userid_producto && (
                                        <div className="badge badge-info badge-outline text-[10px] uppercase font-bold">Tu comentario</div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-base-200/50 p-3 rounded-lg border border-base-300/50">
                                {/* Cambiado bg-white por bg-base-100 para que no brille en modo oscuro */}
                                <p className="text-sm text-base-content/90 bg-base-100 rounded-lg p-3 leading-relaxed italic break-words whitespace-pre-wrap">
                                    {rev.comment}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}