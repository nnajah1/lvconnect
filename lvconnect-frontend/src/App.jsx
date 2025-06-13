
import { RouterProvider } from 'react-router-dom';

import './index.css';
import router from './router.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './context/themeContext';

export default function App() {

  return (
   <ThemeProvider storageKey="theme" defaultTheme="light">
     <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />
   </ThemeProvider>
  );
}
