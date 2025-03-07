import { useAuthContext } from "../context/AuthContext";
import { Navigate, Outlet} from "react-router-dom";

export default function GuestLayout() {
     const {user} = useAuthContext();
        if(user) {
           return <Navigate to='/dashboard' replace />
        }
        return (
            <div >


            
                <main>
                    <Outlet/>
                </main>
            </div>

           
      
    )
}