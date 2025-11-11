import React, { useCallback, useEffect, useState } from "react";
import { AlertCircle, TrendingUp, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/UseAuth";
import { useSnackbar } from "notistack";
import { apiRequest } from "../../Services/Api";
import { DEPOSIT_METHODS_URL } from "../../Api/Api_variables";
import { ShimmerLoader, PageHeader } from "../../Component/ui";

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
        gradient: "from-teal-900 to-slate-900",
        border: "border-teal-500",
        iconBg: "bg-teal-700/30",
        iconColor: "text-teal-400",
        badgeBg: "bg-teal-500/20",
        badgeBorder: "border-teal-400",
        icon: TrendingUp,
      },
      BEP20: {
        gradient: "from-purple-900 to-slate-900",
        border: "border-purple-500",
        iconBg: "bg-purple-700/30",
        iconColor: "text-purple-400",
        badgeBg: "bg-purple-500/20",
        badgeBorder: "border-purple-400",
        icon: Wallet,
      },
    };
    return (
      colorSchemes[network] || {
        gradient: "from-gray-900 to-slate-900",
        border: "border-gray-500",
        iconBg: "bg-gray-700/30",
        iconColor: "text-gray-400",
        badgeBg: "bg-gray-500/20",
        badgeBorder: "border-gray-400",
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto p-6">
          <PageHeader
            title="Deposit Funds"
            description="Choose your preferred cryptocurrency deposit method"
          />
          <ShimmerLoader variant="dashboard" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto p-6">
        <PageHeader
          title="Deposit Funds"
          description="Choose your preferred cryptocurrency deposit method"
        />
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
            {DepositMethod && DepositMethod.length > 0 ? (
              DepositMethod.map((method) => {
                const colors = getColorScheme(method.network);
                return (
                  <div
                    key={method.id}
                    onClick={() => handleNavigate(method.network)}
                    className={`bg-linear-to-br ${colors.gradient} border-2 ${colors.border} rounded-2xl p-8 shadow-lg relative overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
                  >
                    {method.is_recommended && (
                      <div className="absolute top-4 left-4">
                        <span
                          className={`${colors.badgeBg} border ${colors.badgeBorder} text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider`}
                        >
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
                        className={`${colors.iconBg} p-3 rounded-lg flex items-center justify-center`}
                      >
                        {React.createElement(colors.icon, {
                          className: `w-6 h-6 ${colors.iconColor}`,
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
