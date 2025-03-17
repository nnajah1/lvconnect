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

import Posts from "./pages/school_updates/Posts";
import CreatePost from "./pages/school_updates/CreatePost";
import EditPost from "./pages/school_updates/EditPost";
import ReviewPosts from "./pages/school_updates/ReviewPosts";
import PublishPost from "./pages/school_updates/PublishPost";
import ReviewDetails from "./pages/school_updates/ReviewDetails";


const router = createBrowserRouter ([
    { path: '/', element: <Navigate to="/login" /> },

    { path: '/google-auth-success', element: <OAuthCallback /> },

    { path: '/otp', element: <OTPVerification />,},

    { path: '/login', element: <GuestLayout />,
        children: [{ path: '', element: <Login />,}]
    },

    { path: '/change-password', element: <MustChangePassword /> },
    
    { path: '/', element:  <DefaultLayout />,
        children: [
            { path: "dashboard", element: <Dashboard /> },
            { path: "create-user", element: <CreateUser /> },
            { path: "trusted-devices", element: <TrustedDevices /> },
            { path: 'change-current-password', element: <ChangePassword /> },

            //Comms Path
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