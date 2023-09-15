import { RouteObject, createBrowserRouter } from "react-router-dom";
import Login from "../../features/account/Login";
import Home from "../../features/attendant/Home";
import SessionDetails from "../../features/dashboard/SessionDetails";
import SessionHistory from "../../features/dashboard/SessionHistory";
import UserProfile from "../../features/dashboard/UserProfile";
import App from "../../App";
import GenerateQRCodeForm from "../../features/dashboard/GenerateQRCodeForm";
import RecentSession from "../../features/dashboard/CurrentSession";
import CurrentSession from "../../features/dashboard/CurrentSession";
import SignUp from "../../features/account/SignUp";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
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
            path: "/user-profile/generate-qr-code",
            element: <GenerateQRCodeForm />,
          },
          {
            path: "/user-profile/session-history",
            element: <SessionHistory />,
          },
        ],
      },
      {
        path: "/session-details/:id",
        element: <SessionDetails />,
      },
      {
        path: "*",
        element: <h1>404</h1>,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
