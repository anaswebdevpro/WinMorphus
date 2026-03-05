import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { apiRequest } from "../../Services/Api";
import { enqueueSnackbar } from "notistack";
import MainNavbar from "../../Component/MainNavbar";
import { logo, loginBackground } from "../../assets";
import { useNavigate } from "react-router-dom";
import {
  FORGET_PASSWORD,
  VERIFY_OTP,
  RESEND_OTP,
  RESET_PASSWORD,
} from "../../Api/Api_variables";

const Forget = () => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
//   const [otpToken, setOtpToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();
  // Resend OTP handler
  const handleResendOtp = async () => {
    if (!username) return;
    setIsResending(true);
    try {
      const response = await apiRequest({
        endpoint: RESEND_OTP,
        method: "POST",
        data: JSON.stringify({ username }),
      });
      enqueueSnackbar(response?.message || "OTP resent!", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar(
        error?.response?.data?.message || "Failed to resend OTP",
        { variant: "error" }
      );
    } finally {
      setIsResending(false);
    }
  };

  // Step 1: Enter Username
  const formikUsername = useFormik({
    initialValues: { username: "" },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, "Username must be at least 3 characters")
        .required("Username is required"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await apiRequest({
          endpoint: FORGET_PASSWORD,
          method: "POST",
          data: JSON.stringify({ username: values.username }),
        });
        enqueueSnackbar(response?.message || "OTP sent!", {
          variant: "success",
        });
        console.log("sending the username", values.username, response);
        setUsername(values.username);
        setStep(2);
      } catch (error) {
        enqueueSnackbar(
          error?.response?.data?.message || "Failed to send OTP",
          { variant: "error" }
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Step 2: Enter OTP
  const formikOtp = useFormik({
    initialValues: { otp: "" },
    validationSchema: Yup.object({
      otp: Yup.string().required("OTP is required"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await apiRequest({
          endpoint: VERIFY_OTP,
          method: "POST",
          data: JSON.stringify({ username, otp: values.otp }),
        });
        enqueueSnackbar(response?.message || "OTP verified!", {
          variant: "success",
        });
        // setOtpToken(response?.token || ""); 
        setStep(3);
      } catch (error) {
        enqueueSnackbar(error?.response?.data?.message || "Invalid OTP", {
          variant: "error",
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Step 3: New Password
  const formikPassword = useFormik({
    initialValues: { password: "", confirmPassword: "" },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm your password"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        
        const response = await apiRequest({
          endpoint: RESET_PASSWORD,
          method: "POST",
          data: JSON.stringify({
            username,
            password: values.password,
     
          }),
        });
        enqueueSnackbar(response?.message || "Password reset successful!", {
          variant: "success",
        });
        navigate("/login");
      } catch (error) {
        enqueueSnackbar(
          error?.response?.data?.message || "Failed to reset password",
          { variant: "error" }
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] transition-colors duration-200">
      <MainNavbar />
      <div
        className="flex items-center justify-center h-screen p-3 sm:p-6"
        style={{
          backgroundImage: `url(${loginBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="max-w-md w-full rounded-2xl shadow-2xl overflow-hidden flex flex-col bg-[var(--bg-primary)] p-8">
          <div className="text-center mb-6">
            <img src={logo} alt="Win" className="h-16 w-auto mx-auto mb-4" />
            <h1 className="text-xl font-bold text-[var(--text-primary)] mb-2">
              Forgot Password
            </h1>
            <p className="text-[var(--text-secondary)] text-sm">
              Reset your password in 3 easy steps
            </p>
          </div>

          {step === 1 && (
            <form onSubmit={formikUsername.handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  User ID
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  onChange={formikUsername.handleChange}
                  onBlur={formikUsername.handleBlur}
                  value={formikUsername.values.username}
                  className={`w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm disabled:opacity-60 disabled:cursor-not-allowed ${
                    formikUsername.touched.username &&
                    formikUsername.errors.username
                      ? "border-red-400"
                      : ""
                  }`}
                  disabled={isLoading}
                />
                {formikUsername.touched.username &&
                  formikUsername.errors.username && (
                    <div className="mt-1 text-sm text-red-500">
                      {formikUsername.errors.username}
                    </div>
                  )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold py-3 rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg text-sm flex items-center justify-center"
              >
                {isLoading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={formikOtp.handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  OTP
                </label>
                <div className="flex gap-2">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    placeholder="Enter OTP"
                    onChange={formikOtp.handleChange}
                    onBlur={formikOtp.handleBlur}
                    value={formikOtp.values.otp}
                    className={`w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm disabled:opacity-60 disabled:cursor-not-allowed ${
                      formikOtp.touched.otp && formikOtp.errors.otp
                        ? "border-red-400"
                        : ""
                    }`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isResending || isLoading}
                    className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 font-semibold px-3 py-2 rounded-lg text-xs disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isResending ? "Resending..." : "Resend OTP"}
                  </button>
                </div>
                {formikOtp.touched.otp && formikOtp.errors.otp && (
                  <div className="mt-1 text-sm text-red-500">
                    {formikOtp.errors.otp}
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold py-3 rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg text-sm flex items-center justify-center"
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={formikPassword.handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  New Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter new password"
                  onChange={formikPassword.handleChange}
                  onBlur={formikPassword.handleBlur}
                  value={formikPassword.values.password}
                  className={`w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm disabled:opacity-60 disabled:cursor-not-allowed ${
                    formikPassword.touched.password &&
                    formikPassword.errors.password
                      ? "border-red-400"
                      : ""
                  }`}
                  disabled={isLoading}
                />
                {formikPassword.touched.password &&
                  formikPassword.errors.password && (
                    <div className="mt-1 text-sm text-red-500">
                      {formikPassword.errors.password}
                    </div>
                  )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  onChange={formikPassword.handleChange}
                  onBlur={formikPassword.handleBlur}
                  value={formikPassword.values.confirmPassword}
                  className={`w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm disabled:opacity-60 disabled:cursor-not-allowed ${
                    formikPassword.touched.confirmPassword &&
                    formikPassword.errors.confirmPassword
                      ? "border-red-400"
                      : ""
                  }`}
                  disabled={isLoading}
                />
                {formikPassword.touched.confirmPassword &&
                  formikPassword.errors.confirmPassword && (
                    <div className="mt-1 text-sm text-red-500">
                      {formikPassword.errors.confirmPassword}
                    </div>
                  )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold py-3 rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg text-sm flex items-center justify-center"
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Forget;
