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

import Posts from "./pages/school_updates/Posts";
import CreatePost from "./pages/school_updates/CreatePost";
import EditPost from "./pages/school_updates/EditPost";
import ReviewPosts from "./pages/school_updates/ReviewPosts";
import PublishPost from "./pages/school_updates/PublishPost";
import ReviewDetails from "./pages/school_updates/ReviewDetails";
import ProtectedRoute from "./components/ProtectedRoute";




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
    
    { path: '/', element:  <DefaultLayout />,
        children: [
            { path: "dashboard", element: <Dashboard /> },
            { path: "create-user", element: <CreateUser /> },
            { path: "trusted-devices", element: <TrustedDevices /> },
            { path: 'change-current-password', element: <ChangePassword /> },

            //Comms Path
            { path:"posts", element:<ProtectedRoute requiredRole="comms"><CreatePost /></ProtectedRoute> },

            { path:"posts/create", element:<ProtectedRoute requiredRole="comms"><CreatePost /></ProtectedRoute> },
            {  path:"posts/edit/:id", element:<ProtectedRoute requiredRole="comms"><EditPost /></ProtectedRoute> },
            { path:"posts/publish", element:<ProtectedRoute requiredRole="comms"><PublishPost /></ProtectedRoute> },

            //School Admin Path
            { path:"posts/review", element:<ProtectedRoute requiredRole="scadmin"><ReviewPosts /></ProtectedRoute> },
            { path:"posts/review/:id", element:<ProtectedRoute requiredRole="scadmin"><ReviewDetails /></ProtectedRoute> },

        ],
    },
   // { path:"/unauthorized", element: <h1>Unauthorized Access</h1> /> }


    
])

export default router;