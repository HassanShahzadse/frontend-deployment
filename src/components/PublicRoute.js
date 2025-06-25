import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  let isAuthenticated = false;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decoded.exp && decoded.exp > now) {
        isAuthenticated = true;
      } else {
        localStorage.removeItem("token");
      }
    } catch (err) {
      localStorage.removeItem("token");
    }
  }

  return isAuthenticated ? <Navigate to="/" replace /> : children;
}

export default PublicRoute;
