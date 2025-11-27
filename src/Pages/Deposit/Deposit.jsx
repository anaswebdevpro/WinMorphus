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
    // Use theme-safe accents for icons and badge borders. Card backgrounds use
    // the global card gradient so cards remain light-theme friendly.
    const colorSchemes = {
      TRC20: {
        iconColor: "text-(--status-success)",
        badgeBorder: "border-(--status-success)",
        accentClass: "from-(--status-success)/8",
        icon: TrendingUp,
      },
      BEP20: {
        iconColor: "text-(--accent-secondary)",
        badgeBorder: "border-(--accent-secondary)",
        accentClass: "from-(--accent-secondary)/8",
        icon: Wallet,
      },
    };
    return (
      colorSchemes[network] || {
        iconColor: "text-(--text-secondary)",
        badgeBorder: "border-(--border-secondary)",
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
      <div className="min-h-screen bg-(--bg-primary) text-(--text-primary)">
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
    <div className="min-h-screen bg-(--bg-primary) text-(--text-primary)">
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
        <div className="bg-(--bg-tertiary) border border-(--border-secondary) rounded-lg p-4 mb-8 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-(--accent-primary) shrink-0 mt-0.5" />
          <p className="text-sm text-(--text-secondary)">
            All deposits are processed securely. Your payment information is
            encrypted and protected.
          </p>
        </div>

        {/* USDT Options Grid */}
        <div>
          <h2 className="text-2xl font-bold text-(--text-primary) mb-6">
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
                    className={`bg-linear-to-br from-(--bg-card-gradient-start) to-(--bg-card-gradient-end) border-2 border-(--border-primary) rounded-2xl p-8 shadow-lg relative overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
                  >
                    {/* subtle per-card accent overlay for light theme */}
                    <div
                      className={`absolute inset-0 rounded-2xl pointer-events-none bg-gradient-to-br ${
                        colors.accentClass || "from-(--accent-primary)/6"
                      } to-transparent`}
                    />
                    {method.is_recommended && (
                      <div className="absolute top-2 left-4">
                        <span
                          className={`bg-(--bg-secondary) border ${colors.badgeBorder} text-(--text-primary) px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider`}
                        >
                          RECOMMENDED
                        </span>
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-8">
                      <div>
                        <h3 className="text-2xl font-bold text-(--text-primary)">
                          {method.name}
                        </h3>
                      </div>
                      <div
                        className={`p-3 rounded-lg flex items-center justify-center bg-(--bg-secondary) border border-(--border-secondary)`}
                      >
                        {React.createElement(colors.icon, {
                          className: `w-6 h-6 ${colors.iconColor}`,
                        })}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-(--text-secondary) font-medium">
                          Network:
                        </span>
                        <span className="text-(--text-primary) font-bold">
                          {method.network}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-(--text-secondary) font-medium">
                          Min Amount:
                        </span>
                        <span className="text-(--text-primary) font-bold">
                          {method.min_amount}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-(--text-secondary) font-medium">
                          Max Amount:
                        </span>
                        <span className="text-(--text-primary) font-bold">
                          {method.max_amount}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-(--text-secondary) font-medium">
                          Fee:
                        </span>
                        <span className="text-(--text-primary) font-bold">
                          {method.formatted_fee}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-(--text-secondary) font-medium">
                          Processing:
                        </span>
                        <span className="text-(--text-primary) font-bold">
                          {method.formatted_processing_time}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-(--text-muted)">
                No deposit methods available
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deposit;
