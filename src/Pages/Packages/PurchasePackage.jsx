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
import { PACKAGES_URL, PACKAGES_PURCHASE, GET_BALANCE } from "../../Api/Api_variables";
import { useAuth } from "../../Context/UseAuth";
import { useSnackbar } from "notistack";
import ShimmerLoader from "../../Component/ui/ShimmerLoader";

const PurchasePackage = ({ isOpen, onClose, packageId }) => {
  const [packageDetails, setPackageDetails] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [balance, setBalance] = useState(null);

  const { token } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const PayableAmount =
    parseFloat(investmentAmount) +
    parseFloat(packageDetails?.commission_percentage || 0);
  console.log("Initiating purchase with amount:", PayableAmount);
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
 

  // fetchbalace for wallet 

   const fetchBalance = () => {
      if (!token) return;
  
      try {
        setIsLoading(true);
  
        apiRequest({
          endpoint: GET_BALANCE,
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((response) => {
            setBalance(response.data);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("Failed to fetch balance data:", error);
            const errorMessage =
              error?.message || "Failed to fetch balance data";
            enqueueSnackbar(errorMessage, { variant: "error" });
            setIsLoading(false);
          });
      } catch (error) {
        enqueueSnackbar(error?.message, { variant: "error" });
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

    setIsPurchasing(true);
    try {
      console.log("Initiating purchase with amount:", PayableAmount);
      apiRequest({
        endpoint: PACKAGES_PURCHASE,
        method: "POST",
        data: {
          package_id: packageId,
          amount,
        },

        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          console.log("Purchase Response:", response);
          setIsPurchasing(false);
          
          if (response.success === true) {
            enqueueSnackbar(
              response?.message || "Package purchased successfully!",
              {
                variant: "success",
              }
            );
            
            // Reset form state
            setInvestmentAmount("");
            
            // Delay closing to allow snackbar to show
            setTimeout(() => {
              onClose();
            }, 200);
          } else {
            enqueueSnackbar(
              response?.message || "Failed to purchase package. Please try again.",
              { variant: "error" }
            );
          }
        })
        .catch((error) => {
          setIsPurchasing(false);
          console.error("Failed to purchase package:", error);

          // Extract error message from API response
          const errorMessage =
            error?.response?.data?.error ||
            error?.response?.data?.message ||
            error?.message ||
            "Failed to purchase package. Please try again.";

          enqueueSnackbar(errorMessage, {
            variant: "error",
          });
        });
    } catch (error) {
      setIsPurchasing(false);
      console.error("Failed to purchase package:", error);

      // Extract error message from API response
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to purchase package. Please try again.";

      enqueueSnackbar(errorMessage, {
        variant: "error",
      });
    }
  };

  // Fetch data when modal opens
  useEffect(() => {
    if (isOpen && packageId) {
      fetchPackageDetails();
      fetchBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, packageId]);

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
                      {`${packageDetails?.monthly_roi}% Monthly`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Activation Fee:</span>
                    <span className="text-yellow-400 font-semibold">
                      $ {packageDetails.commission_percentage}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Range:</span>
                    <span className="text-cyan-400 font-semibold">
                      {packageDetails.formatted_range ||
                        `${packageDetails.min_amount} - ${
                          packageDetails.max_amount === 0 ||
                          packageDetails.max_amount === "0.00"
                            ? "Onwards"
                            : packageDetails.max_amount
                        } `}
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
                      $ {parseFloat(balance?.main_balance || 0).toFixed(2)} 
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

                <div className="space-y-4">
                  {/* Amount Display */}
                  <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                    <p className="text-gray-400 text-sm mb-1">
                      Selected Amount
                    </p>
                    <p className="text-3xl font-bold text-yellow-400">
                      {parseFloat(investmentAmount || 0).toFixed(2)} USDT
                    </p>
                  </div>

                  {/* Slider */}
                  <div>
                    <input
                      type="range"
                      min={packageDetails.min_amount}
                      max={
                        packageDetails.max_amount === 0 ||
                        packageDetails.max_amount === "0.00"
                          ? 100000
                          : packageDetails.max_amount
                      }
                      step="50"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
                      className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider-thumb"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                      <span>{packageDetails.min_amount} USDT</span>
                      <span>
                        {packageDetails.max_amount === "0.00"
                          ? "Onwards"
                          : packageDetails.max_amount}{" "}
                        USDT
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-500 text-xs flex items-center gap-1">
                    <span className="text-blue-400">ⓘ</span>
                    Amounts are in multiples of 50 USDT
                  </p>
                </div>
              </div>

              {/* Payment Summary */}
              <div>
                <div className="flex items-center gap-2 text-green-400 mb-4">
                  <TrendingUp className="w-5 h-5" />
                  <h3 className="font-semibold">Payment Summary</h3>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Investment Amount:</span>
                    <span className="text-white font-semibold">
                      ${parseFloat(investmentAmount || 0).toFixed(2)} USDT
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Activation Fee:</span>
                    <span className="text-yellow-400 font-semibold">
                      ${packageDetails.commission_percentage}
                    </span>
                  </div>
                  <hr className="border-slate-600" />
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-300 font-semibold">
                      Total Payable:
                    </span>
                    <span className="text-green-400 font-bold">
                      ${PayableAmount.toFixed(2)} USDT
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
              parseFloat(investmentAmount || 0) +
                parseFloat(packageDetails?.commission_percentage || 0) >
                parseFloat(balance?.main_balance || 0)
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
                {parseFloat(investmentAmount || 0) +
                  parseFloat(packageDetails?.commission_percentage || 0) >
                parseFloat(balance?.main_balance || 0)
                  ? "Insufficient Balance"
                  : "Confirm Purchase"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchasePackage;
