import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        // Redirect to login page but save the location they were trying to go to
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};
