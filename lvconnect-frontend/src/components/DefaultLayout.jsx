import { useAuthContext } from "../context/AuthContext";
import { Outlet, Link, Navigate } from "react-router-dom";


export default function DefaultLayout() {
    const {user, token, logout } = useAuthContext();
    if(!token) {
       return <Navigate to='/login'/>
    }



    return (
        <div id="defaultLayout">
            <div className="content">
                <header>
                    <div>
                        {user.name}
                    </div>
                    <div>
                        <a href="#" onClick={logout}>logout</a>
                    </div>
                </header>

                <main>
                    <Outlet/>
                </main>
            </div>


        </div>
           
     
    )
}