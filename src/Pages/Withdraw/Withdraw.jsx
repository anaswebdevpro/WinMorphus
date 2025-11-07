import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import {
  DollarSign,
  Wallet,
  RefreshCw,
  Copy,
  Check,
  Calendar,
  ArrowDownUp,
} from "lucide-react";
import { useAuth } from "../../Context/UseAuth";
import { apiRequest } from "../../Services/Api";
import {
  WITHDRAWAL_TABLE_HISTORY,
  WITHDRAWAL_WALLET_INFO,
  WITHDRAWAL_STATISTICS,
  WITHDRAWAL_NETWORKS,
  WITHDRAWAL_LIMITS,
} from "../../Api/Api_variables";


// Constants
const ENTRIES_PER_PAGE_OPTIONS = [5, 10, 25];
const DEFAULT_ENTRIES_PER_PAGE = 20;

// Reusable Components
const BalanceCard = ({ title, amount, icon, bgColor }) => {
  const IconComponent = icon;
  return (
    <div className={`${bgColor} rounded-lg p-6 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium mb-2">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold">{amount}</p>
        </div>
        <div className="bg-white/20 p-3 rounded-lg">
          <IconComponent className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

const PaginationButton = ({ onClick, disabled, children, isActive }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-3 py-1 border rounded-md transition-colors ${
      isActive
        ? "bg-blue-500 text-white border-blue-500"
        : "border-slate-600 text-gray-300 hover:border-blue-500"
    } disabled:opacity-50 disabled:cursor-not-allowed`}
  >
    {children}
  </button>
);

const StatusBadge = ({ status, label }) => {
  const statusConfig = {
    approved: { bg: "bg-green-100", text: "text-green-800" },
    pending: { bg: "bg-yellow-100", text: "text-yellow-800" },
    completed: { bg: "bg-blue-100", text: "text-blue-800" },
    failed: { bg: "bg-red-100", text: "text-red-800" },
    cancelled: { bg: "bg-gray-100", text: "text-gray-800" },
    processing: { bg: "bg-purple-100", text: "text-purple-800" },
    rejected: { bg: "bg-red-100", text: "text-red-800" },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const displayLabel =
    label || status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}
    >
      {displayLabel}
    </span>
  );
};

const Withdraw = () => {
  const { token } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [entriesPerPage, setEntriesPerPage] = useState(
    DEFAULT_ENTRIES_PER_PAGE
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [walletInfo, setWalletInfo] = useState(null);
  const [networks, setNetworks] = useState({});
  const [limits, setLimits] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 20,
    total: 0,
    last_page: 1,
  });

  // Validation Schema - Dynamic based on limits
  const withdrawalValidationSchema = useMemo(() => {
    const minAmount = limits?.limits?.min_withdrawal || 10;
    const maxAmount = limits?.limits?.max_withdrawal || 10000;

    return Yup.object().shape({
      amount: Yup.number()
        .required("Amount is required")
        .positive("Amount must be greater than 0")
        .typeError("Amount must be a number")
        .min(minAmount, `Minimum withdrawal is ${minAmount} USDT`)
        .max(maxAmount, `Maximum withdrawal is ${maxAmount} USDT`),
      wallet: Yup.string().required("Please select a wallet"),
      network: Yup.string().required("Please select a network"),
      address: Yup.string()
        .required("Wallet address is required")
        .min(20, "Invalid wallet address"),
    });
  }, [limits]);

  // Fetch withdrawal history
  const fetchWithdrawalHistory = useCallback(
    async (page = 1, perPage = DEFAULT_ENTRIES_PER_PAGE) => {
      if (!token) return;

      try {
        const response = await apiRequest({
          endpoint: WITHDRAWAL_TABLE_HISTORY,
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: {
            page,
            per_page: perPage,
          },
        });

        if (response?.data?.requests) {
          setWithdrawalHistory(response.data.requests);
          setPagination(response.data.pagination);
        }
      } catch (error) {
        console.error("Error fetching withdrawal history:", error);
        enqueueSnackbar("Failed to load withdrawal history", {
          variant: "error",
        });
      }
    },
    [token, enqueueSnackbar]
  );

  // Fetch wallet info
  const fetchWalletInfo = useCallback(async () => {
    if (!token) return;

    try {
      const response = await apiRequest({
        endpoint: WITHDRAWAL_WALLET_INFO,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response?.data) {
        setWalletInfo(response.data);
      }
    } catch (error) {
      console.error("Error fetching wallet info:", error);
      enqueueSnackbar("Failed to load wallet information", {
        variant: "error",
      });
    }
  }, [token, enqueueSnackbar]);

  // Fetch withdrawal networks
  const fetchWithdrawalNetworks = useCallback(async () => {
    if (!token) return;

    try {
      const response = await apiRequest({
        endpoint: WITHDRAWAL_NETWORKS,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response?.data?.networks) {
        setNetworks(response.data.networks);
      }
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
      const response = await apiRequest({
        endpoint: WITHDRAWAL_LIMITS,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response?.data) {
        setLimits(response.data);
      }
    } catch (error) {
      console.error("Error fetching withdrawal limits:", error);
      enqueueSnackbar("Failed to load withdrawal limits", { variant: "error" });
    }
  }, [token, enqueueSnackbar]);

  // Fetch withdrawal statistics
  const fetchWithdrawalStatistics = useCallback(async () => {
    if (!token) return;

    try {
      const response = await apiRequest({
        endpoint: WITHDRAWAL_STATISTICS,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response?.data) {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error("Error fetching withdrawal statistics:", error);
      enqueueSnackbar("Failed to load withdrawal statistics", {
        variant: "error",
      });
    }
  }, [token, enqueueSnackbar]);

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      await Promise.all([
        fetchWithdrawalHistory(currentPage, entriesPerPage),
        fetchWalletInfo(),
        fetchWithdrawalNetworks(),
        fetchWithdrawalLimits(),
        fetchWithdrawalStatistics(),
      ]);
    } catch (error) {
      console.error("Error fetching withdrawal data:", error);
    } finally {
      setLoading(false);
    }
  }, [
    token,
    currentPage,
    entriesPerPage,
    fetchWithdrawalHistory,
    fetchWalletInfo,
    fetchWithdrawalNetworks,
    fetchWithdrawalLimits,
    fetchWithdrawalStatistics,
  ]);

  // Fetch data on mount
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Use withdrawal history directly (pagination handled by API)
  const paginatedData = withdrawalHistory;

  const totalPages = pagination?.last_page || 1;

  // Formik setup
  const formik = useFormik({
    initialValues: {
      amount: "",
      wallet: "main",
      network: "",
      address: "",
    },
    validationSchema: withdrawalValidationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitLoading(true);
      try {
        // TODO: Replace with actual withdrawal API endpoint
        // const response = await apiRequest({
        //   endpoint: WITHDRAWAL_SUBMIT,
        //   method: "POST",
        //   headers: { Authorization: `Bearer ${token}` },
        //   body: {
        //     amount: parseFloat(values.amount),
        //     wallet_type: values.wallet,
        //     network: values.network,
        //     wallet_address: values.address,
        //   },
        // });

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        enqueueSnackbar("Withdrawal request submitted successfully!", {
          variant: "success",
        });
        resetForm();
        fetchAllData(); // Refresh data
      } catch (error) {
        console.error("Withdrawal error:", error);
        enqueueSnackbar(
          error?.response?.data?.message ||
            "Failed to submit withdrawal request",
          { variant: "error" }
        );
      } finally {
        setSubmitLoading(false);
        setSubmitting(false);
      }
    },
  });

  // Handlers
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(formik.values.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEntriesPerPageChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-slate-800 rounded-lg h-24"></div>
              ))}
            </div>
            <div className="bg-slate-800 rounded-lg h-96"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-10">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Withdraw Funds
            </h1>
            <p className="text-gray-400">
              Withdraw your earnings to your preferred wallet
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Main Wallet */}
          <BalanceCard
            title="Main Wallet"
            amount={
              walletInfo?.wallets?.main?.balance
                ? `${walletInfo.wallets.main.balance} ${
                    walletInfo.wallets.main.currency || "USDT"
                  }`
                : "0.00 USDT"
            }
            icon={Wallet}
            bgColor="bg-blue-600"
            textColor="text-white"
          />

          {/* Available Balance */}
          <BalanceCard
            title="Available Balance"
            amount={
              walletInfo?.wallets?.available?.balance
                ? `${walletInfo.wallets.available.balance} ${
                    walletInfo.wallets.available.currency || "USDT"
                  }`
                : "0.00 USDT"
            }
            icon={DollarSign}
            bgColor="bg-green-500"
            textColor="text-white"
          />

          {/* Total Withdrawals */}
          <div className="bg-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium mb-2">
                  Total Withdrawals
                </p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {walletInfo?.total_withdrawals
                    ? `${walletInfo.total_withdrawals} USDT`
                    : "0.00 USDT"}
                </p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <ArrowDownUp className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Pending Requests */}
          <div className="bg-yellow-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium mb-2">
                  Pending Requests
                </p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {walletInfo?.pending_requests || 0}
                </p>
                <p className="text-white/70 text-xs mt-1">
                  Amount: {walletInfo?.pending_withdrawals || 0} USDT
                </p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <RefreshCw className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Withdrawal Status Alert */}
        {walletInfo && (
          <div
            className={`mb-8 p-4 rounded-lg border ${
              walletInfo.can_request_withdrawal
                ? "bg-green-900/20 border-green-500/50 text-green-400"
                : "bg-red-900/20 border-red-500/50 text-red-400"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full ${
                  walletInfo.can_request_withdrawal
                    ? "bg-green-400"
                    : "bg-red-400"
                } animate-pulse`}
              ></div>
              <span className="font-medium">
                {walletInfo.can_request_withdrawal
                  ? "✓ You can request withdrawals"
                  : "⚠ Withdrawal requests are currently disabled"}
              </span>
              {walletInfo.last_updated && (
                <span className="text-xs text-gray-400 ml-auto">
                  Last updated:{" "}
                  {new Date(walletInfo.last_updated).toLocaleString()}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Withdrawal Statistics */}
        {statistics && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Withdrawal Statistics (Last {statistics.period_days} Days)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Total Withdrawals */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <div className="flex flex-col">
                  <span className="text-gray-400 text-sm font-medium mb-2">
                    Total Withdrawals
                  </span>
                  <span className="text-3xl font-bold text-white">
                    {statistics.total_withdrawals || 0}
                  </span>
                </div>
              </div>

              {/* Completed */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <div className="flex flex-col">
                  <span className="text-gray-400 text-sm font-medium mb-2">
                    Completed
                  </span>
                  <span className="text-3xl font-bold text-green-400">
                    {statistics.completed_withdrawals || 0}
                  </span>
                </div>
              </div>

              {/* Pending */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <div className="flex flex-col">
                  <span className="text-gray-400 text-sm font-medium mb-2">
                    Pending
                  </span>
                  <span className="text-3xl font-bold text-yellow-400">
                    {statistics.pending_withdrawals || 0}
                  </span>
                </div>
              </div>

              {/* Failed */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <div className="flex flex-col">
                  <span className="text-gray-400 text-sm font-medium mb-2">
                    Failed
                  </span>
                  <span className="text-3xl font-bold text-red-400">
                    {statistics.failed_withdrawals || 0}
                  </span>
                </div>
              </div>

              {/* Average Withdrawal */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <div className="flex flex-col">
                  <span className="text-gray-400 text-sm font-medium mb-2">
                    Average Amount
                  </span>
                  <span className="text-3xl font-bold text-blue-400">
                    ${statistics.average_withdrawal || 0}
                  </span>
                </div>
              </div>

              {/* Success Rate */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <div className="flex flex-col">
                  <span className="text-gray-400 text-sm font-medium mb-2">
                    Success Rate
                  </span>
                  <span className="text-3xl font-bold text-emerald-400">
                    {statistics.success_rate || 0}%
                  </span>
                </div>
              </div>

              {/* Total Transactions */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <div className="flex flex-col">
                  <span className="text-gray-400 text-sm font-medium mb-2">
                    Total Transactions
                  </span>
                  <span className="text-3xl font-bold text-purple-400">
                    {statistics.total_transactions || 0}
                  </span>
                </div>
              </div>

              {/* Period Days */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <div className="flex flex-col">
                  <span className="text-gray-400 text-sm font-medium mb-2">
                    Period
                  </span>
                  <span className="text-3xl font-bold text-cyan-400">
                    {statistics.period_days || 0} Days
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Withdrawal Form */}
        <div className="bg-linear-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-8 mb-8 shadow-xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Withdraw Funds
            </h2>
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

        {/* Withdrawal History */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-700/50">
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Date
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Amount
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Fee
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Network
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Status
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-300">
                    OTP
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-300">
                    TXN ID
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((item, index) => (
                    <tr
                      key={item.id || index}
                      className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="p-4 text-gray-300">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-yellow-400" />
                          {item.date}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-green-400 font-semibold">
                            {item.amount} {item.currency || "USDT"}
                          </span>
                          {item.notes && (
                            <span className="text-xs text-gray-500 mt-1">
                              {item.notes}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-red-400 font-medium">
                        {item.fee
                          ? `${item.fee} ${item.currency || "USDT"}`
                          : "-"}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-gray-300 font-medium">
                            {item.network}
                          </span>
                          {item.wallet_address && (
                            <span className="text-xs text-gray-400 mt-1 break-all">
                              {item.wallet_address}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <StatusBadge
                          status={item.status}
                          label={item.status_label}
                        />
                      </td>
                      <td className="p-4">
                        {item.is_otp_verified ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Check className="w-3 h-3" /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        {item.transaction_id ? (
                          <div className="flex flex-col">
                            <span className="text-blue-400 font-mono text-sm">
                              #{item.transaction_id}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                      No withdrawal history available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-4 border-t border-slate-700 bg-slate-700/30">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-400">
                <select
                  value={entriesPerPage}
                  onChange={handleEntriesPerPageChange}
                  className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {ENTRIES_PER_PAGE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option} entries
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-sm text-gray-400">
                Showing{" "}
                {pagination?.total > 0
                  ? ((pagination?.current_page || 1) - 1) *
                      (pagination?.per_page || DEFAULT_ENTRIES_PER_PAGE) +
                    1
                  : 0}{" "}
                to{" "}
                {Math.min(
                  (pagination?.current_page || 1) *
                    (pagination?.per_page || DEFAULT_ENTRIES_PER_PAGE),
                  pagination?.total || 0
                )}{" "}
                of {pagination?.total || 0} entries
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center space-x-2">
                <PaginationButton
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </PaginationButton>

                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <PaginationButton
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        isActive={currentPage === pageNum}
                      >
                        {pageNum}
                      </PaginationButton>
                    );
                  })}
                </div>

                <PaginationButton
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </PaginationButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
