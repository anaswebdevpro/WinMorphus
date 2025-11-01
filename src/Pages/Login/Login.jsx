import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../../Services/Api";
import { LOGIN_URL } from "../../Api/Api_variables";
import { useAuth } from "../../Context/UseAuth";
import { logo, loginImage, loginBackground } from "../../assets";
import MainNavbar from "../../Component/MainNavbar";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Required"),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      keep: true,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const payload = JSON.stringify({
          email: values.email,
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
          })
          .catch((error) => {
            console.error("Login failed:", error);

            formik.setFieldError("password", "Invalid email or password");
          });
      } catch (error) {
        console.error("Login failed:", error);

        formik.setFieldError("password", "Invalid email or password");
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navbar */}
      <MainNavbar />

      {/* Main Content */}
      <div
        className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6"
        style={{
          backgroundImage: `url(${loginBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="max-w-5xl w-full  rounded-2xl shadow-2xl overflow-hidden flex">
          {/* Left - Form Section */}
          <div className="w-1/2 p-12 bg-white flex flex-col justify-center">
            <div className="max-w-sm mx-auto w-full">
              {/* Logo and Title */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20rounded-full mb-6">
                  <img src={logo} alt="Win" className="h-20 w-auto" />
                </div>
                <h1 className="text-2xl font-bold text-slate-800 mb-2">
                  Let's get you
                  <br />
                  signed in
                </h1>
              </div>

              {/* Form */}
              <form onSubmit={formik.handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    className={`w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${
                      formik.touched.email && formik.errors.email
                        ? "border-red-400"
                        : ""
                    }`}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="mt-1 text-sm text-red-500">
                      {formik.errors.email}
                    </div>
                  ) : null}
                </div>

                {/* Password Field */}
                <div>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                      className={`w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 pr-12 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${
                        formik.touched.password && formik.errors.password
                          ? "border-red-400"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      aria-label="Toggle password"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={
                            showPassword
                              ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                              : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          }
                        />
                      </svg>
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
                    className="h-4 w-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-400 mt-1"
                  />
                  <label className="ml-2 text-sm text-slate-600">
                    I agree to the Terms & Conditions
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-bold py-4 rounded-lg transition-all duration-200 disabled:opacity-60 shadow-lg"
                >
                  {formik.isSubmitting ? "logging in..." : "Login"}
                </button>

                {/* Login Link */}
                <p className="text-center text-sm text-slate-600">
                  Don't have to account? <Link to="/signup">Sign Up</Link>
                </p>
              </form>
            </div>
          </div>

          {/* Right - Hero Section */}
          <div className="w-1/2 bg-[#080D18] p-12 flex flex-col justify-center items-center text-center relative overflow-hidden">
            {/* Login Image - Full Size */}
            <div className="relative mb-8 w-full h-80 flex items-center justify-center">
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
            <h2 className="text-4xl font-bold text-white mb-4">
              Unlock Your
              <br />
              <span className="text-yellow-400">Trading Potential</span>
            </h2>

            <div className="text-yellow-400 font-bold text-xl tracking-wider mb-6">
              WIN MORPHUS
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
