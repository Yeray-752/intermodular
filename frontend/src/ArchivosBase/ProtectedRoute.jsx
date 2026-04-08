import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Si hay token, renderiza las rutas que estén dentro del grupo
    return <Outlet />;
};

export default ProtectedRoute;