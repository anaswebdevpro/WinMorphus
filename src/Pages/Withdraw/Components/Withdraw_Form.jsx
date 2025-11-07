import React, { useState, useEffect, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useAuth } from "../../../Context/UseAuth";
import { apiRequest } from "../../../Services/Api";
import {
  WITHDRAWAL_NETWORKS,
  WITHDRAWAL_LIMITS,
} from "../../../Api/Api_variables";
import {
  DollarSign,
  Wallet,
  ArrowDownUp,
  Copy,
  Check,
  RefreshCw,
} from "lucide-react";

const Withdraw_Form = () => {
  const { token } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [networks, setNetworks] = useState(null);
  const [limits, setLimits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch withdrawal networks
  const fetchWithdrawalNetworks = useCallback(async () => {
    if (!token) return;

    try {
      apiRequest({
        endpoint: WITHDRAWAL_NETWORKS,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).then((response) => {
        if (response?.data) {
          setNetworks(response.data);
        }
      });
    } catch (error) {
      console.error("Error fetching withdrawal networks:", error);
      enqueueSnackbar("Failed to load withdrawal networks", {
        variant: "error",
      });
    }
  }, [token, enqueueSnackbar]);

  // Fetch withdrawal limits
  const fetchWithdrawalLimits = useCallback(async () => {
    if (!token) return;

    try {
       apiRequest({
        endpoint: WITHDRAWAL_LIMITS,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
      
      .then((response) => {
        if (response?.data) {
          setLimits(response.data);
        }
      });
    } catch (error) {
      console.error("Error fetching withdrawal limits:", error);
      enqueueSnackbar("Failed to load withdrawal limits", { variant: "error" });
    }
  }, [token, enqueueSnackbar]);

  // Fetch form data
  const fetchFormData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([fetchWithdrawalNetworks(), fetchWithdrawalLimits()]);
    } finally {
      setLoading(false);
    }
  }, [fetchWithdrawalNetworks, fetchWithdrawalLimits]);

  useEffect(() => {
    fetchFormData();
  }, [fetchFormData]);

  // Form validation schema
  const validationSchema = Yup.object({
    amount: Yup.number()
      .required("Amount is required")
      .min(
        limits?.limits?.min_withdrawal || 10,
        `Minimum withdrawal is ${limits?.limits?.min_withdrawal || 10} USDT`
      )
      .max(
        limits?.limits?.max_withdrawal || 10000,
        `Maximum withdrawal is ${limits?.limits?.max_withdrawal || 10000} USDT`
      ),
    wallet: Yup.string().required("Please select a wallet"),
    network: Yup.string().required("Please select a network"),
    address: Yup.string()
      .required("Wallet address is required")
      .min(20, "Wallet address must be at least 20 characters"),
  });

  const formik = useFormik({
    initialValues: {
      amount: "",
      wallet: "main",
      network: "",
      address: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setSubmitLoading(true);
      try {
        // TODO: Replace with actual withdrawal submission API
        console.log("Withdrawal submission:", values);
        enqueueSnackbar(
          "Withdrawal request submitted successfully! (Demo mode)",
          {
            variant: "success",
          }
        );
        formik.resetForm();
      } catch (error) {
        console.error("Error submitting withdrawal:", error);
        enqueueSnackbar("Failed to submit withdrawal request", {
          variant: "error",
        });
      } finally {
        setSubmitLoading(false);
      }
    },
  });

  // Handle copy address
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(formik.values.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    enqueueSnackbar("Address copied to clipboard", { variant: "info" });
  };

  if (loading) {
    return (
      <div className="bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-8 mb-8 shadow-xl animate-pulse">
        <div className="mb-8">
          <div className="h-8 bg-slate-700 rounded w-48 mb-2"></div>
          <div className="h-4 bg-slate-700 rounded w-96"></div>
        </div>
        <div className="space-y-6">
          <div className="h-20 bg-slate-700 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-20 bg-slate-700 rounded"></div>
            <div className="h-20 bg-slate-700 rounded"></div>
          </div>
          <div className="h-20 bg-slate-700 rounded"></div>
          <div className="h-12 bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-8 mb-8 shadow-xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Withdraw Funds</h2>
        <p className="text-gray-400">
          Fill in the details below to process your withdrawal
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Amount Input */}
        <div className="group">
          <label className="flex text-sm font-semibold text-gray-200 mb-3 items-center gap-2">
            <DollarSign className="w-4 h-4 text-blue-400" />
            Amount to Withdraw
          </label>
          <div className="relative">
            <input
              type="number"
              name="amount"
              placeholder="0.00"
              {...formik.getFieldProps("amount")}
              className={`w-full px-4 py-3 pl-12 bg-slate-700/50 border-2 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-0 transition-all ${
                formik.touched.amount && formik.errors.amount
                  ? "border-red-500 bg-red-900/10"
                  : "border-slate-600 focus:border-blue-500 group-hover:border-slate-500"
              }`}
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              $
            </span>
          </div>
          {formik.touched.amount && formik.errors.amount ? (
            <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
              <span className="text-lg">⚠️</span> {formik.errors.amount}
            </p>
          ) : (
            <p className="text-gray-500 text-xs mt-2">
              💡 Min: {limits?.limits?.min_withdrawal || 10} USDT | Max:{" "}
              {limits?.limits?.max_withdrawal || 10000} USDT
            </p>
          )}
        </div>

        {/* Wallet and Network Selection - Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Wallet Selection */}
          <div className="group">
            <label className="flex text-sm font-semibold text-gray-200 mb-3 items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-400" />
              Select Wallet
            </label>
            <select
              name="wallet"
              {...formik.getFieldProps("wallet")}
              className={`w-full px-4 py-3 bg-slate-700/50 border-2 rounded-lg text-white focus:outline-none focus:ring-0 transition-all appearance-none cursor-pointer ${
                formik.touched.wallet && formik.errors.wallet
                  ? "border-red-500 bg-red-900/10"
                  : "border-slate-600 focus:border-emerald-500 group-hover:border-slate-500"
              }`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239ca3af' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 1rem center",
                paddingRight: "2.5rem",
              }}
            >
              <option value="main">Main Wallet</option>
              <option value="available">Available Balance</option>
            </select>
            {formik.touched.wallet && formik.errors.wallet && (
              <p className="text-red-400 text-sm mt-2">
                ⚠️ {formik.errors.wallet}
              </p>
            )}
          </div>

          {/* Network Selection */}
          <div className="group">
            <label className="flex text-sm font-semibold text-gray-200 mb-3 items-center gap-2">
              <ArrowDownUp className="w-4 h-4 text-purple-400" />
              Select Network
            </label>
            <select
              name="network"
              {...formik.getFieldProps("network")}
              className={`w-full px-4 py-3 bg-slate-700/50 border-2 rounded-lg text-white focus:outline-none focus:ring-0 transition-all appearance-none cursor-pointer ${
                formik.touched.network && formik.errors.network
                  ? "border-red-500 bg-red-900/10"
                  : "border-slate-600 focus:border-purple-500 group-hover:border-slate-500"
              }`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239ca3af' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 1rem center",
                paddingRight: "2.5rem",
              }}
            >
              <option value="">-- Select Network --</option>
              {networks?.trc20 && (
                <option value="TRC20">
                  {networks.trc20.name} - Fee: {networks.trc20.fee}{" "}
                  {networks.trc20.currency}
                </option>
              )}
              {networks?.bep20 && (
                <option value="BEP20">
                  {networks.bep20.name} - Fee: {networks.bep20.fee}{" "}
                  {networks.bep20.currency}
                </option>
              )}
              {networks?.erc20 && (
                <option value="ERC20">
                  {networks.erc20.name} - Fee: {networks.erc20.fee}{" "}
                  {networks.erc20.currency}
                </option>
              )}
            </select>
            {formik.touched.network && formik.errors.network && (
              <p className="text-red-400 text-sm mt-2">
                ⚠️ {formik.errors.network}
              </p>
            )}
          </div>
        </div>

        {/* Wallet Address */}
        <div className="group">
          <label className="flex text-sm font-semibold text-gray-200 mb-3 items-center gap-2">
            <Copy className="w-4 h-4 text-cyan-400" />
            Wallet Address
          </label>
          <div className="relative">
            <input
              type="text"
              name="address"
              placeholder="Enter your wallet address"
              {...formik.getFieldProps("address")}
              className={`w-full px-4 py-3 bg-slate-700/50 border-2 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-0 transition-all ${
                formik.touched.address && formik.errors.address
                  ? "border-red-500 bg-red-900/10"
                  : "border-slate-600 focus:border-cyan-500 group-hover:border-slate-500"
              }`}
            />
            {formik.values.address && (
              <button
                type="button"
                onClick={handleCopyAddress}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-all ${
                  copied
                    ? "bg-green-900/30 text-green-400"
                    : "text-gray-400 hover:text-white hover:bg-slate-600/50"
                }`}
              >
                {copied ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
          {formik.touched.address && formik.errors.address ? (
            <p className="text-red-400 text-sm mt-2">
              ⚠️ {formik.errors.address}
            </p>
          ) : (
            <p className="text-gray-500 text-xs mt-2">
              💡 Min length: 20 characters
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={submitLoading || !formik.isValid}
            className="w-full px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/50 disabled:shadow-none"
          >
            {submitLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Processing your request...
              </>
            ) : (
              <>
                <ArrowDownUp className="w-5 h-5" />
                Withdraw Funds
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Withdraw_Form;
