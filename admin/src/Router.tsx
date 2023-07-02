import { createBrowserRouter } from "react-router-dom";
import CompanyInfo from "./pages/companyInformation/CompanyInformation";
import ProtectedRoutes from "./components/ProtectedRoutes";
import UserGroups from "./pages/userGroups/UserGroups";
import Reports from "./pages/reports/Reports";
import Users from "./pages/users/Users";
import Signin from "./pages/signin/Signin";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import Home from "./pages/home/Home";
import ResetPassword from "./pages/resetPassword/ResetPassword";
import NotFound from "./pages/404/404";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  {
    path: "/signin",
    element: <Signin />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/company-information",
    element: (
      <ProtectedRoutes>
        <CompanyInfo />
      </ProtectedRoutes>
    ),
  },
  {
    path: "/user-groups",
    element: (
      <ProtectedRoutes>
        <UserGroups />
      </ProtectedRoutes>
    ),
  },
  {
    path: "/reports",
    element: (
      <ProtectedRoutes>
        <Reports />
      </ProtectedRoutes>
    ),
  },
  {
    path: "/users",
    element: (
      <ProtectedRoutes>
        <Users />
      </ProtectedRoutes>
    ),
  },
  {
    path: "/users/:id",
    element: (
      <ProtectedRoutes>
        <Users />
      </ProtectedRoutes>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
