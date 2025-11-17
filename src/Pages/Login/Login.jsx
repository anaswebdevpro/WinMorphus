import React, { useState, useEffect, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Loader } from "lucide-react";
import { apiRequest } from "../../Services/Api";
import { LOGIN_URL, LOGIN_WITH_TOKEN_URL } from "../../Api/Api_variables";
import { useAuth } from "../../Context/UseAuth";
import { logo, loginImage, loginBackground } from "../../assets";
import MainNavbar from "../../Component/MainNavbar";

const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isForceLoading, setIsForceLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleForceLogin = useCallback(
    async (token) => {
      setIsForceLoading(true);
      try {
        const payload = JSON.stringify({ token });

        const response = await apiRequest({
          endpoint: LOGIN_WITH_TOKEN_URL,
          method: "POST",
          data: payload,
        });

        if (response?.token && response?.user) {
          // Use the login function from AuthContext
          login(response.user, response.token);

          // Clear URL parameters and redirect to dashboard
          navigate("/dashboard", { replace: true });
          console.log("Force login successful:", response);
        } else {
          throw new Error(response?.message || "Invalid token response");
        }
      } catch (error) {
        console.error("Force login failed:", error);
        alert("Automatic login failed. Please try logging in manually.");

        // Clear URL parameters and stay on login page
        navigate("/login", { replace: true });
      } finally {
        setIsForceLoading(false);
      }
    },
    [login, navigate]
  );

  // Check for force login on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");
    const forceLogin = searchParams.get("force_login");

    if (token && forceLogin === "true") {
      handleForceLogin(token);
    }
  }, [location, handleForceLogin]);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      keep: true,
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const payload = JSON.stringify({
          username: values.username,
          password: values.password,
        });
        apiRequest({
          endpoint: LOGIN_URL,
          method: "POST",
          data: payload,
        })
          .then((response) => {
            // Use the login function from AuthContext
            login(response?.user, response?.token);

            navigate("/dashboard");
            console.log(response);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("Login failed:", error);

            formik.setFieldError("password", "Invalid username or password");
            setIsLoading(false);
          });
      } catch (error) {
        console.error("Login failed:", error);

        formik.setFieldError("password", "Invalid username or password");
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navbar */}
      <MainNavbar />

      {/* Main Content */}
      <div
        className="flex items-center justify-center min-h-[calc(100vh-80px)] p-3 sm:p-6"
        style={{
          backgroundImage: `url(${loginBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="max-w-5xl w-full rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
          {/* Left - Form Section */}
          <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-12 bg-white flex flex-col justify-center order-1">
            <div className="max-w-sm mx-auto w-full">
              {/* Logo and Title */}
              <div className="text-center mb-6 sm:mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full mb-4 sm:mb-6">
                  <img src={logo} alt="Win" className="h-16 sm:h-20 w-auto" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">
                  Let's get you
                  <br />
                  signed in
                </h1>
              </div>

              {/* Form */}
              <form
                onSubmit={formik.handleSubmit}
                className="space-y-4 sm:space-y-6"
              >
                {/* Username Field */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    User ID
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter your username"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.username}
                    disabled={isForceLoading}
                    className={`w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 sm:py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm sm:text-base disabled:opacity-60 disabled:cursor-not-allowed ${
                      formik.touched.username && formik.errors.username
                        ? "border-red-400"
                        : ""
                    }`}
                  />
                  {formik.touched.username && formik.errors.username ? (
                    <div className="mt-1 text-sm text-red-500">
                      {formik.errors.username}
                    </div>
                  ) : null}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                      disabled={isForceLoading}
                      className={`w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 pr-12 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm sm:text-base disabled:opacity-60 disabled:cursor-not-allowed ${
                        formik.touched.password && formik.errors.password
                          ? "border-red-400"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      aria-label="Toggle password"
                      onClick={() => setShowPassword((s) => !s)}
                      disabled={isForceLoading}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {formik.touched.password && formik.errors.password ? (
                    <div className="mt-1 text-sm text-red-500">
                      {formik.errors.password}
                    </div>
                  ) : null}
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="keep"
                    onChange={formik.handleChange}
                    checked={formik.values.keep}
                    className="h-4 w-4 sm:h-4 sm:w-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-400 mt-1 touch-manipulation"
                  />
                  <label className="ml-2 text-xs sm:text-sm text-slate-600">
                    I agree to the Terms & Conditions
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || isForceLoading}
                  className="w-full bg-linear-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-bold py-3 sm:py-4 rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg text-sm sm:text-base touch-manipulation flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader size={20} className="animate-spin" />
                      <span>Logging in...</span>
                    </>
                  ) : isForceLoading ? (
                    <>
                      <Loader size={20} className="animate-spin" />
                      <span>Auto-login in progress...</span>
                    </>
                  ) : (
                    "Login"
                  )}
                </button>

                {/* Login Link */}
                <p className="text-center text-xs sm:text-sm text-slate-600">
                  Don't have to account?{" "}
                  <Link
                    to="/signup"
                    className="text-yellow-500 hover:text-yellow-600 font-medium"
                  >
                    Sign Up
                  </Link>
                </p>
              </form>
            </div>
          </div>

          {/* Right - Hero Section */}
          <div className="w-full lg:w-1/2 bg-[#080D18] p-6 sm:p-8 lg:p-12 flex flex-col justify-center items-center text-center relative overflow-hidden order-2 min-h-[300px] lg:min-h-auto">
            {/* Login Image - Full Size */}
            <div className="relative mb-4 sm:mb-6 lg:mb-8 w-full h-48 sm:h-64 lg:h-80 flex items-center justify-center">
              <img
                src={loginImage}
                alt="Trading Platform"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>

            {/* Text Content */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
              Unlock Your
              <br />
              <span className="text-yellow-400">Trading Potential</span>
            </h2>

            <div className="text-yellow-400 font-bold text-lg sm:text-xl tracking-wider mb-4 sm:mb-6">
              WIN MORPHUS
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
