import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const MissionPage = lazy(() => import('./pages/MissionPage'));

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const Loader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="inline-block w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin mb-3" />
      <p className="text-sm text-gray-400">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mission/:id"
          element={
            <ProtectedRoute>
              <MissionPage />
            </ProtectedRoute>
          }
        />
        {/* Redirect old routes to dashboard */}
        <Route path="/upload" element={<Navigate to="/dashboard" replace />} />
        <Route path="/reports" element={<Navigate to="/dashboard" replace />} />
        <Route path="/report/:id" element={<Navigate to="/dashboard" replace />} />
        <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;