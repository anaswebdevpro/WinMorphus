import React, { useEffect, useState, useMemo } from "react";
import { Zap, Star, Crown, Check, AlertCircle, TrendingUp } from "lucide-react";
import { apiRequest } from "../../Services/Api";
import { PACKAGES_URL } from "../../Api/Api_variables";
import { useAuth } from "../../Context/UseAuth";
import { enqueueSnackbar } from "notistack";
import PurchasePackage from "./PurchasePackage";
import { ShimmerLoader, PageHeader } from "../../Component/ui";
import { NoData } from "../../assets";
import Investment_table from "./Investment_table";

const Packages = () => {
  const [loading, setLoading] = useState(false);
  const [PackageData, setPackageData] = useState({});

  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const { token } = useAuth();

  // Theme mapping for packages with different colors - optimized for light/dark theme
  const packageThemes = [
    {
      name: "Blue",
      borderColor: "border-blue-500",
      bgCard: "bg-[var(--bg-card)]",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      accentColor: "text-blue-500",
      badgeColor: "bg-blue-500",
      iconBg: "bg-blue-500/10",
      rowBg: "bg-blue-500/5",
    },
    {
      name: "Purple",
      borderColor: "border-purple-500",
      bgCard: "bg-[var(--bg-card)]",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      accentColor: "text-purple-500",
      badgeColor: "bg-purple-500",
      iconBg: "bg-purple-500/10",
      rowBg: "bg-purple-500/5",
    },
    {
      name: "Green",
      borderColor: "border-green-500",
      bgCard: "bg-[var(--bg-card)]",
      buttonColor: "bg-green-600 hover:bg-green-700",
      accentColor: "text-green-500",
      badgeColor: "bg-green-500",
      iconBg: "bg-green-500/10",
      rowBg: "bg-green-500/5",
    },
    {
      name: "Orange",
      borderColor: "border-orange-500",
      bgCard: "bg-[var(--bg-card)]",
      buttonColor: "bg-orange-600 hover:bg-orange-700",
      accentColor: "text-orange-500",
      badgeColor: "bg-orange-500",
      iconBg: "bg-orange-500/10",
      rowBg: "bg-orange-500/5",
    },
    {
      name: "Cyan",
      borderColor: "border-cyan-500",
      bgCard: "bg-[var(--bg-card)]",
      buttonColor: "bg-cyan-600 hover:bg-cyan-700",
      accentColor: "text-cyan-500",
      badgeColor: "bg-cyan-500",
      iconBg: "bg-cyan-500/10",
      rowBg: "bg-cyan-500/5",
    },
    {
      name: "Pink",
      borderColor: "border-pink-500",
      bgCard: "bg-[var(--bg-card)]",
      buttonColor: "bg-pink-600 hover:bg-pink-700",
      accentColor: "text-pink-500",
      badgeColor: "bg-pink-500",
      iconBg: "bg-pink-500/10",
      rowBg: "bg-pink-500/5",
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
        // console.log("Packages API Response:", response);

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

  // Show shimmer loader while loading
  if (loading && !PackageData?.packages) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
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
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <PageHeader
          title="Investment Packages"
          description="Choose the perfect package to start your investment journey"
        />
        {/* console.log(PackageData.packages) */}
        {/* Packages Section */}
        <div
          className={`bg-[var(--bg-card)] border border-[var(--border-primary)] p-8 rounded-lg shadow-lg mb-8`}
        >
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            Packages
          </h2>
          <p className="text-[var(--text-secondary)] text-sm mb-6">
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
                    className={`relative ${theme.bgCard} border-2 ${theme.borderColor} rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-2xl group`}
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
                        className={`${theme.iconBg} p-4 rounded-full border-2 ${theme.borderColor} group-hover:scale-110 transition-transform`}
                      >
                        <IconComponent
                          className={`w-8 h-8 ${theme.accentColor}`}
                        />
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-center mb-4 text-[var(--text-primary)]">
                      {pkg.name}
                    </h3>

                    <div className="space-y-3 mb-6">
                      {/* Investment Range - Row */}
                      <div
                        className={`flex items-center justify-between p-3 ${theme.rowBg} rounded-lg border border-[var(--border-primary)]`}
                      >
                        <span className="text-sm font-semibold text-[var(--text-secondary)]">
                          Investment Range
                        </span>
                        <span className="text-[var(--text-primary)] font-bold">
                          {range}
                        </span>
                      </div>

                      {/* Description - Row */}
                      {pkg.description && (
                        <div
                          className={`flex items-center justify-between p-3 ${theme.rowBg} rounded-lg border border-[var(--border-primary)]`}
                        >
                          <span className="text-sm font-semibold text-[var(--text-secondary)]">
                            Description
                          </span>
                          <span className="text-[var(--text-primary)] text-sm text-right max-w-[60%]">
                            {pkg.description}
                          </span>
                        </div>
                      )}

                      {/* ROI - Row */}
                      <div
                        className={`flex items-center justify-between p-3 ${theme.rowBg} rounded-lg border border-[var(--border-primary)]`}
                      >
                        <span className="text-sm font-semibold text-[var(--text-secondary)] flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          ROI Monthly
                        </span>
                        <span className="text-green-500 font-bold">
                          {pkg.monthly_roi || "N/A"}%
                        </span>
                      </div>

                      {/* Activation Fee - Row */}
                      <div
                        className={`flex items-center justify-between p-3 ${theme.rowBg} rounded-lg border border-[var(--border-primary)]`}
                      >
                        <span className="text-sm font-semibold text-[var(--text-secondary)]">
                          Activation Fee
                        </span>
                        <span className="text-[var(--accent-primary)] font-bold">
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

                    <div className="mt-4 pt-4 border-t border-[var(--border-primary)]">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-xs text-green-500">✓</span>
                        <span className="text-xs text-[var(--text-secondary)]">
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
              <div className="col-span-3 text-center py-8 text-[var(--text-muted)]">
                {loading ? (
                  "Loading packages..."
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <img
                      src={NoData}
                      alt="No data"
                      className=" h-50 object-contain mb-4"
                    />
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                      No data available yet
                    </h3>
                    <p className="text-[var(--text-secondary)] text-sm mt-2">
                      No packages available
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] rounded-lg p-4 text-center">
            <p className="text-[var(--text-secondary)] text-sm">
              <span className="text-[var(--accent-primary)] font-semibold">
                Closing Date:
              </span>{" "}
              {PackageData?.dates_info?.closing_date || "Last date of month"} |
              <span className="text-[var(--accent-primary)] font-semibold ml-2">
                Payout Date:
              </span>{" "}
              {PackageData?.dates_info?.payout_date || "10th of month"}
            </p>
          </div>
        </div>

        {/* Investment History */}
        <Investment_table />

        {/* <AllTransactionTable /> */}
        {/* <AllTransactionTable /> */}
      </div>

      {/* Purchase Package Modal */}
      <PurchasePackage
        isOpen={isPurchaseModalOpen}
        onClose={handleClosePurchaseModal}
        packageId={selectedPackageId}
        // onPurchaseSuccess={handlePurchaseSuccess}
      />
    </div>
  );
};

export default Packages;
