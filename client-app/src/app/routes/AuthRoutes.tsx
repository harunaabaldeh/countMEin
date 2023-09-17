import { Navigate, Outlet, useLocation } from "react-router-dom";

function AuthRoutes() {
  const location = useLocation();

  if (!localStorage.getItem("user")) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return <Outlet />;
}
export default AuthRoutes;
