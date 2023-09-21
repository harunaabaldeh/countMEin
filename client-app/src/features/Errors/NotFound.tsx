import { Link, useLocation } from "react-router-dom";

function NotFound() {
  const location = useLocation();

  return (
    <div className="bg-purple-900 absolute top-0 left-0 bg-gradient-to-b from-gray-500 via-gray-500 to-slate-700 bottom-0 leading-5 h-full w-full ">
      <div className="bg-purple-900 absolute top-0 left-0 bg-gradient-to-b from-gray-500 via-gray-500 to-slate-700 bottom-0 leading-5 h-full w-full overflow-hidden"></div>

      <div className="relative min-h-screen  sm:flex sm:flex-row  justify-center bg-transparent rounded-3xl shadow-xl">
        <div className="w-9/12 m-auto py-16 min-h-screen flex items-center justify-center">
          <div className="bg-slate-500 opacity-50 shadow overflow-hidden sm:rounded-lg pb-8 z-10">
            <div className=" text-center pt-8">
              <h1 className="text-9xl font-bold text-purple-400">404</h1>
              <h1 className="text-6xl font-medium py-8">
                oops! Page not found
              </h1>
              <p className="text-2xl pb-8 px-12 font-medium text-white">
                Oops! The page you are looking for does not exist. It might have
                been moved or deleted.
              </p>
              <Link
                to={(location.state as any)?.from ?? "/login"}
                className="my-4 bg-slate-500 hover:bg-slate-700 text-white text-base rounded-lg py-2.5 px-5 transition-colors w-full text-[19px] md:w-1/4 mx-auto"
              >
                Take Me Back Home
              </Link>{" "}
            </div>
          </div>
        </div>
      </div>
      <svg
        className="absolute bottom-0 left-0 "
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
      >
        <path
          fill="#fff"
          fillOpacity="1"
          d="M0,0L40,42.7C80,85,160,171,240,197.3C320,224,400,192,480,154.7C560,117,640,75,720,74.7C800,75,880,117,960,154.7C1040,192,1120,224,1200,213.3C1280,203,1360,149,1400,122.7L1440,96L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
        ></path>
      </svg>
    </div>
  );
}
export default NotFound;
