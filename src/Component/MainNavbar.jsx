import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, Menu, User, Sun, Moon } from "lucide-react";
import { logo } from "../assets";
import { useAuth } from "../Context/UseAuth";
import { useTheme } from "../Context/UseTheme";

const MainNavbar = () => {
  const { user, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Packages", path: "/packages" },
    { name: "Deposit", path: "/deposit" },
    { name: "Network", path: "/network" },
    { name: "ROI Earnings", path: "/roi-earnings" },
    { name: "Leadership Income", path: "/commissions" },
    { name: "Loyalty Allowance", path: "/loyalty-allowance" },
    { name: "Withdraw", path: "/withdraw" },
  ];

  const isActive = (path) => location.pathname === path;
  //  console.log("user in navbar:", user);

  // Don't render navbar if user is not logged in
  if (!user) {
    return null;
  }

  return (
    <nav className="bg-[var(--navbar-bg)] px-4 sm:px-6 py-3 sticky top-0 z-50 shadow-lg border-b border-[var(--navbar-border)]">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="shrink-0">
          <Link to="/dashboard" className="flex items-center gap-1">
            <img
              src={logo}
              alt="Logo"
              className="w-10 h-10 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="flex items-center">
              <span className="text-[var(--navbar-text)] text-lg sm:text-xl md:text-2xl font-bold">
                Win
              </span>
              <span className="text-[var(--accent-primary)] text-lg sm:text-xl md:text-2xl font-bold">
                Morphus
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center space-x-4 xl:space-x-5">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`text-sm xl:text-[15px] font-medium transition-colors duration-200 hover:text-[var(--navbar-text-hover)] relative py-2 whitespace-nowrap ${
                isActive(item.path)
                  ? "text-[var(--accent-primary)]"
                  : "text-[var(--navbar-text)]"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* User Profile Section */}
        <div className="flex items-center space-x-2 xl:space-x-3">
          {/* Conditional rendering based on user authentication */}
          {user ? (
            // Show profile menu when user is logged in
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 text-[var(--navbar-text)] hover:text-[var(--navbar-text-hover)] transition-colors"
              >
                <div className="w-10 h-10 bg-[var(--accent-primary)] rounded-full flex items-center justify-center text-slate-900 text-sm font-medium overflow-hidden">
                  {user?.profile_picture_url ? (
                    <img
                      src={user.profile_picture_url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                  <User
                    className={`w-6 h-6 ${
                      user?.profile_picture_url ? "hidden" : ""
                    }`}
                  />
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
                <div className="absolute right-0 mt-2 w-48 bg-[var(--bg-card)] rounded-md shadow-lg border font-semibold border-[var(--border-primary)] py-1 z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-base text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Profile Settings
                  </Link>
                  {/* <Link
                    to="/account"
                    className="block px-4 py-2 text-base text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Change Password
                  </Link> */}
                  <hr className="my-1 border-[var(--border-primary)]" />
                  <button
                    className="block w-full text-left px-4 py-2 text-base font-semibold text-red-600 hover:bg-[var(--bg-tertiary)] transition-colors"
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
            <div className="hidden lg:flex items-center space-x-3">
              <button
                onClick={() => navigate("/login")}
                className="border-2 border-[var(--accent-primary)] text-[var(--accent-primary)] px-5 py-2 rounded-md text-sm font-bold hover:bg-[var(--accent-primary)] hover:text-slate-900 transition-all duration-200"
              >
                LOG IN
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="bg-[var(--accent-primary)] text-slate-900 px-5 py-2 rounded-md text-sm font-bold hover:bg-[var(--accent-hover)] transition-all duration-200 shadow-lg"
              >
                SIGN UP
              </button>
            </div>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-card)] border border-[var(--border-primary)] transition-all duration-200 group"
            aria-label="Toggle theme"
            title={`Switch to ${isDark ? "light" : "dark"} mode`}
          >
            {isDark ? (
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-[var(--accent-primary)] group-hover:rotate-180 transition-transform duration-500" />
                <span className="hidden sm:inline text-sm font-medium text-(--text-secondary)">
                  Dark
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-[var(--accent-primary)] group-hover:-rotate-12 transition-transform duration-500" />
                <span className="hidden sm:inline text-sm font-medium text-(--text-secondary)">
                  Light
                </span>
              </div>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-[var(--navbar-text)] hover:text-[var(--navbar-text-hover)]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-4 border-t border-[var(--border-primary)] pt-4">
          <div className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.path)
                    ? "bg-[var(--accent-primary)] text-slate-900"
                    : "text-[var(--navbar-text)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--navbar-text-hover)]"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile Auth Buttons - Only show when user is not logged in */}
            {!user && (
              <div className="pt-4 space-y-2 border-t border-[var(--border-primary)]">
                <button
                  onClick={() => {
                    navigate("/login");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full border-2 border-[var(--accent-primary)] text-[var(--accent-primary)] px-4 py-2 rounded-md text-sm font-bold hover:bg-[var(--accent-primary)] hover:text-slate-900 transition-all duration-200"
                >
                  LOG IN
                </button>
                <button
                  onClick={() => {
                    navigate("/signup");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-[var(--accent-primary)] text-slate-900 px-4 py-2 rounded-md text-sm font-bold hover:bg-[var(--accent-hover)] transition-all duration-200"
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
