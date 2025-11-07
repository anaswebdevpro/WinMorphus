import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, Menu, User } from "lucide-react";
import { logo } from "../assets";
import { useAuth } from "../Context/UseAuth";

const MainNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Packages", path: "/packages" },
    { name: "Deposit", path: "/deposit" },
    { name: "My Network", path: "/network" },
    { name: "ROI Earnings", path: "/roi-earnings" },
    { name: "Commissions", path: "/commissions" },
    { name: "Withdraw", path: "/withdraw" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-slate-900 px-4 sm:px-6 py-2 sticky top-0 z-50 shadow-lg">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="shrink-0">
          <Link to="/dashboard" className="flex items-center gap-2">
            <img
              src={logo}
              alt="Logo"
              className="h-8 sm:h-10 w-auto"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="flex items-center">
              <span className="text-white text-lg sm:text-xl md:text-2xl font-bold">
                Win
              </span>
              <span className="text-yellow-400 text-lg sm:text-xl md:text-2xl font-bold">
                Morphus
              </span>
            </div>
          </Link>
        </div>
       

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`text-base font-medium transition-colors duration-200 hover:text-white relative ${
                isActive(item.path)
                  ? "text-white after:absolute after:bottom-[-16px] after:left-0 after:right-0 after:h-0.5 after:bg-yellow-400"
                  : "text-gray-300"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* User Profile Section */}
        <div className="flex items-center space-x-4">
          {/* Conditional rendering based on user authentication */}
          {user ? (
            // Show profile menu when user is logged in
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2  text-gray-300 hover:text-white transition-colors"
              >
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-slate-900 text-sm font-medium">
                  {user?.profile_picture_url ? (
                    <img
                      src={user.profile_picture_url}
                      alt="Profile"
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <span className="hidden sm:block text-sm font-medium">
                  {user?.name || "User"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg border font-semibold border-gray-700 py-1 z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-base text-white hover:bg-gray-50 hover:text-black transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Profile Settings
                  </Link>
                  {/* <Link
                    to="/account"
                    className="block px-4 py-2 text-base text-white hover:bg-gray-50 hover:text-black  transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Change Password
                  </Link> */}
                  <hr className="my-1 border-gray-600" />
                  <button
                    className="block w-full text-left px-4 py-2 text-base font-semibold text-red-600 hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                      navigate("/login");
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Show LOGIN and SIGN UP buttons when user is not logged in
            <div className="hidden md:flex items-center space-x-3">
              <button
                onClick={() => navigate("/login")}
                className="border border-yellow-400 text-yellow-400 px-6 py-2 rounded text-base font-medium hover:bg-yellow-400 hover:text-slate-900 transition-colors"
              >
                LOG IN
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="bg-yellow-400 text-slate-900 px-6 py-2 rounded text-base font-medium hover:bg-yellow-500 transition-colors"
              >
                SIGN UP
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-300 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 border-t border-gray-700 pt-4">
          <div className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                  isActive(item.path)
                    ? "bg-yellow-400 text-slate-900"
                    : "text-gray-300 hover:bg-slate-800 hover:text-white"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile Auth Buttons - Only show when user is not logged in */}
            {!user && (
              <div className="pt-4 space-y-2 border-t border-gray-700">
                <button
                  onClick={() => {
                    navigate("/login");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full border border-yellow-400 text-yellow-400 px-4 py-2 rounded text-base font-medium hover:bg-yellow-400 hover:text-slate-900 transition-colors"
                >
                  LOG IN
                </button>
                <button
                  onClick={() => {
                    navigate("/signup");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-yellow-400 text-slate-900 px-4 py-2 rounded text-base font-medium hover:bg-yellow-500 transition-colors"
                >
                  SIGN UP
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default MainNavbar;
