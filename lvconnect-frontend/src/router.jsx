import { createBrowserRouter, Navigate } from "react-router-dom";import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import CreateUser from "./pages/CreateUser";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import TrustedDevices from "./pages/TrustedDevices";
import OAuthCallback from "./pages/OAuthCallback";
import OTPVerification from "./pages/OTPVerification";
import ChangePassword from "./pages/ChangePassword";
import MustChangePassword from "./pages/MustChangePassword";

const router = createBrowserRouter ([
    { path: '/', element: <Navigate to="/login" /> },

    { path: '/google-auth-success', element: <OAuthCallback /> },

    {
        path: '/otp', element: <OTPVerification />,
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

    { path: '/change-password', element: <MustChangePassword /> },
    
    {
        path: '/',
        element:  <DefaultLayout />,
        children: [
            { path: "dashboard", element: <Dashboard /> },
            { path: "create-user", element: <CreateUser /> },
            { path: "trusted-devices", element: <TrustedDevices /> },
            { path: 'change-current-password', element: <ChangePassword /> },
           

        ],
    }
    
])

export default router;