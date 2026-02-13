import React, { memo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../common/Loader';

const ProtectedRoute = memo(({ children, adminOnly = false }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();

    if (loading) return <Loader fullScreen message="Authenticating..." />;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />;

    return children;
});

ProtectedRoute.displayName = 'ProtectedRoute';
export default ProtectedRoute;
