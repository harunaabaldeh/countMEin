import { Outlet } from "react-router-dom";
import ScrollToTop from "./app/layout/ScrollToTop";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-confirm-alert/src/react-confirm-alert.css";

const App = () => {
  return (
    <>
      <ScrollToTop />
      <Outlet />
      <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} />
    </>
  );
};

export default App;
