import React, { useState, useEffect } from "react";
import { DollarSign, Wallet, ArrowDownUp, RefreshCw } from "lucide-react";
import { useSnackbar } from "notistack";
import { useAuth } from "../../../Context/UseAuth";
import { apiRequest } from "../../../Services/Api";
import { GET_BALANCE, WITHDRAWAL_WALLET_INFO } from "../../../Api/Api_variables";

const WalletInfo = () => {
  const { token } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [walletInfo, setWalletInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(null);

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


    const fetchBalance = () => {
        if (!token) return;
    
        try {
          setLoading(true);
    
          apiRequest({
            endpoint: GET_BALANCE,
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          })
            .then((response) => {
              setBalance(response.data);
              setLoading(false);
            })
            .catch((error) => {
              console.error("Failed to fetch balance data:", error);
              const errorMessage =
                error?.message || "Failed to fetch balance data";
              enqueueSnackbar(errorMessage, { variant: "error" });
              setLoading(false);
            });
        } catch (error) {
          enqueueSnackbar(error?.message, { variant: "error" });
        }
      };

  useEffect(() => {
    fetchWalletInfo();
    fetchBalance();
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
    // {
    //   title: "Main Wallet",
    //   amount: walletInfo?.wallets?.main?.balance
    //     ? `${walletInfo.wallets.main.balance} ${
    //         walletInfo.wallets.main.currency || "USDT"
    //       }`
    //     : "0.00 USDT",
    //   icon: Wallet,
    //   gradient: "from-blue-900 to-slate-900",
    //   border: "border-blue-500",
    //   iconBg: "bg-blue-700/30",
    //   iconColor: "text-blue-400",
    // },
    {
      title: "Available Balance",
      amount: balance?.main_balance
        ? `$  ${parseFloat(balance.main_balance).toFixed(2)} `
        : "0.00 USDT",
      icon: DollarSign,
      gradient: "from-green-900 to-slate-900",
      border: "border-green-500",
      iconBg: "bg-green-700/30",
      iconColor: "text-green-400",
    },
    {
      title: "Total Withdrawals",
      amount: walletInfo?.total_withdrawals
        ? `$  ${parseFloat(walletInfo.total_withdrawals).toFixed(2)} `
        : "$ 0.00 ",
      icon: ArrowDownUp,
      gradient: "from-purple-900 to-slate-900",
      border: "border-purple-500",
      iconBg: "bg-purple-700/30",
      iconColor: "text-purple-400",
      subtitle: null,
    },
    {
      title: "Pending Requests",
      amount: walletInfo?.pending_requests || 0,
      icon: RefreshCw,
      gradient: "from-yellow-900 to-slate-900",
      border: "border-yellow-500",
      iconBg: "bg-yellow-700/30",
      iconColor: "text-yellow-400",
      subtitle: `Amount: ${walletInfo?.pending_withdrawals || 0} USDT`,
    },
  ];

  return (
    <>
      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {walletCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div
              key={index}
              className={`bg-linear-to-br ${card.gradient} border-2 ${card.border} rounded-lg p-6 shadow-lg hover:shadow-xl transition-all relative overflow-hidden`}
            >
              <div className="absolute top-4 right-4">
                <div className={`${card.iconBg} p-3 rounded-lg`}>
                  <IconComponent className={`w-6 h-6 ${card.iconColor}`} />
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <IconComponent className={`w-5 h-5 ${card.iconColor}`} />
                <p className="text-sm font-medium opacity-90">{card.title}</p>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                {card.amount}
              </h2>
              {card.subtitle && (
                <p className="text-xs opacity-75 mt-1">{card.subtitle}</p>
              )}
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
