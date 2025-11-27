import React, { useCallback, useEffect, useState } from "react";
import { Copy, Check, AlertCircle, QrCode, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAuth } from "../../../Context/UseAuth";
import { apiRequest } from "../../../Services/Api";
import { QRCodeSVG } from "qrcode.react";
import {
  DEPOSIT_METHODS_TYPE_USDT_BEP20_URL,
  DEPOSIT_METHODS_TYPE_USDT_TRC20_URL,
} from "../../../Api/Api_variables";

const BEP20 = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [DepositMethod, setDepositMethod] = useState(null);
  const { token } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const handleCopyAddress = () => {
    if (DepositMethod?.address) {
      navigator.clipboard.writeText(DepositMethod.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const FetchMethods = useCallback(() => {
    setLoading(true);
    apiRequest({
      endpoint: DEPOSIT_METHODS_TYPE_USDT_BEP20_URL,
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
    <div className="min-h-screen bg-(--bg-primary) text-(--text-primary)">
      <div className="max-w-7xl mx-auto p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/deposit")}
          className="flex items-center gap-2 text-(--accent-primary) hover:text-(--accent-hover) mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Deposit
        </button>

        {/* Header with Status */}
        <div className="rounded-lg p-6 mb-8 flex items-start justify-between bg-gradient-to-r from-(--status-success)/90 to-(--status-success)/60">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-(--status-success)">
              <span className="text-2xl text-(--bg-card) font-bold">₮</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-(--bg-card)">BEP20</h1>
              <p className="text-(--bg-card)/80 text-sm">
                {DepositMethod?.description || "Cryptocurrency Payment"}
              </p>
            </div>
          </div>
          <div className="text-(--bg-card) px-4 py-2 rounded-full font-bold text-sm bg-(--status-success)">
            Active
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - QR Code */}
          <div className="lg:col-span-1">
            <div className="bg-(--bg-card) border border-(--border-primary) rounded-lg p-8">
              <h2 className="text-lg font-bold text-(--text-primary) mb-3">
                Scan to Pay
              </h2>
              <p className="text-(--text-secondary) text-sm mb-6">
                Use your crypto wallet to scan
              </p>

              <div className="bg-(--bg-primary) p-6 rounded-lg mb-6 border-4 border-dashed border-(--status-success)">
                <div className="bg-(--bg-primary) w-full aspect-square flex items-center justify-center rounded">
                  <QRCodeSVG
                    value={DepositMethod?.address || ""}
                    className="w-full h-full text-(--text-primary)"
                  />
                </div>
              </div>

              <p className="text-(--status-success) text-xs text-center font-semibold">
                Secure Payment
              </p>
            </div>
          </div>

          {/* Right Column - Payment Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Currency and Network Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-(--bg-tertiary) rounded-lg p-6">
                <p className="text-(--accent-primary) text-xs font-bold uppercase mb-2">
                  Currency
                </p>
                <p className="text-(--text-primary) text-2xl font-bold">
                  {DepositMethod?.currency || "USDT"}
                </p>
              </div>
              <div className="bg-(--bg-tertiary) rounded-lg p-6">
                <p className="text-(--accent-secondary) text-xs font-bold uppercase mb-2">
                  Network
                </p>
                <p className="text-(--text-primary) text-2xl font-bold">
                  {DepositMethod?.network || "BEP20"}
                </p>
              </div>
            </div>

            {/* Wallet Address */}
            <div className="bg-(--bg-card) border border-(--border-primary) rounded-lg p-6">
              <h3 className="text-(--text-primary) font-bold mb-4">
                Wallet Address
              </h3>
              <div className="bg-(--bg-secondary) border border-(--border-secondary) rounded-lg p-4 mb-4 flex items-center justify-between gap-4">
                <p className="text-(--text-secondary) font-mono text-sm break-all">
                  {DepositMethod?.address || "NA..."}
                </p>
                <button
                  onClick={handleCopyAddress}
                  className="bg-(--accent-primary) hover:bg-(--accent-hover) text-(--bg-card) font-bold py-2 px-6 rounded-lg transition-colors shrink-0 flex items-center gap-2"
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
            <div className="border-2 rounded-lg p-6 bg-(--bg-tertiary) border-(--status-success)">
              <h3 className="font-bold mb-4 text-(--status-success)">
                Payment Instructions
              </h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="text-(--bg-card) w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-sm font-bold bg-(--status-success)">
                    1
                  </div>
                  <p className="text-sm text-(--status-success)">
                    Scan QR code with wallet app
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="text-(--bg-card) w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-sm font-bold bg-(--status-success)">
                    2
                  </div>
                  <p className="text-sm text-(--status-success)">
                    Or copy wallet address manually
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="text-(--bg-card) w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-sm font-bold bg-(--status-success)">
                    3
                  </div>
                  <p className="text-sm text-(--status-success)">
                    Send only {DepositMethod?.currency || "USDT"} tokens
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="text-(--bg-card) w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-sm font-bold bg-(--status-success)">
                    4
                  </div>
                  <p className="text-sm text-(--status-success)">
                    Use {DepositMethod?.network || "BEP20"} network only
                  </p>
                </div>
              </div>
            </div>

            {/* Alert */}
            <div className="bg-(--accent-primary)/10 border border-(--accent-primary)/40 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-(--accent-primary) shrink-0 mt-0.5" />
              <div>
                <p className="text-(--accent-primary) font-semibold text-sm mb-1">
                  Important
                </p>
                <p className="text-(--text-secondary) text-sm">
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
