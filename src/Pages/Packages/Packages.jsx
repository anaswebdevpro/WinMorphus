import React, { useEffect, useState, useMemo } from "react";
import { Zap, Star, Crown, Check, AlertCircle, TrendingUp } from "lucide-react";
import { apiRequest } from "../../Services/Api";
import { PACKAGES_URL } from "../../Api/Api_variables";
import { useAuth } from "../../Context/UseAuth";
import { enqueueSnackbar } from "notistack";
import PurchasePackage from "./PurchasePackage";
import { ShimmerLoader, PageHeader } from "../../Component/ui";
import Investment_table from "./Investment_table";

const Packages = () => {
  const [loading, setLoading] = useState(false);
  const [PackageData, setPackageData] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const { token } = useAuth();

  // Theme mapping for packages with different colors
  const packageThemes = [
    {
      name: "Blue",
      borderColor: "border-blue-500",
      bgGradient: "from-blue-900 to-slate-900",
      buttonColor: "bg-blue-500 hover:bg-blue-600",
      accentColor: "text-blue-400",
      badgeColor: "bg-blue-500",
      iconBg: "bg-blue-700/30",
    },
    {
      name: "Purple",
      borderColor: "border-purple-500",
      bgGradient: "from-purple-900 to-slate-900",
      buttonColor: "bg-purple-500 hover:bg-purple-600",
      accentColor: "text-purple-400",
      badgeColor: "bg-purple-500",
      iconBg: "bg-purple-700/30",
    },
    {
      name: "Green",
      borderColor: "border-green-500",
      bgGradient: "from-green-900 to-slate-900",
      buttonColor: "bg-green-500 hover:bg-green-600",
      accentColor: "text-green-400",
      badgeColor: "bg-green-500",
      iconBg: "bg-green-700/30",
    },
    {
      name: "Orange",
      borderColor: "border-orange-500",
      bgGradient: "from-orange-900 to-slate-900",
      buttonColor: "bg-orange-500 hover:bg-orange-600",
      accentColor: "text-orange-400",
      badgeColor: "bg-orange-500",
      iconBg: "bg-orange-700/30",
    },
    {
      name: "Cyan",
      borderColor: "border-cyan-500",
      bgGradient: "from-cyan-900 to-slate-900",
      buttonColor: "bg-cyan-500 hover:bg-cyan-600",
      accentColor: "text-cyan-400",
      badgeColor: "bg-cyan-500",
      iconBg: "bg-cyan-700/30",
    },
    {
      name: "Pink",
      borderColor: "border-pink-500",
      bgGradient: "from-pink-900 to-slate-900",
      buttonColor: "bg-pink-500 hover:bg-pink-600",
      accentColor: "text-pink-400",
      badgeColor: "bg-pink-500",
      iconBg: "bg-pink-700/30",
    },
  ];

  // Dynamically calculate grid columns based on package count
  const gridColsClass = useMemo(() => {
    const packageCount = PackageData?.packages?.length || 0;
    if (packageCount === 1) return "grid-cols-1 max-w-md mx-auto";
    if (packageCount === 2) return "grid-cols-1 md:grid-cols-2";
    return "grid-cols-1 md:grid-cols-3";
  }, [PackageData?.packages?.length]);

  const FetchPackages = () => {
    setLoading(true);
    apiRequest({
      endpoint: PACKAGES_URL,
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        console.log("Packages API Response:", response);

        // Handle both nested and direct data structures
        const data = response.data || response;
        setPackageData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch packages data:", error);
        const errorMessage =
          error?.message ||
          error?.response?.data?.message ||
          "Failed to fetch packages data";
        enqueueSnackbar(errorMessage, { variant: "error" });
        setLoading(false);
      });
  };

  useEffect(() => {
    if (token) {
      FetchPackages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Handle opening purchase modal
  const handleOpenPurchaseModal = (packageId) => {
    setSelectedPackageId(packageId);
    setIsPurchaseModalOpen(true);
  };

  // Handle closing purchase modal
  const handleClosePurchaseModal = () => {
    setIsPurchaseModalOpen(false);
    setSelectedPackageId(null);
    // Refresh packages after purchase
    FetchPackages();
  };

  const handlePurchaseSuccess = () => {
    // Trigger Investment_table refresh
    setRefreshTrigger((prev) => prev + 1);
  };

  // Show shimmer loader while loading
  if (loading && !PackageData?.packages) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto p-6">
          <PageHeader
            title="Investment Packages"
            description="Choose the perfect package to start your investment journey"
          />
          <ShimmerLoader variant="dashboard" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <PageHeader
          title="Investment Packages"
          description="Choose the perfect package to start your investment journey"
        />
        {console.log(PackageData.packages)}
        {/* Packages Section */}
        <div
          className={`bg-slate-800 border border-slate-700 p-8 rounded-lg shadow-lg mb-8`}
        >
          <h2 className="text-2xl font-bold text-white mb-2">Packages</h2>
          <p className="text-gray-400 text-sm mb-6">
            Select a package that matches your investment capacity
          </p>

          <div className={`grid ${gridColsClass} gap-6 mb-6`}>
            {PackageData?.packages?.length > 0 ? (
              PackageData.packages.map((pkg, index) => {
                // Assign theme based on package index (rotating through colors)
                const theme = packageThemes[index % packageThemes.length];
                const IconComponent = Crown;

                // Build investment range
                const minAmount = pkg.min_amount;
                const maxAmount = pkg.max_amount;

                // Check if maxAmount is zero, null, or contains "0 USDT"
                const isUnlimited = maxAmount === "0.00";
                typeof maxAmount === "string" &&
                  maxAmount.trim().startsWith("0");

                const range = isUnlimited
                  ? `${minAmount} - Onwards`
                  : pkg.formatted_range || `${minAmount} - ${maxAmount}`;

                return (
                  <div
                    key={pkg.id}
                    className={`relative bg-linear-to-br ${theme.bgGradient} border-2 ${theme.borderColor} rounded-xl p-6 transition-all duration-300 hover:shadow-2xl hover:border-opacity-100 group`}
                  >
                    {/* {theme.popular && (
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <span
                          className={`${theme.badgeColor} text-white px-4 py-1 rounded-full text-xs font-bold tracking-wide`}
                        >
                          ⭐ MOST POPULAR
                        </span>
                      </div>
                    )} */}

                    <div className="flex justify-center mb-4">
                      <div
                        className={`${theme.iconBg} p-4 rounded-full border border-slate-700 group-hover:scale-110 transition-transform`}
                      >
                        <IconComponent
                          className={`w-8 h-8 ${theme.accentColor}`}
                        />
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-center mb-4 text-white">
                      {pkg.name}
                    </h3>

                    <div className="space-y-3 mb-6">
                      {/* Investment Range - Row */}
                      <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-700">
                        <span className="text-sm font-semibold text-gray-400">
                          Investment Range
                        </span>
                        <span className="text-white font-bold">{range}</span>
                      </div>

                      {/* Description - Row */}
                      {pkg.description && (
                        <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-700">
                          <span className="text-sm font-semibold text-gray-400">
                            Description
                          </span>
                          <span className="text-white text-sm text-right max-w-[60%]">
                            {pkg.description}
                          </span>
                        </div>
                      )}

                      {/* ROI - Row */}
                      <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-700">
                        <span className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-400" />
                          ROI Monthly
                        </span>
                        <span className="text-green-400 font-bold">
                          {pkg.monthly_roi || "N/A"}%
                        </span>
                      </div>

                      {/* Activation Fee - Row */}
                      <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-700">
                        <span className="text-sm font-semibold text-gray-400">
                          Activation Fee
                        </span>
                        <span className="text-yellow-400 font-bold">
                          $ {pkg.commission_percentage || "0"}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenPurchaseModal(pkg.id)}
                      className={`${theme.buttonColor} text-white w-full py-3 rounded-lg font-bold text-base transition-all duration-300 transform hover:scale-105 shadow-lg`}
                    >
                      SUBSCRIBE NOW
                    </button>

                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-xs text-green-400">✓</span>
                        <span className="text-xs text-gray-400">
                          {pkg.status
                            ? "Status: " + pkg.status.toUpperCase()
                            : "Active"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-3 text-center py-8 text-gray-400">
                {loading ? "Loading packages..." : "No packages available"}
              </div>
            )}
          </div>

          <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 text-center">
            <p className="text-gray-400 text-sm">
              <span className="text-yellow-400 font-semibold">
                Closing Date:
              </span>{" "}
              {PackageData?.dates_info?.closing_date || "Last date of month"} |
              <span className="text-yellow-400 font-semibold ml-2">
                Payout Date:
              </span>{" "}
              {PackageData?.dates_info?.payout_date || "10th of month"}
            </p>
          </div>
        </div>

        {/* Investment History */}
        <Investment_table Trigger={refreshTrigger} />

        {/* Commission Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Advisor Commission */}
          {/* <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-linear-to-r from-green-600 to-emerald-600 text-white p-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Advisor Commission
              </h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-400 mb-6">
                {PackageData?.commission_info?.description ||
                  "To qualify for advisor commissions, you must make at least one direct referral"}
              </p>
              <div className="space-y-3">
                {PackageData?.commission_info?.advisor ? (
                  Object.entries(PackageData.commission_info.advisor).map(
                    ([name, commission], index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-slate-700/50 border border-slate-600 rounded-lg hover:border-green-500/50 transition-colors"
                      >
                        <span className="text-gray-300 font-medium capitalize">
                          {name} Package
                        </span>
                        <span className="text-lg font-bold text-green-400">
                          {commission}%
                        </span>
                      </div>
                    )
                  )
                ) : (
                  <div className="text-gray-400 text-center py-4">
                    No commission data available
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-6 bg-slate-700/30 p-3 rounded border border-slate-600">
                💡 Commission will be paid based on the packages your referrals
                purchase
              </p>
            </div>
          </div> */}

          {/* Franchise Commission */}
          {/* <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white p-6">
              <h3 className="text-lg font-bold">FRANCHISE</h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-300 mb-6">
                {PackageData?.franchise_info?.description ||
                  "To qualify as a Franchise Partner, an advisor must recruit at least 10 direct advisors."}
              </p>

              <div className="space-y-3 mb-6">
                {PackageData?.franchise_info?.tiers?.length > 0 ? (
                  PackageData.franchise_info.tiers.map((tier, index) => {
                    // Handle both direct object and nested array index formats
                    const tierData = tier[index] || tier;
                    const colorMap = {
                      red: "bg-red-500",
                      purple: "bg-purple-500",
                      blue: "bg-blue-500",
                      orange: "bg-orange-500",
                      teal: "bg-teal-500",
                      cyan: "bg-cyan-500",
                      green: "bg-green-500",
                    };
                    const bgColor = colorMap[tierData?.color] || "bg-gray-500";

                    return (
                      <div key={index} className="flex items-center gap-3">
                        <div
                          className={`${bgColor} w-3 h-3 rounded-full`}
                        ></div>
                        <span className="text-gray-300 font-medium text-sm">
                          {tierData?.percentage || index + 1}% - Tier{" "}
                          {index + 1}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-gray-400 text-center py-4">
                    No tier data available
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-400">
                💡 Minimum investment required:{" "}
                {PackageData?.franchise_info?.minimum_investment
                  ? `${PackageData.franchise_info.minimum_investment.toLocaleString()} USDT`
                  : "Contact support"}
              </p>
            </div>
          </div> */}
        </div>
      </div>

      {/* Purchase Package Modal */}
      <PurchasePackage
        isOpen={isPurchaseModalOpen}
        onClose={handleClosePurchaseModal}
        packageId={selectedPackageId}
        onPurchaseSuccess={handlePurchaseSuccess}
      />
    </div>
  );
};

export default Packages;
