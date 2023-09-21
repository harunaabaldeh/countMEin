import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { User } from "../models/user";

interface AuthRoutesProps {
  roles?: string[];
}

function AuthRoutes({ roles }: AuthRoutesProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const user: User = JSON.parse(localStorage.getItem("user") || "{}");

  if (!user || !user.token || user.token.split(".").length !== 3) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (roles && !roles.some((r) => user.roles?.includes(r))) {
    toast.error("You are not authorized to access this area");
    navigate(-1);
    return null;
  }

  return <Outlet />;
}
export default AuthRoutes;
