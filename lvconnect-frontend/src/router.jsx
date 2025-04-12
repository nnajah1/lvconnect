import { createBrowserRouter, Navigate } from "react-router-dom";
import DefaultLayout from "@/layouts/DefaultLayout";
import GuestLayout from "@/layouts/GuestLayout";
import CreateUser from "@/pages/main/CreateUser";
import Login from "@/pages/authentication/Login";
import TrustedDevices from "@/pages/main/TrustedDevices";
import OAuthCallback from "@/pages/authentication/OAuthCallback";
import OTPVerification from "@/pages/authentication/OTPVerification";
import ChangePassword from "@/pages/main/ChangePassword";
import MustChangePassword from "@/pages/authentication/MustChangePassword";
import ForgotPassword from "./pages/authentication/ForgotPassword";

import Posts from "./pages/admins/comms/Posts";
import CreatePost from "./pages/admins/comms/CreatePost";
import EditPost from "./pages/admins/comms/EditPost";
import ReviewPosts from "./pages/admins/comms/ReviewPosts";
import PublishPost from "./pages/admins/comms/PublishPost";
import ReviewDetails from "./pages/admins/comms/ReviewDetails";
import ProtectedRoute from "./layouts/ProtectedRoute";
import UserDashboard from "@/pages/student/UserDashboard";
import AdminDashboard from "./pages/admins/AdminDashboard";
import ArchivePosts from "./pages/admins/comms/ArchivePosts";
import Updates from "./user_pages/communication_page/updates";
import Sidebar from "./user_pages/communication_page/apps";
import PsasDashboard from "./pages/admins/psas/AdminDashboard";
import Forms from "./pages/admins/psas/Forms";




const router = createBrowserRouter([
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
        path: '/', element: <DefaultLayout />,
        children: [
            { path: "create-user", element: <CreateUser /> },
            { path: "trusted-devices", element: <TrustedDevices /> },
            { path: 'change-current-password', element: <ChangePassword /> },

            {
                path: "dashboard", element: <ProtectedRoute allowedRoles={['student']} />, // Only users can access
                children: [
                    { index: true, element: <UserDashboard /> }, // User dashboard
                ],
            },

            {
                path: "comms-admin",
                element: <ProtectedRoute allowedRoles={["comms"]} />,
                children: [
                    { index: true, element: <AdminDashboard /> },
                    { path: "posts", element: <Posts /> },
                    { path: "archive", element: <ArchivePosts /> },
                ],
            },
            {
                path: "school-admin",
                element: <ProtectedRoute allowedRoles={["scadmin"]} />,
                children: [
                    { index: true, element: <AdminDashboard /> },
                    { path: "posts", element: <Posts /> },
                    { path: "archive", element: <ArchivePosts /> },
                ],
            },
            {
                path: "psas-admin",
                element: <ProtectedRoute allowedRoles={["psasadmin"]} />,
                children: [
                    { index: true, element: <PsasDashboard /> },
                    { path: "forms", element: <Forms /> },
                    { path: "archive", element: <ArchivePosts /> },
                ],
            },


            { path: "posts/create", element: <ProtectedRoute allowedRoles={["comms"]}><CreatePost /></ProtectedRoute> },
            { path: "posts/edit/:id", element: <ProtectedRoute allowedRoles={["comms"]}><EditPost /></ProtectedRoute> },
            { path: "posts/publish", element: <ProtectedRoute allowedRoles={["comms"]}><PublishPost /></ProtectedRoute> },

            //School Admin Path
            { path: "posts/review", element: <ProtectedRoute allowedRoles={["scadmin"]}><ReviewPosts /></ProtectedRoute> },
            { path: "posts/review/:id", element: <ProtectedRoute allowedRoles={["scadmin"]}><ReviewDetails /></ProtectedRoute> },

        ],
    },
    { path: "/unauthorized", element: <h1>Unauthorized Access</h1> },
    { path: "/trial", element: <Updates /> },
    { path: "/app", element: <Sidebar /> }



])

export default router;