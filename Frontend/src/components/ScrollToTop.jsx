import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll smoothly to the top when the route changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);

  return null;
};

export default ScrollToTop;
