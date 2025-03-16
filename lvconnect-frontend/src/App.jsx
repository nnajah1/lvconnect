
import { BrowserRouter, Routes, Route, RouterProvider } from 'react-router-dom';
import Layout from "./components/DefaultLayout";
import Dashboard from "./pages/Dashboard";
import './index.css';
import Login from './pages/Login';
import CreateUser from './pages/CreateUser';
import router from './router.jsx'

export default function App() {

  return (
 
    <RouterProvider router={router}/>
  );
}
