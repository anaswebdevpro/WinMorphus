import React, { useState, useEffect } from "react";
import { DollarSign, Wallet, ArrowDownUp, RefreshCw } from "lucide-react";
import { useSnackbar } from "notistack";
import { useAuth } from "../../../Context/UseAuth";
import { apiRequest } from "../../../Services/Api";
import {
  GET_BALANCE,
  WITHDRAWAL_WALLET_INFO,
} from "../../../Api/Api_variables";

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
            console.log("Wallet Info:", response.data);
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
          const errorMessage = error?.message || "Failed to fetch balance data";
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
          <div key={i} className="bg-[var(--bg-card)] rounded-lg h-32"></div>
        ))}
      </div>
    );
  }

  // Wallet cards configuration
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
  const walletCards = [
    {
      title: "Available Balance",
      amount: balance?.main_balance
        ? `$  ${parseFloat(balance.main_balance).toFixed(2)} `
        : "0.00 USDT",
      icon: DollarSign,
      iconColor: "text-(--status-success)",
    },
    {
      title: "Total Withdrawals",
      amount: walletInfo?.total_withdrawals
        ? `$  ${parseFloat(walletInfo.total_withdrawals).toFixed(2)} `
        : "$ 0.00 ",
      icon: ArrowDownUp,
      iconColor: "text-(--accent-secondary)",
      subtitle: null,
    },
    {
      title: "Pending Requests",
      amount: walletInfo?.pending_requests || 0,
      icon: RefreshCw,
      iconColor: "text-(--status-warning)",
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
              className={`bg-linear-to-br from-(--bg-card-gradient-start) to-(--bg-card-gradient-end) border-2 border-(--border-primary) rounded-lg p-6 shadow-lg hover:shadow-xl transition-all relative overflow-hidden`}
            >
              <div className="absolute top-4 right-4">
                <div
                  className={`p-3 rounded-lg bg-(--bg-secondary) border border-(--border-secondary)`}
                >
                  <IconComponent className={`w-6 h-6 ${card.iconColor}`} />
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <IconComponent className={`w-5 h-5 ${card.iconColor}`} />
                <p className="text-sm font-medium text-(--text-secondary)">
                  {card.title}
                </p>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-(--text-primary) mb-1">
                {card.amount}
              </h2>
              {card.subtitle && (
                <p className="text-xs text-(--text-muted) mt-1">
                  {card.subtitle}
                </p>
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
              ? "bg-linear-to-r from-green-900/30 to-green-800/20 border-(--status-success)/60 text-(--status-success)"
              : "bg-linear-to-r from-red-900/30 to-red-800/20 border-(--status-error)/60 text-(--status-error)"
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
            <span className="font-semibold text-(--text-primary)">
              {walletInfo.can_request_withdrawal
                ? "✓ You can request withdrawals"
                : "⚠ Withdrawal requests are currently disabled"}
            </span>
            {walletInfo.last_updated && (
              <span className="text-xs text-(--text-muted) ml-auto">
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
