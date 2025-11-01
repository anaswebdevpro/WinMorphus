import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import {
  Login,
  Signup,
  Commissions,
  Dashboard,
  Deposit,
  Network,
  Packages,
  ROIEarnings,
  Withdraw,
} from "../Pages";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          { path: "dashboard", element: <Dashboard /> },
          { path: "deposit", element: <Deposit /> },
          { path: "network", element: <Network /> },
          { path: "packages", element: <Packages /> },
          { path: "roi-earnings", element: <ROIEarnings /> },
          { path: "commissions", element: <Commissions /> },
          { path: "withdraw", element: <Withdraw /> },
        ],
      },
    ],
  },
  // Public routes
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  // Fallback
  { path: "*", element: <Login /> },
]);
export default router;
