import React, { useState, useMemo, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  DollarSign,
  Wallet,
  RefreshCw,
  Copy,
  Check,
  Calendar,
  ArrowDownUp,
} from "lucide-react";

// Constants
const ENTRIES_PER_PAGE_OPTIONS = [5, 10, 25];
const DEFAULT_ENTRIES_PER_PAGE = 10;
const DEBOUNCE_DELAY = 300;

// Validation Schema
const withdrawalValidationSchema = Yup.object().shape({
  amount: Yup.number()
    .required("Amount is required")
    .positive("Amount must be greater than 0")
    .typeError("Amount must be a number")
    .min(10, "Minimum withdrawal is 10 USDT")
    .max(10000, "Maximum withdrawal is 10000 USDT"),
  wallet: Yup.string().required("Please select a wallet"),
  network: Yup.string().required("Please select a network"),
  address: Yup.string()
    .required("Wallet address is required")
    .min(20, "Invalid wallet address"),
});

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

const StatusBadge = ({ status }) => {
  const statusConfig = {
    approved: { bg: "bg-green-100", text: "text-green-800", label: "Approved" },
    pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
    completed: { bg: "bg-blue-100", text: "text-blue-800", label: "Completed" },
    failed: { bg: "bg-red-100", text: "text-red-800", label: "Failed" },
    cancelled: { bg: "bg-gray-100", text: "text-gray-800", label: "Cancelled" },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
};

const Withdraw = () => {
  const [entriesPerPage, setEntriesPerPage] = useState(
    DEFAULT_ENTRIES_PER_PAGE
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Mock balance data
  const balanceData = {
    available: "0.00 USDT",
    mainWallet: "9500.00 USDT",
  };

  // Fetch withdrawal history
  useEffect(() => {
    const mockHistoryData = [
      {
        id: 1,
        date: "Aug 16, 2025, 02:00 PM",
        amount: "500.00 USDT",
        network: "TRC20",
        status: "approved",
        address: "TQeHwj...XXXX",
      },
      {
        id: 2,
        date: "Aug 15, 2025, 10:30 AM",
        amount: "1000.00 USDT",
        network: "BEP20",
        status: "completed",
        address: "0x123a...XXXX",
      },
      {
        id: 3,
        date: "Aug 14, 2025, 03:45 PM",
        amount: "250.00 USDT",
        network: "TRC20",
        status: "pending",
        address: "TQeHwj...XXXX",
      },
      {
        id: 4,
        date: "Aug 13, 2025, 09:15 AM",
        amount: "750.00 USDT",
        network: "BEP20",
        status: "failed",
        address: "0x456b...XXXX",
      },
      {
        id: 5,
        date: "Aug 12, 2025, 05:20 PM",
        amount: "300.00 USDT",
        network: "TRC20",
        status: "cancelled",
        address: "TQeHwj...XXXX",
      },
    ];

    setLoading(true);
    setTimeout(() => {
      setWithdrawalHistory(mockHistoryData);
      setLoading(false);
    }, 500);
  }, []);

  // Filter data by status
  const filteredData = useMemo(() => {
    if (activeTab === "all") return withdrawalHistory;
    return withdrawalHistory.filter((item) => item.status === activeTab);
  }, [withdrawalHistory, activeTab]);

  // Paginate data
  const paginatedData = useMemo(
    () =>
      filteredData.slice(
        (currentPage - 1) * entriesPerPage,
        currentPage * entriesPerPage
      ),
    [filteredData, currentPage, entriesPerPage]
  );

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      amount: "",
      wallet: "available",
      network: "TRC20",
      address: "",
    },
    validationSchema: withdrawalValidationSchema,
    onSubmit: async (values) => {
      setSubmitLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log("Withdrawal submitted:", values);
        // Reset form
        formik.resetForm();
        alert("Withdrawal request submitted successfully!");
      } catch (error) {
        console.error("Error submitting withdrawal:", error);
      } finally {
        setSubmitLoading(false);
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <BalanceCard
            title="Available Balance"
            amount={balanceData.available}
            icon={DollarSign}
            bgColor="bg-green-500"
            textColor="text-white"
          />
          <BalanceCard
            title="Main Wallet Balance"
            amount={balanceData.mainWallet}
            icon={Wallet}
            bgColor="bg-blue-600"
            textColor="text-white"
          />
        </div>

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
                  💡 Min: 10 USDT | Max: 10,000 USDT
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
                  <option value="available">Available Balance</option>
                  <option value="mainWallet">Main Wallet</option>
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
                  <option value="TRC20">TRC20 - Fee: 1 USDT</option>
                  <option value="BEP20">BEP20 - Fee: 1 USDT</option>
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
          {/* Tabs */}
          <div className="flex border-b border-slate-700 overflow-x-auto">
            {[
              "all",
              "pending",
              "completed",
              "approved",
              "failed",
              "cancelled",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
                className={`px-4 py-3 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? "text-blue-400 border-b-2 border-blue-400 bg-slate-700/50"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

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
                    Network
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Status
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Actions
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
                      <td className="p-4 text-green-400 font-semibold">
                        {item.amount}
                      </td>
                      <td className="p-4 text-gray-300">{item.network}</td>
                      <td className="p-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="p-4">
                        <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
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
                {paginatedData.length > 0
                  ? (currentPage - 1) * entriesPerPage + 1
                  : 0}{" "}
                to {Math.min(currentPage * entriesPerPage, filteredData.length)}{" "}
                of {filteredData.length} entries
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
