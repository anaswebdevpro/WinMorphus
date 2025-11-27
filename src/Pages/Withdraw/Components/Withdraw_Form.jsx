import React, { useState, useEffect, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useAuth } from "../../../Context/UseAuth";
import { apiRequest } from "../../../Services/Api";
import {
  WITHDRAWAL_NETWORKS,
  WITHDRAWAL_LIMITS,
  WITHDRAWAL_CREATE_REQUEST,
} from "../../../Api/Api_variables";
import WithdrawOtpModal from "./WithdrawOtpModal";
import {
  DollarSign,
  Wallet,
  ArrowDownUp,
  Copy,
  Check,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
  CheckCircle,
  Currency,
} from "lucide-react";

const Withdraw_Form = () => {
  const { token } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [networks, setNetworks] = useState(null);
  const [limits, setLimits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpRequestId, setOtpRequestId] = useState(null);

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
      }).then((response) => {
        if (response?.data) {
          setLimits(response.data);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error("Error fetching withdrawal limits:", error);
      enqueueSnackbar("Failed to load withdrawal limits", { variant: "error" });
      setLoading(false);
    }
  }, [token, enqueueSnackbar]);

  useEffect(() => {
    fetchWithdrawalLimits();
    fetchWithdrawalNetworks();
  }, [fetchWithdrawalLimits, fetchWithdrawalNetworks]);

  // Form validation schema
  const validationSchema = Yup.object({
    amount: Yup.number()
      .required("Amount is required")
      .min(
        limits?.limits?.min_withdrawal || 50,
        `Minimum withdrawal is ${limits?.limits?.min_withdrawal || 50} USDT`
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
      const requestedBody = {
        amount: parseFloat(values.amount),
        wallet_type: values.wallet,
        network: values.network,
        wallet_address: values.address,
        currency: "USDT",
      };
      console.log("Requested Body:", requestedBody);
      try {
        apiRequest({
          endpoint: WITHDRAWAL_CREATE_REQUEST,
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          data: requestedBody,
        })
          .then((response) => {
            if (response.success) {
              enqueueSnackbar("Withdrawal request submitted successfully", {
                variant: "success",
              });
              // Determine request identifier returned by the API (common response shapes)
              const requestId =
                response?.data?.request_id ||
                response?.data?.id ||
                response?.data?.request?.id ||
                response?.data?.withdrawal_request?.id ||
                null;
              if (requestId) {
                setOtpRequestId(requestId);
                setIsOtpModalOpen(true);
              }
            }
            formik.resetForm();
          })
          .catch((error) => {
            console.error("Failed to submit withdrawal request:", error);
            const errorMessage =
              error.response?.data?.message ||
              "Failed to submit withdrawal request";
            enqueueSnackbar(errorMessage, { variant: "error" });
            setSubmitLoading(false);
          });
      } catch (error) {
        console.error("Error submitting withdrawal:", error);
        enqueueSnackbar("Failed to submit withdrawal request", {
          variant: "error",
        });
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

  // Selected network fee info (based on formik network selection)
  const showFees = (() => {
    const n = formik.values.amount;
    if (n < 50) return null;
    if (n >= 50)
      return (
        <span className="text-green-600 text-sm mt-2 lg:ml-50 ">
          $1 transaction fee will be applicable
        </span>
      );

    return null;
  })();

  if (loading) {
    return (
      <div className="bg-linear-to-br from-[var(--bg-card-gradient-start)] to-[var(--bg-card-gradient-end)] border border-[var(--border-primary)] rounded-xl p-8 mb-8 shadow-xl animate-pulse">
        <div className="mb-8">
          <div className="h-8 bg-[var(--bg-tertiary)] rounded w-48 mb-2"></div>
          <div className="h-4 bg-[var(--bg-tertiary)] rounded w-96"></div>
        </div>
        <div className="space-y-6">
          <div className="h-20 bg-[var(--bg-tertiary)] rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-20 bg-[var(--bg-tertiary)] rounded"></div>
            <div className="h-20 bg-[var(--bg-tertiary)] rounded"></div>
          </div>
          <div className="h-20 bg-[var(--bg-tertiary)] rounded"></div>
          <div className="h-12 bg-[var(--bg-tertiary)] rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Left Side - Instructions Card */}
        <div className="bg-linear-to-br from-[var(--bg-card-gradient-start)] to-[var(--bg-card-gradient-end)] border border-[var(--border-primary)] rounded-xl p-8 shadow-xl">
          <div className="sticky top-6">
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
              Withdrawal Guide
            </h3>
            <p className="text-[var(--text-secondary)] text-sm mb-6">
              Follow these steps to withdraw your funds safely
            </p>

            <div className="space-y-4">
              {/* Instruction 1 */}
              <div className="flex gap-4 p-4 bg-(--bg-tertiary) rounded-lg border border-(--border-secondary) hover:border-(--accent-primary)/50 transition-all">
                <div className="shrink-0">
                  <div className="w-10 h-10 rounded-full bg-(--bg-secondary) flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-(--accent-primary)" />
                  </div>
                </div>
                <div>
                  <h4 className="text-[var(--text-primary)] font-semibold mb-1">
                    Enter Amount
                  </h4>
                  <p className="text-[var(--text-secondary)] text-sm">
                    Specify the amount you want to withdraw within the allowed
                    limits
                  </p>
                </div>
              </div>

              {/* Instruction 2 */}
              <div className="flex gap-4 p-4 bg-(--bg-tertiary) rounded-lg border border-(--border-secondary) hover:border-(--status-success)/50 transition-all">
                <div className="shrink-0">
                  <div className="w-10 h-10 rounded-full bg-(--bg-secondary) flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-(--status-success)" />
                  </div>
                </div>
                <div>
                  <h4 className="text-[var(--text-primary)] font-semibold mb-1">
                    Choose Wallet & Network
                  </h4>
                  <p className="text-[var(--text-secondary)] text-sm">
                    Select your wallet type and preferred blockchain network
                  </p>
                </div>
              </div>

              {/* Instruction 3 */}
              <div className="flex gap-4 p-4 bg-(--bg-tertiary) rounded-lg border border-(--border-secondary) hover:border-(--status-info)/50 transition-all">
                <div className="shrink-0">
                  <div className="w-10 h-10 rounded-full bg-(--bg-secondary) flex items-center justify-center">
                    <Copy className="w-5 h-5 text-(--status-info)" />
                  </div>
                </div>
                <div>
                  <h4 className="text-[var(--text-primary)] font-semibold mb-1">
                    Wallet Address
                  </h4>
                  <p className="text-[var(--text-secondary)] text-sm">
                    Enter your destination wallet address carefully
                  </p>
                </div>
              </div>

              {/* Instruction 4 */}
              <div className="flex gap-4 p-4 bg-(--bg-tertiary) rounded-lg border border-(--border-secondary) hover:border-(--accent-secondary)/50 transition-all">
                <div className="shrink-0">
                  <div className="w-10 h-10 rounded-full bg-(--bg-secondary) flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-(--accent-secondary)" />
                  </div>
                </div>
                <div>
                  <h4 className="text-[var(--text-primary)] font-semibold mb-1">
                    Submit Request
                  </h4>
                  <p className="text-[var(--text-secondary)] text-sm">
                    Review details and submit your withdrawal request
                  </p>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            {/* <div className="mt-6 p-4 bg-amber-900/20 border border-amber-500/50 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-amber-400 font-semibold mb-1">
                    Important Notes
                  </h5>
                  <ul className="text-amber-200/80 text-xs space-y-1">
                    <li>• Double-check your wallet address</li>
                    <li>• Processing time: 24-48 hours</li>
                    <li>• Network fees will apply</li>
                    <li>• Minimum withdrawal limits apply</li>
                  </ul>
                </div>
              </div>
            </div> */}

            {/* Security Badge */}
            {/* <div className="mt-4 p-3 bg-green-900/20 border border-green-500/50 rounded-lg">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-400" />
                <span className="text-green-400 text-sm font-semibold">
                  Secure & Encrypted
                </span>
              </div>
            </div> */}
          </div>
        </div>
        {/* Right Side - Form Card */}
        <div className="bg-linear-to-br from-[var(--bg-card-gradient-start)] to-[var(--bg-card-gradient-end)] border border-[var(--border-primary)] rounded-xl p-8 shadow-xl">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
              Withdraw Funds
            </h2>
            <p className="text-[var(--text-secondary)]">
              Fill in the details below to process your withdrawal
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Amount Input */}
            <div className="group">
              <label className="flex text-sm font-semibold text-(--text-secondary) mb-3 items-center gap-2">
                <DollarSign className="w-4 h-4 text-(--status-info)" />
                Amount to Withdraw
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="amount"
                  placeholder="0.00"
                  {...formik.getFieldProps("amount")}
                  className={`w-full px-4 py-3 pl-12 bg-(--input-bg) border-2 rounded-lg text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:ring-0 transition-all ${
                    formik.touched.amount && formik.errors.amount
                      ? "border-red-500 bg-red-900/10"
                      : "border-slate-600 focus:border-blue-500 group-hover:border-slate-500"
                  }`}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-muted)">
                  $
                </span>
              </div>
              {formik.touched.amount && formik.errors.amount ? (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                  <span className="text-lg">⚠️</span> {formik.errors.amount}
                </p>
              ) : (
                <p className="text-(--text-muted) text-xs mt-2">
                  💡 Min: {limits?.limits?.min_withdrawal || 10} USDT |{" "}
                   {showFees}
                </p>
              )}
            </div>

            {/* Wallet and Network Selection - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Wallet Selection */}
              <div className="group">
                <label className="flex text-sm font-semibold text-(--text-secondary) mb-3 items-center gap-2">
                  <Wallet className="w-4 h-4 text-(--status-success)" />
                  Select Wallet
                </label>
                <select
                  name="wallet"
                  {...formik.getFieldProps("wallet")}
                  className={`w-full px-4 py-3 bg-(--input-bg) border-2 rounded-lg text-(--text-primary) focus:outline-none focus:ring-0 transition-all appearance-none cursor-pointer ${
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
                  <option value="">Select-Wallet</option>
                  <option value="main">Main Wallet</option>
                </select>
                {formik.touched.wallet && formik.errors.wallet && (
                  <p className="text-red-400 text-sm mt-2">
                    ⚠️ {formik.errors.wallet}
                  </p>
                )}
              </div>

              {/* Network Selection */}
              <div className="group">
                <label className="flex text-sm font-semibold text-(--text-secondary) mb-3 items-center gap-2">
                  <ArrowDownUp className="w-4 h-4 text-(--accent-secondary)" />
                  Select Network
                </label>
                <select
                  name="network"
                  {...formik.getFieldProps("network")}
                  className={`w-full px-4 py-3 bg-(--input-bg) border-2 rounded-lg text-(--text-primary) focus:outline-none focus:ring-0 transition-all appearance-none cursor-pointer ${
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
                  {/* {console.log(networks.networks.usdt_bep20)} */}
                  {networks?.networks?.usdt_bep20 && (
                    <option value="bep20">
                      {/* {networks.networks.usdt_bep20.name} - Fee: {networks.networks.usdt_bep20.fee}{" "}
                    {networks.networks.usdt_bep20.currency} */}
                      BEP20
                    </option>
                  )}{" "}
                  {networks?.networks?.usdt_TRC20 && (
                    <option value="trc20">
                      {/* {networks.networks.usdt_bep20.name} - Fee: {networks.networks.usdt_bep20.fee}{" "}
                    {networks.networks.usdt_bep20.currency} */}
                      TRC20
                    </option>
                  )}
                </select>

                {formik.touched.network && formik.errors.network && (
                  <p className="text-(--status-error) text-sm mt-2">
                    ⚠️ {formik.errors.network}
                  </p>
                )}
              </div>
            </div>

            {/* Wallet Address */}
            <div className="group">
              <label className="flex text-sm font-semibold text-(--text-secondary) mb-3 items-center gap-2">
                <Copy className="w-4 h-4 text-(--status-info)" />
                Wallet Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="address"
                  placeholder="Enter your wallet address"
                  {...formik.getFieldProps("address")}
                  className={`w-full px-4 py-3 bg-(--input-bg) border-2 rounded-lg text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:ring-0 transition-all ${
                    formik.touched.address && formik.errors.address
                      ? "border-red-500 bg-red-900/10"
                      : "border-slate-600 focus:border-(--status-info) group-hover:border-slate-500"
                  }`}
                />
                {formik.values.address && (
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-all ${
                      copied
                        ? "bg-(--status-success)/30 text-(--status-success)"
                        : "text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-secondary)"
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
                <p className="text-(--text-muted) text-xs mt-2">
                  💡 Min length: 20 characters
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitLoading || !formik.isValid}
                className="w-full px-6 py-3 bg-(--accent-primary) hover:bg-(--accent-hover) disabled:bg-(--bg-tertiary) text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-(--accent-primary)/50 disabled:shadow-none"
              >
                {console.log(submitLoading)}
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
      </div>
      <WithdrawOtpModal
        open={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        requestId={otpRequestId}
        token={token}
        onVerified={() => {
          setIsOtpModalOpen(false);
          enqueueSnackbar("Withdrawal verified successfully", {
            variant: "success",
          });
        }}
      />
    </>
  );
};

export default Withdraw_Form;
