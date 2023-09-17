import { NavLink, Outlet, useNavigate } from "react-router-dom";

function UserProfile() {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto">
      <div className="bg-white relative rounded-lg w-full md:w-11/12 mx-auto">
        <div className="w-full md:w-11/12 mx-auto flex justify-center items-center">
          <div className="flex justify-center">
            <img
              src="/images/fabala.jpg"
              alt=""
              className="rounded-full mx-auto w-20 h-20 shadow-md border-4 border-white transition duration-200 transform hover:scale-110"
            />
          </div>
          <div className="flex flex-col justify-center items-center ml-2">
            <h1 className="font-bold text-center text-xl text-gray-900">
              Fabala Dibbasey
            </h1>
            <p
              onClick={() => {
                localStorage.removeItem("user");
                navigate("/");
              }}
              className="text-center text-slate-500 text-sm cursor-pointer hover:text-red-600 transition-colors leading-5 tracking-widest "
            >
              Logout
            </p>
          </div>
        </div>

        <div className="w-full md:w-11/12 mx-auto">
          <div className="flex justify-between items-center my-2 px-4">
            <NavLink
              to="/user-profile/current-session"
              className={({ isActive }) =>
                isActive
                  ? "w-1/4 text-gray-200 block rounded-lg text-center font-medium leading-6 px-6 py-3 bg-slate-600 hover:bg-slate-700 hover:text-white"
                  : "text-gray-500 hover:text-gray-900 shadow-sm hover:bg-gray-100 rounded transition duration-150 ease-in font-medium text-sm text-center py-3" +
                    " w-1/4"
              }
            >
              Current Session
            </NavLink>
            {/* <div className="my-5 px-6 w-3/4"> */}
            <NavLink
              to="/user-profile/generate-qr-code"
              className={({ isActive }) =>
                isActive
                  ? "w-1/3 text-gray-200 block rounded-lg text-center font-medium leading-6 px-6 py-3 bg-slate-600 hover:bg-slate-700 hover:text-white"
                  : "text-gray-500 hover:text-gray-900 shadow-sm hover:bg-gray-100 rounded transition duration-150 ease-in font-medium text-sm text-center py-3" +
                    " w-1/3"
              }
            >
              Generate <span className="font-bold">QRCode</span>
            </NavLink>
            {/* </div> */}
            <NavLink
              to="/user-profile/session-history"
              className={({ isActive }) =>
                isActive
                  ? "w-1/4 text-gray-200 rounded-lg text-center font-medium leading-6 px-6 py-3 bg-slate-600 hover:bg-slate-700 hover:text-white"
                  : "text-gray-500 hover:text-gray-900 shadow-sm hover:bg-gray-100 rounded transition duration-150 ease-in font-medium text-sm text-center py-3" +
                    " w-1/4"
              }
            >
              Session History
            </NavLink>
          </div>
        </div>

        <div className="w-full md:w-11/12 mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
export default UserProfile;
