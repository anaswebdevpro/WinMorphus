import React from "react";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Deposit = () => {
  const navigate = useNavigate();

  const usdtOptions = [
    {
      id: 1,
      name: "USDT TRC20",
      network: "TRC20",
      minAmount: "10 USDT",
      maxAmount: "10000 USDT",
      fee: "No fee",
      processing: "5 minutes",
      color: "from-teal-600 to-teal-700",
      bgColor: "bg-teal-600",
      icon: "₮",
      recommended: true,
    },
    {
      id: 2,
      name: "USDT BEP20",
      network: "BEP20",
      minAmount: "10 USDT",
      maxAmount: "10000 USDT",
      fee: "No fee",
      processing: "10 minutes",
      color: "from-purple-600 to-purple-700",
      bgColor: "bg-purple-600",
      icon: "₮",
      recommended: false,
    },
  ];

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
            {usdtOptions.map((usdt) => (
              <div
                key={usdt.id}
                onClick={() => handleNavigate(usdt.network)}
                className={`bg-linear-to-br ${usdt.color} rounded-2xl p-8 shadow-lg relative overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
              >
                {usdt.recommended && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-black/40 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      RECOMMENDED
                    </span>
                  </div>
                )}

                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {usdt.name}
                    </h3>
                  </div>
                  <div
                    className={`${usdt.bgColor} p-3 rounded-full flex items-center justify-center`}
                  >
                    <span className="text-2xl text-white font-bold">₮</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80 font-medium">Network:</span>
                    <span className="text-white font-bold">{usdt.network}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80 font-medium">
                      Min Amount:
                    </span>
                    <span className="text-white font-bold">
                      {usdt.minAmount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80 font-medium">
                      Max Amount:
                    </span>
                    <span className="text-white font-bold">
                      {usdt.maxAmount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80 font-medium">Fee:</span>
                    <span className="text-white font-bold">{usdt.fee}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80 font-medium">
                      Processing:
                    </span>
                    <span className="text-white font-bold">
                      {usdt.processing}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deposit;
