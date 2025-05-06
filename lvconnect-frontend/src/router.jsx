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
import ProtectedRoute from "./layouts/ProtectedRoute";
import UserDashboard from "@/pages/student/UserDashboard";
import AdminDashboard from "./pages/admins/AdminDashboard";
import ArchivePosts from "./pages/admins/comms/ArchivePosts";
import PsasDashboard from "./pages/admins/psas/AdminDashboard";
import Forms from "./pages/admins/psas/Forms";
import FormView from "./components/school_forms/userSubmitForm";
import VisibleForms from "./pages/student/UserSchoolForm";
import StudentView from "./components/school_forms/userSubmitForm";
import Surveys from "./pages/admins/psas/Surveys";
import VisibleSurveys from "./pages/student/UserSurvey";
import CreateNewFormsz from "./Psas_pages/schoolforms/create_forms/create_new_forms";




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
                path: "/", element: <ProtectedRoute allowedRoles={['student']} />, // Only users can access
                children: [
                    { index: true, path: "dashboard", element: <UserDashboard /> }, 
                    { path: "surveys", element: <VisibleSurveys/> }, 
                    { path: "student-services", element: <VisibleForms /> }, 
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
                element: <ProtectedRoute allowedRoles={["psas"]} />,
                children: [
                    { index: true, element: <PsasDashboard /> },
                    { path: "forms", element: <Forms /> },
                    { path: "surveys", element: <Surveys /> },
                ],
            },

        ],
    },
    { path: "/unauthorized", element: <h1>Unauthorized Access</h1> },
    { path: "/trial", element: <StudentView /> },
    { path: "/app", element: <CreateNewFormsz /> }



])

export default router;