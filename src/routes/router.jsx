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
  Profile,
  Loyalty,
} from "../Pages";
import BEP20 from "../Pages/Deposit/BEP20/BEP20";
import TRC20 from "../Pages/Deposit/TRC20/TRC20";

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
          {
            path: "deposit",
            children: [
              { index: true, element: <Deposit /> },
              { path: "trc20", element: <TRC20 /> },
              { path: "bep20", element: <BEP20 /> },
            ],
          },
          { path: "network", element: <Network /> },
          { path: "packages", element: <Packages /> },
          { path: "roi-earnings", element: <ROIEarnings /> },
          { path: "commissions", element: <Commissions /> },
          { path: "loyalty-allowance", element: <Loyalty /> },
          { path: "withdraw", element: <Withdraw /> },
          { path: "profile", element: <Profile /> },
        ],
      },
    ],
  },
  // Public routes
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/ref/:referralId", element: <Signup /> },
  // Fallback
  { path: "*", element: <Login /> },
]);
export default router;
