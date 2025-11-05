import React, { useCallback, useEffect, useState } from "react";
import { AlertCircle, TrendingUp, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/UseAuth";
import { useSnackbar } from "notistack";
import { apiRequest } from "../../Services/Api";
import { DEPOSIT_METHODS_URL } from "../../Api/Api_variables";

const Deposit = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [DepositMethod, setDepositMethod] = useState(null);
  const { token } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const FetchMethods = useCallback(() => {
    setLoading(true);
    apiRequest({
      endpoint: DEPOSIT_METHODS_URL,
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        console.log("Deposit Methods API Response:", response);

        // Handle both nested and direct data structures

        setDepositMethod(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch Deposit Methods:", error);
        const errorMessage =
          error?.message ||
          error?.response?.data?.message ||
          "Failed to fetch Deposit Methods";
        enqueueSnackbar(errorMessage, { variant: "error" });
        setLoading(false);
      });
  }, [token, enqueueSnackbar]);

  useEffect(() => {
    FetchMethods();
  }, []);

  const getColorScheme = (network) => {
    const colorSchemes = {
      TRC20: {
        color: "from-teal-600 to-teal-700",
        bgColor: "bg-teal-600",
        icon: TrendingUp,
      },
      BEP20: {
        color: "from-purple-600 to-purple-700",
        bgColor: "bg-purple-600",
        icon: Wallet,
      },
    };
    return (
      colorSchemes[network] || {
        color: "from-gray-600 to-gray-700",
        bgColor: "bg-gray-600",
        icon: Wallet,
      }
    );
  };

  const handleNavigate = (network) => {
    if (network === "TRC20") {
      navigate("/deposit/trc20");
    } else if (network === "BEP20") {
      navigate("/deposit/bep20");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-2">
            Deposit Funds
          </h1>
          <p className="text-gray-400">
            Choose your preferred cryptocurrency deposit method
          </p>
        </div>
        {console.log(
          "Rendering Deposit Component with Methods:",
          DepositMethod
        )}
        {/* Alert Banner */}
        <div className="bg-blue-600/20 border border-blue-500/40 rounded-lg p-4 mb-8 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <p className="text-sm text-gray-300">
            All deposits are processed securely. Your payment information is
            encrypted and protected.
          </p>
        </div>

        {/* USDT Options Grid */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">
            Cryptocurrency Deposit Options
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              <p className="text-gray-400">Loading deposit methods...</p>
            ) : DepositMethod && DepositMethod.length > 0 ? (
              DepositMethod.map((method) => {
                const colors = getColorScheme(method.network);
                return (
                  <div
                    key={method.id}
                    onClick={() => handleNavigate(method.network)}
                    className={`bg-linear-to-br ${colors.color} rounded-2xl p-8 shadow-lg relative overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
                  >
                    {method.is_recommended && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-black/40 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                          RECOMMENDED
                        </span>
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-8">
                      <div>
                        <h3 className="text-2xl font-bold text-white">
                          {method.name}
                        </h3>
                      </div>
                      <div
                        className={`${colors.bgColor} p-3 rounded-full flex items-center justify-center`}
                      >
                        {React.createElement(colors.icon, {
                          className: "w-6 h-6 text-white",
                        })}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white/80 font-medium">
                          Network:
                        </span>
                        <span className="text-white font-bold">
                          {method.network}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/80 font-medium">
                          Min Amount:
                        </span>
                        <span className="text-white font-bold">
                          {method.min_amount}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/80 font-medium">
                          Max Amount:
                        </span>
                        <span className="text-white font-bold">
                          {method.max_amount}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/80 font-medium">Fee:</span>
                        <span className="text-white font-bold">
                          {method.formatted_fee}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/80 font-medium">
                          Processing:
                        </span>
                        <span className="text-white font-bold">
                          {method.formatted_processing_time}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-400">No deposit methods available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deposit;
