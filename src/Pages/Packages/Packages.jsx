import React, { useState } from "react";
import { Zap, Star, Crown, Check, AlertCircle, TrendingUp } from "lucide-react";

const Packages = () => {
  const [investmentHistory] = useState([]);

  const packages = [
    {
      id: 1,
      name: "Standard",
      icon: Zap,
      borderColor: "border-cyan-500",
      bgGradient: "from-cyan-900/30 to-cyan-800/20",
      range: "5,000 - 25,000 USDT",
      roi: "12.00% P.A",
      commission: "20.00% Commission",
      buttonColor: "bg-cyan-600 hover:bg-cyan-700",
      accentColor: "text-cyan-400",
      badgeColor: "bg-cyan-600",
      iconBg: "bg-cyan-600/30",
    },
    {
      id: 2,
      name: "Premium",
      icon: Star,
      borderColor: "border-yellow-500",
      bgGradient: "from-yellow-900/30 to-yellow-800/20",
      range: "25,001 - 50,000 USDT",
      roi: "15.00% P.A",
      commission: "25.00% Commission",
      buttonColor: "bg-yellow-500 hover:bg-yellow-600",
      accentColor: "text-yellow-400",
      badgeColor: "bg-yellow-500",
      iconBg: "bg-yellow-600/30",
      popular: true,
    },
    {
      id: 3,
      name: "Elite",
      icon: Crown,
      borderColor: "border-purple-500",
      bgGradient: "from-purple-900/30 to-purple-800/20",
      range: "Above 50,001 USDT",
      roi: "18.00% P.A",
      commission: "30.00% Commission",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      accentColor: "text-purple-400",
      badgeColor: "bg-purple-600",
      iconBg: "bg-purple-600/30",
    },
  ];

  const advisorCommission = [
    { package: "Standard package", commission: "20%" },
    { package: "Premium package", commission: "25%" },
    { package: "Elite package", commission: "30%" },
  ];

  const franchiseCommission = [
    { level: "5%", color: "bg-red-500" },
    { level: "4%", color: "bg-blue-600" },
    { level: "3%", color: "bg-cyan-500" },
    { level: "2%", color: "bg-yellow-500" },
    { level: "1%", color: "bg-teal-500" },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-2">
            Investment Packages
          </h1>
          <p className="text-gray-400">
            Choose the perfect package to start your investment journey
          </p>
        </div>

        {/* Packages Section */}
        <div className="bg-slate-800 border border-slate-700 p-8 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Packages</h2>
          <p className="text-gray-400 text-sm mb-6">
            Select a package that matches your investment capacity
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {packages.map((pkg) => {
              const IconComponent = pkg.icon;
              return (
                <div
                  key={pkg.id}
                  className={`relative bg-gradient-to-br ${pkg.bgGradient} border-2 ${pkg.borderColor} rounded-xl p-6 transition-all duration-300 hover:shadow-2xl hover:border-opacity-100 group`}
                >
                  {pkg.popular && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <span
                        className={`${pkg.badgeColor} text-white px-4 py-1 rounded-full text-xs font-bold tracking-wide`}
                      >
                        ⭐ MOST POPULAR
                      </span>
                    </div>
                  )}

                  <div className="flex justify-center mb-4">
                    <div
                      className={`${pkg.iconBg} p-4 rounded-full border border-slate-700 group-hover:scale-110 transition-transform`}
                    >
                      <IconComponent className={`w-8 h-8 ${pkg.accentColor}`} />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-center mb-4 text-white">
                    {pkg.name}
                  </h3>

                  <div className="space-y-3 mb-6">
                    <div className="text-center">
                      <p className={`text-sm font-semibold ${pkg.accentColor}`}>
                        Investment Range
                      </p>
                      <p className="text-gray-300 font-bold mt-1">
                        {pkg.range}
                      </p>
                    </div>

                    <div className="flex gap-2 justify-center">
                      <div
                        className={`${pkg.badgeColor} text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1`}
                      >
                        <TrendingUp className="w-4 h-4" />
                        {pkg.roi}
                      </div>
                      <div
                        className={`${pkg.badgeColor} text-white px-4 py-2 rounded-lg text-sm font-bold`}
                      >
                        {pkg.commission}
                      </div>
                    </div>
                  </div>

                  <button
                    className={`${pkg.buttonColor} text-white w-full py-3 rounded-lg font-bold text-base transition-all duration-300 transform hover:scale-105 shadow-lg`}
                  >
                    SUBSCRIBE NOW
                  </button>

                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <p className="text-xs text-gray-500 text-center">
                      ✓ Automated Daily Payouts
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 text-center">
            <p className="text-gray-400 text-sm">
              <span className="text-yellow-400 font-semibold">
                Closing Date:
              </span>{" "}
              Last date of month |
              <span className="text-yellow-400 font-semibold ml-2">
                Payout Date:
              </span>{" "}
              10th of month
            </p>
          </div>
        </div>

        {/* Investment History */}
        <div className="bg-slate-800 border border-slate-700 p-8 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Investment History
          </h2>

          {investmentHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-slate-700/30 rounded-lg border border-slate-600">
              <AlertCircle className="w-16 h-16 text-gray-500 mb-4" />
              <p className="text-gray-300 text-lg font-semibold">
                No Investment History Yet
              </p>
              <p className="text-gray-500 text-center mt-2 max-w-md">
                You haven't made any investments yet. Start by subscribing to a
                package above to begin your investment journey
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-600 bg-slate-700/50">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">
                      Package
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="4" className="text-center py-12 text-gray-500">
                      No data available
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Commission Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Advisor Commission */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Advisor Commission
              </h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-400 mb-6">
                To qualify for advisor commissions, you must make at least one
                direct referral
              </p>
              <div className="space-y-3">
                {advisorCommission.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-slate-700/50 border border-slate-600 rounded-lg hover:border-green-500/50 transition-colors"
                  >
                    <span className="text-gray-300 font-medium">
                      {item.package}
                    </span>
                    <span className="text-lg font-bold text-green-400">
                      {item.commission}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-6 bg-slate-700/30 p-3 rounded border border-slate-600">
                💡 Commission will be paid based on the packages your referrals
                purchase
              </p>
            </div>
          </div>

          {/* Franchise Commission */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white p-6">
              <h3 className="text-lg font-bold">FRANCHISE</h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-300 mb-6">
                To qualify as a Franchise Partner, an advisor must recruit at
                least 10 direct advisors.
              </p>

              <div className="space-y-3 mb-6">
                {franchiseCommission.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`${item.color} w-3 h-3 rounded-full`}></div>
                    <span className="text-gray-300 font-medium text-sm">
                      {item.level}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-400">
                To be advisor you'll need to make at least 1 direct to get paid
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Packages;
