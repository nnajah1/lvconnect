import { createBrowserRouter, Navigate } from "react-router-dom";
import DefaultLayout from "@/components/DefaultLayout";
import GuestLayout from "@/components/GuestLayout";
import CreateUser from "@/pages/main/CreateUser";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/authentication/Login";
import TrustedDevices from "@/pages/main/TrustedDevices";
import OAuthCallback from "@/pages/authentication/OAuthCallback";
import OTPVerification from "@/pages/authentication/OTPVerification";
import ChangePassword from "@/pages/main/ChangePassword";
import MustChangePassword from "@/pages/authentication/MustChangePassword";
import ForgotPassword from "./pages/authentication/ForgotPassword";

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

    {
        path: '/forgot-password', element: <ForgotPassword />,
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