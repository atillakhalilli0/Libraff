import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
   const isLoggedIn = localStorage.getItem("loggedin") === "true";
   return isLoggedIn ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
