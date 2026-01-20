import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";

const AdminButton = () => {
    const token = localStorage.getItem('token');
    let isAdmin = false;

    if (token) {
        try {
            const decoded = jwtDecode(token);
            // Verificamos si el rol guardado en el token es 'admin'
            if (decoded.rol === 'admin') {
                isAdmin = true;
            }
        } catch (error) {
            console.error("Token inválido");
        }
    }

    // Si no es admin, no renderiza nada (null)
    if (!isAdmin) return null;

    return (
        <Link to="/admin/dashboard">
            <button className="
        w-full text-left px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-3
        text-base-content/70 hover:bg-base-200 hover:shadow-sm
    ">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>
                Administración
            </button>
        </Link>
    );
};

export default AdminButton;