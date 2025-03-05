import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import CreateUser from "./pages/CreateUser";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

import { createBrowserRouter, Navigate } from "react-router-dom";
import OAuthCallback from "./pages/OAuthCallback";


const router = createBrowserRouter ([
    {
        path: '/',
        element: <Navigate to="/login" />,
    },

    {
        path: '/google-auth-success',
        element: <OAuthCallback />
    },

    {
        path: '/login',
        element: <GuestLayout />,
        children: [
            {
                path: '',
                element: <Login />,
            },
           
        ],
    },

    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            {
                path: '/dashboard',
                element: <Dashboard />,
            },
            { 
                path: "/create-user", 
                element: <CreateUser /> 
            },
        ],
    },
    
])

export default router;