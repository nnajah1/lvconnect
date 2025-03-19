
import { BrowserRouter, Routes, Route, RouterProvider } from 'react-router-dom';

import './index.css';
import router from './router.jsx'

export default function App() {

  return (
 
    <RouterProvider router={router}/>
  );
}
