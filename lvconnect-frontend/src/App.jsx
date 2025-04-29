
import { RouterProvider } from 'react-router-dom';

import './index.css';
import router from './router.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
