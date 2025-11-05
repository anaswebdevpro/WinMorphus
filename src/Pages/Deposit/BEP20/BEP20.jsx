import React, { useCallback, useEffect, useState } from "react";
import { Copy, Check, AlertCircle, QrCode, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAuth } from "../../../Context/UseAuth";
import { apiRequest } from "../../../Services/Api";
import { DEPOSIT_METHODS_TYPE_USDT_TRC20_URL } from "../../../Api/Api_variables";

const BEP20 = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [DepositMethod, setDepositMethod] = useState(null);
  const { token } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const handleCopyAddress = () => {
    if (DepositMethod?.wallet_address) {
      navigator.clipboard.writeText(DepositMethod.wallet_address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const FetchMethods = useCallback(() => {
    setLoading(true);
    apiRequest({
      endpoint: DEPOSIT_METHODS_TYPE_USDT_TRC20_URL,
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

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/deposit")}
          className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Deposit
        </button>

        {/* Header with Status */}
        <div
          className="rounded-lg p-6 mb-8 flex items-start justify-between"
          style={{
            background: DepositMethod?.color_theme
              ? `linear-gradient(to right, ${DepositMethod.color_theme}, ${DepositMethod.color_theme}99)`
              : "linear-gradient(to right, rgb(5, 150, 105), rgb(5, 150, 105))",
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="p-3 rounded-full"
              style={{
                backgroundColor: DepositMethod?.color_theme || "#059669",
              }}
            >
              <span className="text-2xl text-white font-bold">₮</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {DepositMethod?.name || "Loading..."}
              </h1>
              <p className="text-white/80 text-sm">
                {DepositMethod?.description || "Cryptocurrency Payment"}
              </p>
            </div>
          </div>
          <div
            className="text-white px-4 py-2 rounded-full font-bold text-sm"
            style={{ backgroundColor: DepositMethod?.color_theme || "#059669" }}
          >
            Active
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - QR Code */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
              <h2 className="text-lg font-bold text-white mb-3">Scan to Pay</h2>
              <p className="text-gray-400 text-sm mb-6">
                Use your crypto wallet to scan
              </p>

              <div className="bg-white p-6 rounded-lg mb-6 border-4 border-dashed border-emerald-500">
                <div className="bg-white w-full aspect-square flex items-center justify-center rounded">
                  <QrCode className="w-32 h-32 text-gray-800" />
                </div>
              </div>

              <p className="text-emerald-400 text-xs text-center font-semibold">
                Secure Payment
              </p>
            </div>
          </div>

          {/* Right Column - Payment Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Currency and Network Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-100 rounded-lg p-6">
                <p className="text-blue-600 text-xs font-bold uppercase mb-2">
                  Currency
                </p>
                <p className="text-slate-900 text-2xl font-bold">
                  {DepositMethod?.currency || "USDT"}
                </p>
              </div>
              <div className="bg-orange-100 rounded-lg p-6">
                <p className="text-orange-600 text-xs font-bold uppercase mb-2">
                  Network
                </p>
                <p className="text-slate-900 text-2xl font-bold">
                  {DepositMethod?.network || "BEP20"}
                </p>
              </div>
            </div>

            {/* Wallet Address */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-white font-bold mb-4">Wallet Address</h3>
              <div className="bg-slate-700 border border-slate-600 rounded-lg p-4 mb-4 flex items-center justify-between gap-4">
                <p className="text-gray-300 font-mono text-sm break-all">
                  {DepositMethod?.wallet_address || "Loading..."}
                </p>
                <button
                  onClick={handleCopyAddress}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors shrink-0 flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Address
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Payment Instructions */}
            <div
              className="border-2 rounded-lg p-6"
              style={{
                backgroundColor: DepositMethod?.color_theme
                  ? `${DepositMethod.color_theme}20`
                  : "rgb(236, 253, 245)",
                borderColor: DepositMethod?.color_theme || "#10b981",
              }}
            >
              <h3
                className="font-bold mb-4"
                style={{ color: DepositMethod?.color_theme || "#047857" }}
              >
                Payment Instructions
              </h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div
                    className="text-white w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
                    style={{
                      backgroundColor: DepositMethod?.color_theme || "#10b981",
                    }}
                  >
                    1
                  </div>
                  <p
                    className="text-sm"
                    style={{ color: DepositMethod?.color_theme || "#047857" }}
                  >
                    Scan QR code with wallet app
                  </p>
                </div>
                <div className="flex gap-3">
                  <div
                    className="text-white w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
                    style={{
                      backgroundColor: DepositMethod?.color_theme || "#10b981",
                    }}
                  >
                    2
                  </div>
                  <p
                    className="text-sm"
                    style={{ color: DepositMethod?.color_theme || "#047857" }}
                  >
                    Or copy wallet address manually
                  </p>
                </div>
                <div className="flex gap-3">
                  <div
                    className="text-white w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
                    style={{
                      backgroundColor: DepositMethod?.color_theme || "#10b981",
                    }}
                  >
                    3
                  </div>
                  <p
                    className="text-sm"
                    style={{ color: DepositMethod?.color_theme || "#047857" }}
                  >
                    Send only {DepositMethod?.currency || "USDT"} tokens
                  </p>
                </div>
                <div className="flex gap-3">
                  <div
                    className="text-white w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
                    style={{
                      backgroundColor: DepositMethod?.color_theme || "#10b981",
                    }}
                  >
                    4
                  </div>
                  <p
                    className="text-sm"
                    style={{ color: DepositMethod?.color_theme || "#047857" }}
                  >
                    Use {DepositMethod?.network || "BEP20"} network only
                  </p>
                </div>
              </div>
            </div>

            {/* Alert */}
            <div className="bg-blue-600/20 border border-blue-500/40 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-300 font-semibold text-sm mb-1">
                  Important
                </p>
                <p className="text-gray-300 text-sm">
                  Deposits will be confirmed within{" "}
                  {DepositMethod?.formatted_processing_time || "10-30 minutes"}{" "}
                  on the {DepositMethod?.network || "BEP20"} network. Min:{" "}
                  {DepositMethod?.min_amount} {DepositMethod?.currency}, Max:{" "}
                  {DepositMethod?.max_amount} {DepositMethod?.currency}. Fee:{" "}
                  {DepositMethod?.formatted_fee}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BEP20;
