import React, { useState, useEffect } from "react";
import {
  X,
  Package,
  DollarSign,
  TrendingUp,
  Wallet,
  CheckCircle,
} from "lucide-react";
import { apiRequest } from "../../Services/Api";
import {
  PACKAGES_URL,
  PACKAGES_WALLET_BALANCE,
  PACKAGES_PURCHASE,
} from "../../Api/Api_variables";
import { useAuth } from "../../Context/UseAuth";
import { useSnackbar } from "notistack";
import ShimmerLoader from "../../Component/ui/ShimmerLoader";

const PurchasePackage = ({ isOpen, onClose, packageId }) => {
  const [packageDetails, setPackageDetails] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { token } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  // Fetch package details by ID
  const fetchPackageDetails = () => {
    if (!packageId || !token) return;

    setIsLoading(true);
    try {
      apiRequest({
        endpoint: `${PACKAGES_URL}/${packageId}`,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          console.log("Package Details Response:", response);
          setIsLoading(false);

          // Extract package data from response
          const packageData = response.data;

          if (packageData) {
            setPackageDetails(packageData);
            // Set default investment amount to minimum
            setInvestmentAmount(packageData.min_amount || "");
          } else {
            enqueueSnackbar("Package not found", { variant: "error" });
            onClose();
          }
        })
        .catch((error) => {
          setIsLoading(false);
          console.error("Failed to fetch package details:", error);
          enqueueSnackbar("Failed to fetch package details: " + error.message, {
            variant: "error",
          });
        });
    } catch (error) {
      setIsLoading(false);
      console.error("Failed to fetch package details:", error);
      enqueueSnackbar("Failed to fetch package details. Please try again.", {
        variant: "error",
      });
    }
  };

  // Fetch wallet balance
  const fetchWalletBalance = () => {
    if (!token) return;

    try {
      apiRequest({
        endpoint: PACKAGES_WALLET_BALANCE,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          console.log("Wallet Balance Response:", response);

          // Handle different response structures
          const balance = response.data?.balance || response.balance || 0;
          setWalletBalance(parseFloat(balance));
        })
        .catch((error) => {
          console.error("Failed to fetch wallet balance:", error);
          enqueueSnackbar("Failed to fetch wallet balance: " + error.message, {
            variant: "error",
          });
        });
    } catch (error) {
      console.error("Failed to fetch wallet balance:", error);
      enqueueSnackbar("Failed to fetch wallet balance. Please try again.", {
        variant: "error",
      });
    }
  };

  // Handle purchase
  const handlePurchase = () => {
    if (!token || !packageDetails) return;

    const amount = parseFloat(investmentAmount);

    // Validation
    if (!amount || isNaN(amount)) {
      enqueueSnackbar("Please enter a valid investment amount", {
        variant: "error",
      });
      return;
    }

    if (amount < parseFloat(packageDetails.min_amount)) {
      enqueueSnackbar(
        `Minimum investment is ${packageDetails.min_amount} USDT`,
        { variant: "error" }
      );
      return;
    }

    if (
      packageDetails.max_amount &&
      amount > parseFloat(packageDetails.max_amount)
    ) {
      enqueueSnackbar(
        `Maximum investment is ${packageDetails.max_amount} USDT`,
        { variant: "error" }
      );
      return;
    }

    if (amount > walletBalance) {
      enqueueSnackbar("Insufficient wallet balance", { variant: "error" });
      return;
    }

    setIsPurchasing(true);
    try {
      apiRequest({
        endpoint: PACKAGES_PURCHASE,
        method: "POST",
        data: {
          package_id: packageId,
          amount: amount,
        },
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          console.log("Purchase Response:", response);
          setIsPurchasing(false);

          enqueueSnackbar(
            response?.message || "Package purchased successfully!",
            {
              variant: "success",
            }
          );

          // Reset and close
          setInvestmentAmount("");
          onClose();
        })
        .catch((error) => {
          setIsPurchasing(false);
          console.error("Failed to purchase package:", error);
          enqueueSnackbar("Failed to purchase package: " + error.message, {
            variant: "error",
          });
        });
    } catch (error) {
      setIsPurchasing(false);
      console.error("Failed to purchase package:", error);
      enqueueSnackbar("Failed to purchase package. Please try again.", {
        variant: "error",
      });
    }
  };

  // Fetch data when modal opens
  useEffect(() => {
    if (isOpen && packageId) {
      fetchPackageDetails();
      fetchWalletBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, packageId]);

  // Calculate expected ROI and remaining balance
  const calculateValues = () => {
    const amount = parseFloat(investmentAmount) || 0;
    const rate = parseFloat(packageDetails?.rate_percentage || 0);
    const expectedROI = (amount * rate) / 100;
    const remainingBalance = walletBalance - amount;

    return {
      expectedROI: expectedROI.toFixed(2),
      remainingBalance: remainingBalance.toFixed(2),
    };
  };

  const { expectedROI, remainingBalance } = packageDetails
    ? calculateValues()
    : { expectedROI: 0, remainingBalance: 0 };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 ">
      <div className="relative w-full max-w-lg mx-4 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-white">
            Confirm Package Purchase
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {isLoading ? (
            <ShimmerLoader variant="dashboard" />
          ) : packageDetails ? (
            <>
              {/* Package Details */}
              <div>
                <div className="flex items-center gap-2 text-blue-400 mb-4">
                  <Package className="w-5 h-5" />
                  <h3 className="font-semibold">Package Details</h3>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Package:</span>
                    <span className="text-purple-400 font-semibold">
                      {packageDetails.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rate:</span>
                    <span className="text-green-400 font-semibold">
                      {packageDetails.formatted_rate ||
                        `${packageDetails.rate_percentage}% P.A.`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Commission:</span>
                    <span className="text-yellow-400 font-semibold">
                      {packageDetails.commission_percentage}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Range:</span>
                    <span className="text-cyan-400 font-semibold">
                      {packageDetails.formatted_range ||
                        `${packageDetails.min_amount} - ${
                          packageDetails.max_amount || "∞"
                        } USDT`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Wallet Balance */}
              <div className="bg-linear-to-r from-cyan-600 to-blue-600 rounded-xl p-5 shadow-lg">
                <div className="flex items-center gap-2 text-white mb-3">
                  <Wallet className="w-5 h-5" />
                  <h3 className="font-semibold">Wallet Balance</h3>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm">Available Balance</p>
                    <p className="text-2xl font-bold text-white">
                      {walletBalance.toFixed(2)} USDT
                    </p>
                  </div>
                </div>
              </div>

              {/* Investment Amount */}
              <div>
                <div className="flex items-center gap-2 text-yellow-400 mb-4">
                  <DollarSign className="w-5 h-5" />
                  <h3 className="font-semibold">Investment Amount</h3>
                </div>

                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    Amount (USDT)
                  </label>
                  <input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    placeholder="Enter amount"
                    min={packageDetails.min_amount}
                    max={packageDetails.max_amount || walletBalance}
                    step="0.01"
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                  <p className="text-gray-500 text-xs mt-2 flex items-center gap-1">
                    <span className="text-blue-400">ⓘ</span>
                    Min: {packageDetails.min_amount} USDT | Max:{" "}
                    {packageDetails.max_amount || 50000} USDT
                  </p>
                </div>
              </div>

              {/* Purchase Summary */}
              <div>
                <div className="flex items-center gap-2 text-purple-400 mb-4">
                  <TrendingUp className="w-5 h-5" />
                  <h3 className="font-semibold">Purchase Summary</h3>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Investment Amount:</span>
                    <span className="text-blue-400 font-bold text-lg">
                      {parseFloat(investmentAmount || 0).toFixed(2)} USDT
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Expected ROI:</span>
                    <span className="text-green-400 font-bold">
                      {expectedROI} USDT/year
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Remaining Balance:</span>
                    <span
                      className={`font-bold ${
                        parseFloat(remainingBalance) < 0
                          ? "text-red-400"
                          : "text-cyan-400"
                      }`}
                    >
                      {remainingBalance} USDT
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-400">
              Package not found
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-slate-800 border-t border-slate-700 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            disabled={isPurchasing}
            className="flex-1 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handlePurchase}
            disabled={
              isPurchasing ||
              isLoading ||
              !packageDetails ||
              parseFloat(remainingBalance) < 0
            }
            className="flex-1 px-6 py-3 bg-green-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
          >
            {isPurchasing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Confirm Purchase
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchasePackage;
