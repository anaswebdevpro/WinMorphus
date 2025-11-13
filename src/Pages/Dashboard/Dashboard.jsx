import React, { useState, useCallback, useEffect } from "react";
import { useSnackbar } from "notistack";
import ContentLoader from "react-content-loader";
import {
  Package,
  TrendingUp,
  Users,
  DollarSign,
  Share2,
  Copy,
  Wallet,
  Building2,
  ArrowDownToLine,
  ArrowUpFromLine,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../Context/UseAuth";
import { apiRequest } from "../../Services/Api";
import { DASHBOARD_DATA } from "../../Api/Api_variables";
import { useNavigate } from "react-router-dom";
import RoiChart from "./Components/RoiChart";
import RankProgress from "./Components/RankProgress";
import Leaderprogress from "./Components/Leaderprogress";
import Investerprogress from "./Components/Investerprogress";

const Dashboard = () => {
  const { token } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [copiedLink, setCopiedLink] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const navigate = useNavigate();

  // Fetch dashboard data from API
  const fetchDashboardData = useCallback(() => {
    setLoading(true);
    apiRequest({
      endpoint: DASHBOARD_DATA,
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        // Handle both nested and direct data structures
        const data = response.data || response;
        setDashboardData(data);
      })
      .catch((error) => {
        console.error("Failed to fetch dashboard data:", error);
        const errorMessage =
          error?.message ||
          error?.response?.data?.message ||
          "Failed to fetch dashboard data";
        enqueueSnackbar(errorMessage, { variant: "error" });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token, enqueueSnackbar]);

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token, fetchDashboardData]);

  // Prepare stats from dashboard data or use defaults
  const stats = dashboardData
    ? {
        currentPackage: dashboardData.current_package?.name || "NO PACKAGE",
        packageValue: `${dashboardData.current_package?.amount || 0} USDT`,
        totalInvestment: `${dashboardData.total_investment || 0} USDT`,
        currentROI: `${
          dashboardData.current_package?.current_roi_earned || 0
        } USDT`,
        totalCommission: `${dashboardData.total_commission || 0} USDT`,
      }
    : {
        currentPackage: "NO PACKAGE",
        packageValue: "0 USDT",
        totalInvestment: "0 USDT",
        currentROI: "0 USDT",
        totalCommission: "0 USDT",
      };
  const baseUrl = window.location.origin;
  const referralLink = dashboardData?.referral_link
    ? `${baseUrl}${dashboardData.referral_link}`
    : `${baseUrl}/ref/0`;

  const networkStats = dashboardData?.network_statistics
    ? {
        directReferrals: dashboardData.network_statistics.direct_referrals || 0,
        totalTeamSize: dashboardData.network_statistics.total_team_size || 0,
        activeMembers: dashboardData.network_statistics.active_members || 0,
        teamInvestment: `${
          dashboardData.network_statistics.team_investment || 0
        } USDT`,
      }
    : {
        directReferrals: 0,
        totalTeamSize: 0,
        activeMembers: 0,
        teamInvestment: "0 USDT",
      };

  // Extract network data - handle both direct array and nested structure
  // COMMENTED OUT - Not needed since network tree is replaced with RoiChart
  /*
  const networkData = React.useMemo(() => {
    if (!dashboardData) return [];
    if (!dashboardData.network_data) return [];

    const data = dashboardData.network_data;

    // If it's already an array, return it
    if (Array.isArray(data)) {
      return data;
    }

    // Try to get first array-like property from object
    if (data && typeof data === "object") {
      // Check if it has numeric keys
      const keys = Object.keys(data);

      for (const key of keys) {
        if (Array.isArray(data[key])) {
          return data[key];
        }
      }

      // Also check 'i' property specifically
      if (data.i && Array.isArray(data.i)) {
        return data.i;
      }
    }

    return [];
  }, [dashboardData]);
  */
  const roiEarningsHistory = dashboardData?.roi_earnings_history || [];
  const commissionEarningsHistory =
    dashboardData?.commission_earnings_history || [];

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Shimmer loader component for cards
  const ShimmerLoader = () => (
    <ContentLoader
      speed={2}
      width={300}
      height={150}
      backgroundColor="#1e293b"
      foregroundColor="#334155"
    >
      <rect x="0" y="0" rx="8" ry="8" width="300" height="150" />
    </ContentLoader>
  );

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareOnSocial = (platform) => {
    const encodedLink = encodeURIComponent(referralLink);
    const message = encodeURIComponent("Join me on this trading portal!");

    const shareUrls = {
      whatsapp: `https://wa.me/?text=${message}%20${encodedLink}`,
      telegram: `https://t.me/share/url?url=${encodedLink}&text=${message}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedLink}&text=${message}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedLink}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Welcome back to your trading portal
          </p>
        </div>

        {/* Alert Banner */}

        {!dashboardData?.is_activated && (
          <div className="bg-yellow-400 text-slate-900 p-4 rounded-lg mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5" />
            <p className="text-sm sm:text-base font-medium">
              Activate your account by purchasing a package to start earning
              rewards.
            </p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Current Package */}
          {loading ? (
            <ShimmerLoader />
          ) : (
            <div className="bg-linear-to-br from-purple-900 to-slate-900 border-2 border-purple-500 p-6 rounded-lg shadow-lg relative overflow-hidden hover:shadow-xl transition-shadow">
              <div className="absolute top-4 right-4 bg-purple-700/30 px-3 py-1 rounded-lg">
                <Package className="w-4 h-4 text-purple-400" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-5 h-5 text-purple-400" />
                <p className="text-sm font-medium opacity-90">
                  Current Package
                </p>
              </div>
              <h2 className="text-2xl font-bold mb-1">
                {stats.currentPackage}
              </h2>
              <p className="text-sm opacity-75">{stats.packageValue}</p>
            </div>
          )}

          {/* Total Investment */}
          {loading ? (
            <ShimmerLoader />
          ) : (
            <div className="bg-linear-to-br from-blue-900 to-slate-900 border-2 border-blue-500 p-6 rounded-lg shadow-lg relative overflow-hidden hover:shadow-xl transition-shadow">
              <div className="absolute top-4 right-4 bg-blue-700/30 px-3 py-1 rounded-lg">
                <TrendingUp className="w-4 h-4 text-blue-400" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <p className="text-sm font-medium opacity-90">
                  Total Investment
                </p>
              </div>
              <h2 className="text-2xl font-bold mb-1">
                {stats.totalInvestment}
              </h2>
            </div>
          )}

          {/* Current ROI Earned */}
          {loading ? (
            <ShimmerLoader />
          ) : (
            <div className="bg-linear-to-br from-green-900 to-slate-900 border-2 border-green-500 p-6 rounded-lg shadow-lg relative overflow-hidden hover:shadow-xl transition-shadow">
              <div className="absolute top-4 right-4 bg-green-700/30 px-3 py-1 rounded-lg">
                <DollarSign className="w-4 h-4 text-green-400" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                <p className="text-sm font-medium opacity-90">
                  Current ROI Earned
                </p>
              </div>
              <h2 className="text-2xl font-bold mb-1">{stats.currentROI}</h2>
            </div>
          )}

          {/* Total Commission */}
          {loading ? (
            <ShimmerLoader />
          ) : (
            <div className="bg-linear-to-br from-orange-900 to-slate-900 border-2 border-orange-500 p-6 rounded-lg shadow-lg relative overflow-hidden hover:shadow-xl transition-shadow">
              <div className="absolute top-4 right-4 bg-orange-700/30 px-3 py-1 rounded-lg">
                <Users className="w-4 h-4 text-orange-400" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-orange-400" />
                <p className="text-sm font-medium opacity-90">Level Income</p>
              </div>
              <h2 className="text-2xl font-bold mb-1">
                {stats.totalCommission}
              </h2>
            </div>
          )}
        </div>

        {/* Referral Link Section */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Share2 className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-semibold">Your Referral Link</h3>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Share this link with friends and earn commissions on their
            investments
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1 bg-slate-900 p-3 rounded border border-slate-700 font-mono text-sm overflow-x-auto">
              {referralLink}
            </div>
            <button
              onClick={handleCopyLink}
              className="bg-yellow-400 text-slate-900 px-6 py-3 rounded font-medium hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Copy className="w-4 h-4" />
              {copiedLink ? "Copied!" : "Copy Link"}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <span className="text-sm text-gray-400">
              Share on social media:
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleShareOnSocial("whatsapp")}
                className="w-10 h-10 rounded bg-green-600 hover:bg-green-700 transition-colors flex items-center justify-center"
                title="Share on WhatsApp"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </button>
              <button
                onClick={() => handleShareOnSocial("telegram")}
                className="w-10 h-10 rounded bg-blue-500 hover:bg-blue-600 transition-colors flex items-center justify-center"
                title="Share on Telegram"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </button>
              <button
                onClick={() => handleShareOnSocial("facebook")}
                className="w-10 h-10 rounded bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center"
                title="Share on Facebook"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
              <button
                onClick={() => handleShareOnSocial("twitter")}
                className="w-10 h-10 rounded bg-sky-500 hover:bg-sky-600 transition-colors flex items-center justify-center"
                title="Share on Twitter"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </button>
              <button
                onClick={() => handleShareOnSocial("linkedin")}
                className="w-10 h-10 rounded bg-blue-700 hover:bg-blue-800 transition-colors flex items-center justify-center"
                title="Share on LinkedIn"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* My Network Section - Title */}
        <div className="bg-slate-800 text-white p-4 rounded-lg shadow-lg mb-4 text-center relative">
          <h2 className="text-2xl font-bold">My Network</h2>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 border border-blue-600 px-4 py-2 rounded-lg"
            onClick={() => navigate("/network")}
          >
            <ChevronRight className="w-4 h-4" />
            View All Network
          </button>
        </div>

        {/* Network Section - Two Cards Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* {progrss bar cards } */}
          <div className="bg-slate-800 text-white p-8 rounded-lg shadow-lg">
            <RankProgress />
          </div>
          <div className="bg-slate-800 text-white p-8 rounded-lg shadow-lg">
            <Investerprogress data={dashboardData?.leader_info} />
            {/* <Leaderprogress /> */}
          </div>

          {/* ROI Chart Component */}
          <div className="bg-slate-800 text-white p-8 rounded-lg shadow-lg">
            <RoiChart stats={dashboardData} />
          </div>

          {/* Network Statistics Card */}
          <div className="bg-slate-800 text-white rounded-lg shadow-lg border border-slate-700">
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-xl font-semibold text-white">
                Network Statistics
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-linear-to-br from-blue-900 to-slate-900 border-2 border-blue-500 rounded-lg p-5 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-700/30 p-2 rounded-lg">
                      <Users className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-sm font-semibold text-gray-300">
                      Direct Referrals
                    </span>
                  </div>
                  <span className="text-3xl font-bold text-white">
                    {networkStats.directReferrals}
                  </span>
                </div>
              </div>

              <div className="bg-linear-to-br from-green-900 to-slate-900 border-2 border-green-500 rounded-lg p-5 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-700/30 p-2 rounded-lg">
                      <Users className="w-5 h-5 text-green-400" />
                    </div>
                    <span className="text-sm font-semibold text-gray-300">
                      Total Team Size
                    </span>
                  </div>
                  <span className="text-3xl font-bold text-white">
                    {networkStats.totalTeamSize}
                  </span>
                </div>
              </div>

              <div className="bg-linear-to-br from-orange-900 to-slate-900 border-2 border-orange-500 rounded-lg p-5 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-700/30 p-2 rounded-lg">
                      <Users className="w-5 h-5 text-orange-400" />
                    </div>
                    <span className="text-sm font-semibold text-gray-300">
                      Active Members
                    </span>
                  </div>
                  <span className="text-3xl font-bold text-white">
                    {networkStats.activeMembers}
                  </span>
                </div>
              </div>

              <div className="bg-linear-to-br from-purple-900 to-slate-900 border-2 border-purple-500 rounded-lg p-5 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-700/30 p-2 rounded-lg">
                      <DollarSign className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className="text-sm font-semibold text-gray-300">
                      Team Investment
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-green-400">
                    {networkStats.teamInvestment}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Commission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* ROI Earnings History */}
          <div className="bg-slate-800 text-white p-6 rounded-lg shadow-lg max-h-100 overflow-auto">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold">ROI Earnings History</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-slate-600">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-300">
                      Date
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-300">
                      Amount
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-300">
                      Package
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {roiEarningsHistory && roiEarningsHistory.length > 0 ? (
                    roiEarningsHistory.map((entry, index) => (
                      <tr
                        key={index}
                        className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                      >
                        <td className="text-left py-3 px-2 text-sm text-gray-300">
                          {formatDate(entry.date)}
                        </td>
                        <td className="text-left py-3 px-2 text-sm font-semibold text-green-400">
                          {entry.amount || "N/A"} USDT
                        </td>
                        <td className="text-left py-3 px-2 text-sm text-gray-300">
                          {entry.package || "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-center py-12 text-gray-400"
                      >
                        No ROI earnings history available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Commission Earnings */}
          <div className="bg-slate-800 text-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold">Commission Earnings</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-slate-600">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-300">
                      Date
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-300">
                      Level
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-300">
                      Referral
                    </th>
                    <th className="text-right py-3 px-2 text-sm font-semibold text-gray-300">
                      Earned
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {commissionEarningsHistory &&
                  commissionEarningsHistory.length > 0 ? (
                    commissionEarningsHistory.map((entry, index) => (
                      <tr
                        key={index}
                        className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                      >
                        <td className="text-left py-3 px-2 text-sm text-gray-300">
                          {formatDate(entry.created_at)}
                        </td>
                        <td className="text-left py-3 px-2 text-sm">
                          <span className="bg-blue-900/50 text-blue-300 px-2 py-1 rounded text-xs font-semibold">
                            Level {entry.level || "N/A"}
                          </span>
                        </td>
                        <td className="text-left py-3 px-2 text-sm text-gray-300 truncate">
                          {entry.referral_email || entry.referral_name || "N/A"}
                        </td>
                        <td className="text-right py-3 px-2 text-sm font-semibold text-green-400">
                          {entry.amount || entry.commission || "N/A"} USDT
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-12 text-gray-400"
                      >
                        No commission earnings history available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Wallet Balance Section - Full Width */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Wallet className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-semibold">Wallet Balances</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Available Wallet Balance */}
            <div className="bg-linear-to-br from-cyan-900 to-slate-900 border-2 border-cyan-500 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow flex items-center justify-between">
              <div>
                <p className="text-xs font-medium opacity-90 mb-1">
                  Available Wallet Balance
                </p>
                <p className="text-2xl font-bold">
                  $ {dashboardData?.user_balances?.available_walllet || "0.00"}{" "}
                  
                </p>
              </div>
              <div className="bg-cyan-700/30 p-2 rounded-lg">
                <Wallet className="w-8 h-8 text-cyan-400" />
              </div>
            </div>

            {/* Main Wallet Balance */}
            <div className="bg-linear-to-br from-blue-900 to-slate-900 border-2 border-blue-500 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow flex items-center justify-between">
              <div>
                <p className="text-xs font-medium opacity-90 mb-1">
                  INCOME Wallet Balance
                </p>
                <p className="text-2xl font-bold">
                 $  {dashboardData?.user_balances?.income_wallet || "0.00"} USDT
                </p>
              </div>
              <div className="bg-blue-700/30 p-2 rounded-lg">
                <Building2 className="w-8 h-8 text-blue-400" />
              </div>
            </div>

            {/* Action Buttons - Vertical Stack */}
            <div className="flex flex-col gap-4">
              <button
                className="bg-linear-to-br from-red-900 to-red-600 hover:from-red-800 hover:to-red-500 border-2 border-red-500 text-white p-4 rounded-lg font-semibold text-base transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                onClick={() => navigate("/withdraw")}
              >
                <ArrowUpFromLine className="w-5 h-5" />
                Withdraw
              </button>
              <button
                className="bg-linear-to-br from-green-900 to-green-600 hover:from-green-800 hover:to-green-500 border-2 border-green-500 text-white p-4 rounded-lg font-semibold text-base transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                onClick={() => navigate("/deposit")}
              >
                <ArrowDownToLine className="w-5 h-5" />
                Deposit
              </button>
            </div>
          </div>
        </div>

    
      </div>
    </div>
  );
};

export default Dashboard;
