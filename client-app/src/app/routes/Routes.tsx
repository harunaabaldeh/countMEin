import { RouteObject, createBrowserRouter } from "react-router-dom";
import Login from "../../features/account/Login";
import Home from "../../features/attendee/Home";
import SessionDetails from "../../features/dashboard/SessionDetails";
import SessionHistory from "../../features/dashboard/SessionHistory";
import UserProfile from "../../features/dashboard/UserProfile";
import App from "../../App";
import GenerateQRCodeForm from "../../features/dashboard/GenerateQRCodeForm";
import CurrentSession from "../../features/dashboard/CurrentSession";
import SignUp from "../../features/account/SignUp";
import AuthRoutes from "./AuthRoutes";
import AttendanceRoutes from "./AttendanceRoutes";
import NotFound from "../../features/Errors/NotFound";
import TestErrors from "../../features/Errors/TestErrors";
import ServerError from "../../features/Errors/ServerError";

export const Routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <AttendanceRoutes />,
        children: [
          {
            path: "/",
            element: <Home />,
          },
        ],
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },

      {
        element: <AuthRoutes />,
        children: [
          {
            path: "/user-profile",
            element: <UserProfile />,
            children: [
              {
                path: "/user-profile",
                element: <CurrentSession />,
              },
              {
                path: "/user-profile/current-session",
                element: <CurrentSession />,
              },
              {
                path: "/user-profile/generate-qr-code/:id?",
                element: <GenerateQRCodeForm />,
              },
              {
                path: "/user-profile/session-history",
                element: <SessionHistory />,
              },
            ],
          },
        ],
      },

      {
        element: <AuthRoutes roles={["Admin"]} />,
        children: [
          {
            path: "/test-errors",
            element: <TestErrors />,
          },
          {
            path: "/server-error",
            element: <ServerError />,
          },
        ],
      },

      {
        path: "/session-details/:id",
        element: <SessionDetails />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];

export const router = createBrowserRouter(Routes);
