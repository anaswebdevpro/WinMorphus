import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { logo, loginImage, loginBackground } from "../../assets";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email address").required("Required"),
    referral: Yup.string().nullable(),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      referral: "",
      password: "",
      keep: true,
    },
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true);
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2));
        setSubmitting(false);
      }, 700);
    },
  });

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center"
      style={{ backgroundImage: `url(${loginBackground})` }}
    >
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg overflow-hidden flex">
        {/* Left - Form */}
        <div className="w-1/2 p-10">
          <div className="flex flex-col items-center mb-8">
            <img
              src={logo}
              alt="logo"
              className="w-20 mb-6"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">
              Let’s get you signed up
            </h2>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                  formik.touched.name && formik.errors.name
                    ? "border-red-300"
                    : "border-gray-200"
                }`}
              />
              {formik.touched.name && formik.errors.name ? (
                <div className="mt-1 text-sm text-red-600">
                  {formik.errors.name}
                </div>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-300"
                    : "border-gray-200"
                }`}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="mt-1 text-sm text-red-600">
                  {formik.errors.email}
                </div>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="referral"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Referral Code (Optional)
              </label>
              <input
                id="referral"
                name="referral"
                type="text"
                placeholder="Enter referral code"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.referral}
                className="w-full border rounded-md px-3 py-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  className={`w-full border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                    formik.touched.password && formik.errors.password
                      ? "border-red-300"
                      : "border-gray-200"
                  }`}
                />
                <button
                  type="button"
                  aria-label="Toggle password"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-2 text-gray-500"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {formik.touched.password && formik.errors.password ? (
                <div className="mt-1 text-sm text-red-600">
                  {formik.errors.password}
                </div>
              ) : null}
            </div>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  name="keep"
                  onChange={formik.handleChange}
                  checked={formik.values.keep}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <span className="ml-2">Keep me logged in</span>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-md disabled:opacity-60"
              >
                {formik.isSubmitting ? "Creating..." : "Create Account"}
              </button>
            </div>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <a href="#" className="text-indigo-600 hover:underline">
                Sign In Now
              </a>
            </p>
          </form>
        </div>

        {/* Divider */}
        <div className="w-px bg-gray-200" />

        {/* Right - Promo */}
        <div className="w-1/2 p-10 flex flex-col items-center justify-center text-center bg-white">
          <div className="mb-6">
            <img
              src={loginImage}
              alt="Join Promo"
              className="w-80 h-80 object-contain"
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Join Our Platform
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Start your journey with our affiliate platform. Create your account
            and begin earning USDT commissions today.
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
