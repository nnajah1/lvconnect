import { useAuthContext } from "../context/AuthContext";import { Navigate, Outlet} from "react-router-dom";

export default function GuestLayout() {
     const {token} = useAuthContext();
        if(token) {
           return <Navigate to='/dashboard'/>
        }
        return (
            <div >


            
                <main>
                    <Outlet/>
                </main>
            </div>

           
      
    )
}