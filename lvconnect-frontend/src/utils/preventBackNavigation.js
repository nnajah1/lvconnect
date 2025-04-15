import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const preventBackNavigation = (shouldPreventBack) => {
    const location = useLocation();

    useEffect(() => {
        if (shouldPreventBack) {
            window.history.pushState(null, "", window.location.href);
            const handleBackButton = () => {
                window.history.pushState(null, "", window.location.href);
            };

            window.addEventListener("popstate", handleBackButton);

            return () => {
                window.removeEventListener("popstate", handleBackButton);
            };
        }
    }, [shouldPreventBack, location]);
};

export default preventBackNavigation;
