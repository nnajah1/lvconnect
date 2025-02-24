import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import CreateUser from "./pages/CreateUser";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

import { createBrowserRouter, Navigate } from "react-router-dom";


const router = createBrowserRouter ([
    {
        path: '/',
        element: <Navigate to="/login" />, 
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