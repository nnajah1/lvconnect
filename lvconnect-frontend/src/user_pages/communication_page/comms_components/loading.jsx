import { useState, useEffect } from "react";
import { AiOutlineReload } from "react-icons/ai";
import "../comms_styling/loadingpage.css"

const LoadingPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="loadingpage-overlay">
        <div className="loadingpage-container">
          <AiOutlineReload className="loadingpage-icon" />
          <p className="loadingpage-text">Loading, please wait...</p>
        </div>
      </div>
    );
  }

  return null; 
};

export default LoadingPage;
