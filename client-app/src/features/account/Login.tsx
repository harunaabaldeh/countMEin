import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { loginFormSchema } from "./accountFormSchema";
import agent from "../../app/api/agent";
import { User } from "../../app/models/user";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginFormSchema),
  });

  const [showPassword, setShowPassword] = useState(true);
  const [error, setError] = useState<string>();

  function storeUser(user: User) {
    let claims = JSON.parse(atob(user.token.split(".")[1]));
    const roles = typeof claims.role === "string" ? [claims.role] : claims.role;
    localStorage.setItem("user", JSON.stringify({ ...user, roles }));
    navigate("/user-profile");
  }

  const onSubmit = async ({ email, password }: FieldValues) => {
    try {
      const user = await agent.Account.login({ email, password });
      storeUser(user);
      toast.success("Successfully logged in");
    } catch (error) {
      console.log(error);
      setError("Invalid email or password");
    }
  };

  //google login
  useEffect(() => {
    // @ts-ignore
    google.accounts.id.initialize({
      client_id:
        "559758667407-k0a5jbbmsabs5v5e6carbuj4md1tluao.apps.googleusercontent.com",
      callback: googleLogin,
    });

    // @ts-ignore
    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "outline", size: "large" } // customization attributes
    );

    // @ts-ignore
    google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed()) {
        console.log("Prompt was not displayed");
      } else if (notification.isSkippedMoment()) {
        console.log("Prompt was skipped");
      } else if (notification.isDismissedMoment()) {
        console.log("Prompt was dismissed");
      }
    });
  }, [navigate, localStorage, window.location.search]);

  const googleLogin = async (response: any) => {
    try {
      const user = await agent.Account.googleLogin(response.credential);
      storeUser(user);
      toast.success("Successfully logged in");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-purple-900 absolute top-0 left-0 bg-gradient-to-b from-gray-500 via-gray-500 to-slate-700 bottom-0 leading-5 h-full w-full">
      <div className="bg-purple-900 absolute top-0 left-0 bg-gradient-to-b from-gray-500 via-gray-500 to-slate-700 bottom-0 leading-5 h-full w-full overflow-hidden"></div>

      <div className="relative min-h-screen  sm:flex sm:flex-row  justify-center bg-transparent rounded-3xl shadow-xl">
        <div className="flex-col flex  self-center lg:px-14 sm:max-w-4xl xl:max-w-md  z-10">
          <div className=" self-start hidden lg:flex flex-col  text-gray-300">
            <h1 className="my-3 font-semibold text-4xl">
              Revolutionize Attendance Tracking with Count Me In!
            </h1>
            <p className="pr-3 text-sm text-gray-700 bg-slate-400 bg-opacity-50 p-4">
              Say goodbye to traditional methods and hello to easy attendance
              management. Designed with University of The Gambia lecturers in
              mind, Count Me In streamlines the process. Now, students can log
              their attendance without interference, promoting fairness. The
              rule is simple: be present and scan the QR code. Join the
              attendance revolution today!
            </p>
          </div>
        </div>
        <div className="flex justify-center self-center  z-10">
          <div className="p-12 pt-2 bg-white mx-auto rounded-3xl w-96 ">
            <div className="mb-7">
              <p className="text-xl font-semibold text-gray-800 capitalize">
                To Log Attendance{" "}
              </p>
              <button className="mt-4 bg-slate-500 hover:bg-slate-700 text-white text-base rounded-lg py-2.5 px-5 transition-colors w-full text-[19px]">
                Scan QR Code
              </button>
            </div>
            <h3 className="font-semibold text-xl text-gray-800 mb-2 ">
              Sign In{" "}
            </h3>

            <div>
              {/* login form starts here */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="">
                  <input
                    className=" w-full text-sm  px-4 py-3 bg-gray-200 focus:bg-gray-100 border  border-gray-200 rounded-lg focus:outline-none focus:border-slate-400"
                    type=""
                    placeholder="Email"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs italic">
                      {errors.email?.message}
                    </p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <input
                      {...register("password")}
                      placeholder="Password"
                      type={showPassword ? "password" : "text"}
                      className="text-sm px-4 py-3 rounded-lg w-full bg-gray-200 focus:bg-gray-100 border border-gray-200 focus:outline-none focus:border-slate-400"
                    />
                    <div className="flex items-center absolute inset-y-0 right-0 mr-3  text-sm leading-5">
                      {showPassword ? (
                        <svg
                          onClick={() => setShowPassword(!showPassword)}
                          className="h-4 text-slate-500 hover:text-slate-700 transition-colors"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 576 512"
                        >
                          <path
                            fill="currentColor"
                            d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z"
                          ></path>
                        </svg>
                      ) : (
                        <svg
                          className="h-4 text-slate-500 hover:text-slate-700 transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 640 512"
                        >
                          <path
                            fill="currentColor"
                            d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z"
                          ></path>
                        </svg>
                      )}
                    </div>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs italic">
                      {errors.password?.message}
                    </p>
                  )}
                </div>

                {error && (
                  <p className="text-red-500 text-xs italic">{error}</p>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-sm ml-auto">
                    <a
                      href="#"
                      className="text-purple-700 hover:text-purple-600"
                    >
                      Forgot your password?
                    </a>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="my-4 bg-slate-500 hover:bg-slate-700 text-white text-base rounded-lg py-2.5 px-5 transition-colors w-full text-[19px]"
                  >
                    <div className="flex items-center justify-center">
                      {isSubmitting && (
                        <div className="h-5 w-5 border-t-transparent border-solid animate-spin rounded-full border-white border-4"></div>
                      )}{" "}
                      <div className="ml-2"> Sign In </div>
                    </div>
                  </button>
                  <p className="text-gray-400">
                    Don't have an account?{" "}
                    <Link
                      to="/signup"
                      className="text-sm text-purple-700 hover:text-purple-700"
                    >
                      Sign Up
                    </Link>
                  </p>
                </div>
              </form>
              {/* login form ends here */}
              <div className="flex items-center justify-center space-x-2 my-5">
                <span className="h-px w-16 bg-gray-100"></span>
                <span className="text-gray-300 font-normal">or</span>
                <span className="h-px w-16 bg-gray-100"></span>
              </div>

              <div className="flex justify-center gap-5 w-full ">
                {isSubmitting && (
                  <div className="h-5 w-5 border-t-transparent border-solid animate-spin rounded-full border-white border-4"></div>
                )}{" "}
                <button
                  id="buttonDiv"
                  className="w-full flex items-center justify-center mb-6 md:mb-0 border border-gray-300 hover:border-slate-600 hover:bg-slate-700 hover:text-white text-sm text-gray-500 p-3  rounded-lg tracking-wide font-medium  cursor-pointer transition ease-in duration-500"
                >
                  <svg
                    className="w-4 mr-2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="#EA4335"
                      d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
                    />
                    <path
                      fill="#34A853"
                      d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"
                    />
                    <path
                      fill="#4A90E2"
                      d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"
                    />
                  </svg>
                  <span>Google</span>
                </button>
              </div>
            </div>

            <div className="mt-7 text-center text-gray-300 text-xs">
              <span>
                Copyright © 2023-2024
                <a
                  href="#"
                  rel=""
                  target="_blank"
                  title="Fabala Dibbasey"
                  className="ml-2 text-purple-500 hover:text-purple-600 "
                >
                  Fabala
                </a>
              </span>
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

export default Login;
