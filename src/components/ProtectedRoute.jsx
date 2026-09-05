import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CircleLoader from './ui/Loader';

export const ProtectedRoute = ({ requireAdmin = false }) => {
    const { IsLogin, isAdmin, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-50">
                <CircleLoader />
            </div>
        );
    }

    if (!IsLogin) {
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && !isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
