import { Outlet, Link } from "react-router-dom";
import MainNavbar from "../Component/MainNavbar";

export default function MainLayout() {
  return (
    <div>
      {/* Navbar */}
      <MainNavbar />

      {/* This is where child routes will render */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}
