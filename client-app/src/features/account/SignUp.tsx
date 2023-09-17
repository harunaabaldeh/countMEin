import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { signupFormSchema } from "./accountFormSchema";
import agent from "../../app/api/agent";

function SignUp() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signupFormSchema),
  });
  const [showPassword, setShowPassword] = useState(true);

  const onSubmit = async ({
    firstName,
    lastName,
    email,
    password,
  }: FieldValues) => {
    try {
      console.log("submitting ", { firstName, lastName, email, password });
      await agent.Account.register({ firstName, lastName, email, password });
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-purple-900 absolute top-0 left-0 bg-gradient-to-b from-gray-500 via-gray-500 to-slate-700 bottom-0 leading-5 h-full w-full ">
      <div className="bg-purple-900 absolute top-0 left-0 bg-gradient-to-b from-gray-500 via-gray-500 to-slate-700 bottom-0 leading-5 h-full w-full overflow-hidden"></div>

      <div className="relative min-h-screen  sm:flex sm:flex-row  justify-center bg-transparent rounded-3xl shadow-xl">
        <div className="flex justify-center self-center  z-10">
          <div className="p-12 pt-2 bg-white mx-auto rounded-3xl w-96 ">
            <h3 className="font-semibold text-xl text-gray-800 mb-2 ">
              Join Us!{" "}
            </h3>
            <div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="">
                  <input
                    {...register("firstName")}
                    className=" w-full text-sm  px-4 py-3 bg-gray-200 focus:bg-gray-100 border  border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                    placeholder="First Name"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs italic">
                      {errors.firstName?.message}
                    </p>
                  )}
                </div>
                <div className="">
                  <input
                    {...register("lastName")}
                    className=" w-full text-sm  px-4 py-3 bg-gray-200 focus:bg-gray-100 border  border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                    placeholder="Last Name"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs italic">
                      {errors.lastName?.message}
                    </p>
                  )}
                </div>
                <div className="">
                  <input
                    {...register("email")}
                    className=" w-full text-sm  px-4 py-3 bg-gray-200 focus:bg-gray-100 border  border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                    type=""
                    placeholder="Email"
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
                <div>
                  <div className="relative">
                    <input
                      {...register("confirmPassword")}
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
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs italic">
                      {errors.confirmPassword?.message}
                    </p>
                  )}
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
                      <div className="ml-2"> Sign Up </div>
                    </div>
                  </button>
                  <p className="text-gray-400">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-sm text-purple-700 hover:text-purple-700"
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
              </form>
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

export default SignUp;
