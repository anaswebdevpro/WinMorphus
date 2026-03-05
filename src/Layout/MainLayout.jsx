import { Outlet, Link } from "react-router-dom";
import MainNavbar from "../Component/MainNavbar";
import Highlight from "../Component/Highlight";


export default function MainLayout() {
  return (
    <div>
      {/* Navbar */}
      <MainNavbar />

   <Highlight />

      {/* This is where child routes will render */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}
