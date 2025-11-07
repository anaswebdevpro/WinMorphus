import React, { useState, useEffect } from "react";
import { DollarSign, Wallet, ArrowDownUp, RefreshCw } from "lucide-react";
import { useSnackbar } from "notistack";
import { useAuth } from "../../../Context/UseAuth";
import { apiRequest } from "../../../Services/Api";
import { WITHDRAWAL_WALLET_INFO } from "../../../Api/Api_variables";

const WalletInfo = () => {
  const { token } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [walletInfo, setWalletInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch wallet info
  const fetchWalletInfo = () => {
    if (!token) return;

    setLoading(true);
    try {
      apiRequest({
        endpoint: WITHDRAWAL_WALLET_INFO,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          if (response?.data) {
            setWalletInfo(response.data);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching wallet info:", error);
          enqueueSnackbar(
            error.message || "Failed to load wallet information",
            {
              variant: "error",
            }
          );
          setLoading(false);
        });
    } catch (error) {
      console.error("Error fetching wallet info:", error);
      enqueueSnackbar(error.message || "Failed to load wallet information", {
        variant: "error",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-slate-800 rounded-lg h-32"></div>
        ))}
      </div>
    );
  }

  // Wallet cards configuration
  const walletCards = [
    {
      title: "Main Wallet",
      amount: walletInfo?.wallets?.main?.balance
        ? `${walletInfo.wallets.main.balance} ${
            walletInfo.wallets.main.currency || "USDT"
          }`
        : "0.00 USDT",
      icon: Wallet,
      bgColor: "bg-gradient-to-br from-blue-600 to-blue-700",
      iconBgColor: "bg-blue-500/30",
    },
    {
      title: "Available Balance",
      amount: walletInfo?.wallets?.available?.balance
        ? `${walletInfo.wallets.available.balance} ${
            walletInfo.wallets.available.currency || "USDT"
          }`
        : "0.00 USDT",
      icon: DollarSign,
      bgColor: "bg-gradient-to-br from-emerald-600 to-emerald-700",
      iconBgColor: "bg-emerald-500/30",
    },
    {
      title: "Total Withdrawals",
      amount: walletInfo?.total_withdrawals
        ? `${walletInfo.total_withdrawals} USDT`
        : "0.00 USDT",
      icon: ArrowDownUp,
      bgColor: "bg-gradient-to-br from-purple-600 to-purple-700",
      iconBgColor: "bg-purple-500/30",
      subtitle: null,
    },
    {
      title: "Pending Requests",
      amount: walletInfo?.pending_requests || 0,
      icon: RefreshCw,
      bgColor: "bg-gradient-to-br from-amber-600 to-amber-700",
      iconBgColor: "bg-amber-500/30",
      subtitle: `Amount: ${walletInfo?.pending_withdrawals || 0} USDT`,
    },
  ];

  return (
    <>
      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {walletCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div
              key={index}
              className={`${card.bgColor} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-white/90 text-sm font-semibold mb-2">
                    {card.title}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold">
                    {card.amount}
                  </p>
                  {card.subtitle && (
                    <p className="text-white/80 text-xs mt-2">
                      {card.subtitle}
                    </p>
                  )}
                </div>
                <div
                  className={`${card.iconBgColor} p-3 rounded-lg backdrop-blur-sm`}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Withdrawal Status Alert */}
      {walletInfo && (
        <div
          className={`mb-8 p-4 rounded-xl border-2 shadow-md ${
            walletInfo.can_request_withdrawal
              ? "bg-linear-to-r from-green-900/30 to-green-800/20 border-green-500/60 text-green-400"
              : "bg-linear-to-r from-red-900/30 to-red-800/20 border-red-500/60 text-red-400"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                walletInfo.can_request_withdrawal
                  ? "bg-green-400 shadow-lg shadow-green-400/50"
                  : "bg-red-400 shadow-lg shadow-red-400/50"
              } animate-pulse`}
            ></div>
            <span className="font-semibold">
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
    </>
  );
};

export default WalletInfo;
