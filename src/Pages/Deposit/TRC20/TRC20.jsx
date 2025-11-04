import React, { useState } from "react";
import { Copy, Check, AlertCircle, QrCode, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TRC20 = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const walletAddress = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
        <div className="bg-linear-to-r from-teal-600 to-teal-700 rounded-lg p-6 mb-8 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-teal-500 p-3 rounded-full">
              <span className="text-2xl text-white font-bold">₮</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">USDT TRC20</h1>
              <p className="text-teal-100 text-sm">TRC20 Network Payment</p>
            </div>
          </div>
          <div className="bg-teal-500 text-white px-4 py-2 rounded-full font-bold text-sm">
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

              <div className="bg-white p-6 rounded-lg mb-6 border-4 border-dashed border-teal-500">
                <div className="bg-white w-full aspect-square flex items-center justify-center rounded">
                  <QrCode className="w-32 h-32 text-gray-800" />
                </div>
              </div>

              <p className="text-teal-400 text-xs text-center font-semibold">
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
                <p className="text-slate-900 text-2xl font-bold">USDT</p>
              </div>
              <div className="bg-orange-100 rounded-lg p-6">
                <p className="text-orange-600 text-xs font-bold uppercase mb-2">
                  Network
                </p>
                <p className="text-slate-900 text-2xl font-bold">TRC20</p>
              </div>
            </div>

            {/* Wallet Address */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-white font-bold mb-4">Wallet Address</h3>
              <div className="bg-slate-700 border border-slate-600 rounded-lg p-4 mb-4 flex items-center justify-between gap-4">
                <p className="text-gray-300 font-mono text-sm break-all">
                  {walletAddress}
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
            <div className="bg-teal-100 border-2 border-teal-400 rounded-lg p-6">
              <h3 className="text-teal-900 font-bold mb-4">
                Payment Instructions
              </h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="bg-teal-500 text-white w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-sm font-bold">
                    1
                  </div>
                  <p className="text-teal-900 text-sm">
                    Scan QR code with wallet app
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="bg-teal-500 text-white w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-sm font-bold">
                    2
                  </div>
                  <p className="text-teal-900 text-sm">
                    Or copy wallet address manually
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="bg-teal-500 text-white w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-sm font-bold">
                    3
                  </div>
                  <p className="text-teal-900 text-sm">Send only USDT tokens</p>
                </div>
                <div className="flex gap-3">
                  <div className="bg-teal-500 text-white w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-sm font-bold">
                    4
                  </div>
                  <p className="text-teal-900 text-sm">
                    Use TRC20 network only
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
                  Deposits will be confirmed within 5-15 minutes on the TRC20
                  network.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TRC20;
