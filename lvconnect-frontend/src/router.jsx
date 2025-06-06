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
import ArchivePosts from "./pages/admins/comms/ArchivePosts";
import PsasDashboard from "./pages/admins/psas/AdminDashboard";
import Forms from "./pages/admins/psas/Forms";
import VisibleForms from "./pages/student/UserSchoolForm";
import StudentView from "./components/school_forms/userSubmitForm";
import Surveys from "./pages/admins/psas/Surveys";
import VisibleSurveys from "./pages/student/UserSurvey";
import SurveyResponses from "./pages/admins/psas/SurveyResponses";
import Enrollment from "./pages/registrar/Enrollment";
import Enrollees from "./pages/registrar/Enrollees";
import StudentSoa from "./pages/student/UserSOA";
import UserEnrollment from "./pages/student/UserEnrollment";
import AdminSoa from "./pages/registrar/Soa";
import StudentInformation from "./pages/registrar/StudentInformation";
import Grades from "./pages/student/UserGrade";
import NotificationsPanel from "./users_dashboards/dasboards_components/notification";
import Unauthorized from "./layouts/Unauthorized";
import ComingSoon from "./layouts/ComingSoon";
import ResetPassword from "./pages/authentication/ResetPassword";
import PrivacyPolicy  from "./layouts/PrivacyPolicy";
import { Authenticate } from "./components/dynamic/loader";
import RegistrarDashboard from "./pages/registrar/AdminDashboard";
import CommsDashboard from "./pages/admins/comms/AdminDashboard";
import SchoolAdminDashboard from "./pages/admins/scadmin/AdminDashboard";
import RoleManagement from "./pages/admins/systemAdmin/RoleManagement";
// import ErrorPage from "./layouts/error";


const router = createBrowserRouter([
    { path: '/', element: <Navigate to="/login" />, 
        // errorElement: <ErrorPage />,
    },

    { path: '/google-auth-success', element: <OAuthCallback /> },


    {
        path: '/otp', element: <OTPVerification />
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
    
    {path:"/reset-password", element: <ResetPassword />},

    {
        path: '/', element: <DefaultLayout />,
        children: [
            { path: "create-user", element: <CreateUser /> },
            { path: "trusted-devices", element: <TrustedDevices /> },
            { path: 'change-current-password', element: <ChangePassword /> },

            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: "my",
                        handle: { roles: ['student'] },
                        children: [
                            { index: true, element: <UserDashboard /> },
                            { path: "enrollment", element: <UserEnrollment mode="edit" editType="partial"/> },
                            { path: "grades", element: <Grades /> },
                            { path: "soa", element: <StudentSoa /> },
                            { path: "surveys", element: <VisibleSurveys /> },
                            { path: "student-services", element: <VisibleForms /> },
                        ],
                    },
                    {
                        path: "comms-admin",
                        handle: { roles: ['comms'] },
                        children: [
                            { index: true, element: <CommsDashboard /> },
                            { path: "posts", element: <Posts /> },
                            { path: "archive", element: <ArchivePosts /> },

                        ],
                    },
                    {
                        path: "school-admin",
                        handle: { roles: ['scadmin'] },
                        children: [
                            { index: true, element: <SchoolAdminDashboard /> },
                            { path: "posts", element: <Posts /> },
                            { path: "archive", element: <ArchivePosts /> },

                        ],
                    },
                    {
                        path: "psas-admin",
                        handle: { roles: ['psas'] },
                        children: [
                            { index: true, element: <PsasDashboard /> },
                            { path: "forms", element: <Forms /> },
                            { path: "surveys", element: <Surveys /> },
                            { path: "surveys/survey-responses/:surveyId", element: <SurveyResponses /> },

                        ],
                    },
                    {
                        path: "registrar",
                        handle: { roles: ['registrar'] },
                        children: [
                            { index: true, element: <RegistrarDashboard/> },
                            { path: "enrollment", element: <Enrollment /> },
                            { path: "enrollment/student-information/:studentId", element: <Enrollees mode="view"/> },
                            { path: "enrollment/student-information/:studentId/edit", element: <Enrollees mode="edit" editType="partial"/>},
                            { path: "student-information-management/:studentId/edit", element: <Enrollees mode="edit" editType="full"/>}, 
                            { path: "student-information-management/:studentId/view", element: <Enrollees mode="view"/>},
                            { path: "student-information-management", element: <StudentInformation /> },
                            { path: "", element: <StudentInformation /> },
                            { path: "soa", element: <AdminSoa /> },
                        ],
                    },
                    {
                        path: "system-admin",
                        handle: { roles: ['superadmin'] },
                        children: [
                            { index: true, element: <RoleManagement /> },

                        ],
                    },
                ],
            },


        ],
    },
    { path: "/privacy-policy", element: <PrivacyPolicy/> },
    { path: "/coming-soon", element: <ComingSoon/> },
    { path: "/unauthorized", element: <Unauthorized /> },



])

export default router;