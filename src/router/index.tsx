import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Order from '../pages/Order/Order';
import Reservation from '../pages/Reservation/Reservation';
import ProtectedRoute from '../components/routes/ProtectedRoute';

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        path: '/order',
        element: (
            <ProtectedRoute>
                <Order />
            </ProtectedRoute>
        ),
    },
    {
        path: '/reservation',
        element: (
            <ProtectedRoute>
                <Reservation />
            </ProtectedRoute>
        ),
    },
    {
        path: '/',
        element: <Navigate to="/login" replace />,
    },
]);
