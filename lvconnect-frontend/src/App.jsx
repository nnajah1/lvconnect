
import { RouterProvider } from 'react-router-dom';

import './index.css';
import router from './router.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './context/themeContext';
import { LoadingProvider } from './context/LoadingContext';

export default function App() {

  return (
    <ThemeProvider storageKey="theme" defaultTheme="light">
      <LoadingProvider>
        <RouterProvider router={router} />
        <ToastContainer position="top-right" autoClose={3000} />
      </LoadingProvider>
    </ThemeProvider>
  );
}
