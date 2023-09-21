import { Navigate, Outlet, useLocation } from "react-router-dom";

function AttendanceRoutes() {
  const location = useLocation();

  const queryParams = new URLSearchParams(window.location.search);
  const linkToken = queryParams.get("linkToken");
  const localStorageLinkToken = localStorage.getItem("linkToken");

  if (
    (!localStorageLinkToken && !linkToken) ||
    (localStorageLinkToken?.split(".").length !== 3 &&
      linkToken?.split(".").length !== 3)
  ) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return <Outlet />;
}
export default AttendanceRoutes;
