import React, { useState, useEffect } from "react";
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
  MessageCircle,
  Send,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";
import { useAuth } from "../../Context/UseAuth";
import { NoData } from "../../assets";
import { apiRequest } from "../../Services/Api";
import { DASHBOARD_DATA, GET_BALANCE } from "../../Api/Api_variables";
import { useNavigate } from "react-router-dom";
import RoiChart from "./Components/RoiChart";
import RankProgress from "./Components/RankProgress";
import Leaderprogress from "./Components/Leaderprogress";
import Investerprogress from "./Components/Investerprogress";
import TradingView from "./Components/TradingView";
import TradingView2 from "./Components/TradingView2";
import RankChart from "./Components/RankChart";

const Dashboard = () => {
  const { token } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [copiedLink, setCopiedLink] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [balance, setBalance] = useState(null);
  const navigate = useNavigate();

  // Fetch dashboard data from API
  const fetchDashboardData = () => {
    if (!token) return;

    try {
      setLoading(true);

      apiRequest({
        endpoint: DASHBOARD_DATA,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          setDashboardData(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch dashboard data:", error);
          const errorMessage =
            error?.message || "Failed to fetch dashboard data";
          enqueueSnackbar(errorMessage, { variant: "error" });
          setLoading(false);
        });
    } catch (error) {
      enqueueSnackbar(error?.message, { variant: "error" });
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
    if (token) {
      fetchDashboardData();
      fetchBalance();
    }
  }, []);

  const baseUrl = window.location.origin;
  const referralLink = dashboardData?.referral_link
    ? `${baseUrl}${dashboardData.referral_link}`
    : `${baseUrl}/ref/0`;

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
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--accent-primary)] mb-2">
            Dashboard
          </h1>
          <p className="text-[var(--text-secondary)] text-sm sm:text-base">
            Welcome back to your trading portal
          </p>
        </div>

        {/* Alert Banner */}
        {!loading && dashboardData && !dashboardData?.is_activated && (
          <div className="bg-[var(--accent-primary)] text-slate-900 p-4 rounded-lg mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 mt-0.5" />
            <p className="text-sm sm:text-base font-medium">
              Activate your account by purchasing a package to start earning
              rewards.
            </p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Investment */}
          {loading ? (
            <ShimmerLoader />
          ) : (
            <div className="bg-[var(--bg-card)] border-2 border-blue-500 p-6 rounded-lg shadow-lg relative overflow-hidden hover:shadow-xl transition-shadow">
              <div className="absolute top-4 right-4 bg-blue-500/10 px-3 py-1 rounded-lg">
                <TrendingUp className="w-4 h-4 text-blue-500" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <p className="text-sm font-medium text-[var(--text-secondary)]">
                  Total Investment
                </p>
              </div>
              <h2 className="text-2xl font-bold mb-1 text-[var(--text-primary)]">
                $ {parseFloat(dashboardData?.total_investment || 0).toFixed(2)}
              </h2>
            </div>
          )}

          {/* Current ROI Earned */}
          {loading ? (
            <ShimmerLoader />
          ) : (
            <div className="bg-[var(--bg-card)] border-2 border-green-500 p-6 rounded-lg shadow-lg relative overflow-hidden hover:shadow-xl transition-shadow">
              <div className="absolute top-4 right-4 bg-green-500/10 px-3 py-1 rounded-lg">
                <DollarSign className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <p className="text-sm font-medium text-[var(--text-secondary)]">
                  Current ROI Earned
                </p>
              </div>
              <h2 className="text-2xl font-bold mb-1 text-[var(--text-primary)]">
                ${parseFloat(dashboardData?.current_roi_earned || 0).toFixed(2)}
              </h2>
            </div>
          )}

          {/* Total Commission */}
          {loading ? (
            <ShimmerLoader />
          ) : (
            <div className="bg-[var(--bg-card)] border-2 border-orange-500 p-6 rounded-lg shadow-lg relative overflow-hidden hover:shadow-xl transition-shadow">
              <div className="absolute top-4 right-4 bg-orange-500/10 px-3 py-1 rounded-lg">
                <Users className="w-4 h-4 text-orange-500" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-orange-500" />
                <p className="text-sm font-medium text-[var(--text-secondary)]">
                  Level Income
                </p>
              </div>
              <h2 className="text-2xl font-bold mb-1 text-[var(--text-primary)]">
                ${" "}
                {parseFloat(dashboardData?.current_level_income || 0).toFixed(
                  2
                )}
              </h2>
            </div>
          )}

          {loading ? (
            <ShimmerLoader />
          ) : (
            <div className="bg-[var(--bg-card)] border-2 border-purple-500 p-6 rounded-lg shadow-lg relative overflow-hidden hover:shadow-xl transition-shadow">
              <div className="absolute top-4 right-4 bg-purple-500/10 px-3 py-1 rounded-lg">
                <Package className="w-4 h-4 text-purple-500" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-5 h-5 text-purple-500" />
                <p className="text-sm font-medium text-[var(--text-secondary)]">
                  Reward Income
                </p>
              </div>
              <h2 className="text-2xl font-bold mb-1 text-[var(--text-primary)]">
                ${parseFloat(dashboardData?.reward_income || 0).toFixed(2)}
              </h2>
            </div>
          )}
        </div>

        {/* Referral Link Section */}
        <div className="bg-[var(--bg-card)] p-6 rounded-lg shadow-lg mb-6 border border-[var(--border-primary)]">
          <div className="flex items-center gap-2 mb-4">
            <Share2 className="w-5 h-5 text-[var(--accent-primary)]" />
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Your Referral Link
            </h3>
          </div>
          <p className="text-[var(--text-secondary)] text-sm mb-4">
            Share this link with friends and earn commissions on their
            investments
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1 bg-[var(--bg-secondary)] p-3 rounded border border-[var(--border-primary)] font-mono text-sm overflow-x-auto text-[var(--text-primary)]">
              {referralLink}
            </div>
            <button
              onClick={handleCopyLink}
              className="bg-[var(--accent-primary)] text-slate-900 px-6 py-3 rounded font-medium hover:bg-[var(--accent-hover)] transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Copy className="w-4 h-4" />
              {copiedLink ? "Copied!" : "Copy Link"}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <span className="text-sm text-[var(--text-secondary)]">
              Share on social media:
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleShareOnSocial("whatsapp")}
                className="w-10 h-10 rounded bg-green-600 hover:bg-green-700 transition-colors flex items-center justify-center"
                title="Share on WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleShareOnSocial("telegram")}
                className="w-10 h-10 rounded bg-blue-500 hover:bg-blue-600 transition-colors flex items-center justify-center"
                title="Share on Telegram"
              >
                <Send className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleShareOnSocial("facebook")}
                className="w-10 h-10 rounded bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center"
                title="Share on Facebook"
              >
                <Facebook className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleShareOnSocial("twitter")}
                className="w-10 h-10 rounded bg-sky-500 hover:bg-sky-600 transition-colors flex items-center justify-center"
                title="Share on Twitter"
              >
                <Twitter className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleShareOnSocial("linkedin")}
                className="w-10 h-10 rounded bg-blue-700 hover:bg-blue-800 transition-colors flex items-center justify-center"
                title="Share on LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        {/* trading View Widgets  */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6 ">
          <div className="bg-[var(--bg-card)] text-[var(--text-primary)] rounded-lg shadow-lg min-h-[600px] flex flex-col border border-[var(--border-primary)]">
            <TradingView2 />
          </div>
          <div className="bg-[var(--bg-card)] text-[var(--text-primary)] rounded-lg shadow-lg min-h-[600px] flex flex-col border border-[var(--border-primary)]">
            <TradingView />
          </div>
        </div>

        {/* My Network Section - Title */}
        <div className="bg-[var(--bg-card)] text-[var(--text-primary)] p-4 rounded-lg shadow-lg mb-4 text-center relative border border-[var(--border-primary)]">
          <h2 className="text-2xl font-bold">Acount Overview</h2>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--status-info)] hover:text-[var(--accent-primary)] text-sm font-medium flex items-center gap-1 border border-[var(--status-info)] px-4 py-2 rounded-lg"
            onClick={() => navigate("/network")}
          >
            <ChevronRight className="w-4 h-4" />
            View All Network
          </button>
        </div>

        {/* Rank Progress  - Two Cards Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* {progrss bar cards } */}
          <div className="bg-[var(--bg-card)] text-[var(--text-primary)] p-8 rounded-lg shadow-lg border border-[var(--border-primary)]">
            <RankProgress />
          </div>
          <div className="bg-[var(--bg-card)] text-[var(--text-primary)] p-8 rounded-lg shadow-lg border border-[var(--border-primary)]">
            {!loading && dashboardData?.inv_info.inv_type === 0 ? (
              <Investerprogress data={dashboardData?.leader_info} />
            ) : (
              <Leaderprogress data={dashboardData} />
            )}
          </div>

          {/* ROI Chart Component */}
          <div className="bg-[var(--bg-card)] text-[var(--text-primary)] p-8 rounded-lg shadow-lg border border-[var(--border-primary)]">
            <RoiChart stats={dashboardData} />
          </div>

          {/* Network Statistics Card */}
          <div className="bg-[var(--bg-card)] text-[var(--text-primary)] rounded-lg shadow-lg border border-[var(--border-primary)]">
            <div className="p-6 border-b border-[var(--border-primary)]">
              <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                Network Statistics
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-[var(--bg-card)] border-2 border-blue-500 rounded-lg p-5 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500/10 p-2 rounded-lg">
                      <Users className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-sm font-semibold text-[var(--text-secondary)]">
                      Direct Referrals
                    </span>
                  </div>
                  <span className="text-3xl font-bold text-[var(--text-primary)]">
                    {dashboardData?.network_statistics?.direct_referrals || 0}
                  </span>
                </div>
              </div>

              <div className="bg-[var(--bg-card)] border-2 border-green-500 rounded-lg p-5 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500/10 p-2 rounded-lg">
                      <Users className="w-5 h-5 text-green-400" />
                    </div>
                    <span className="text-sm font-semibold text-[var(--text-secondary)]">
                      Total Team Size
                    </span>
                  </div>
                  <span className="text-3xl font-bold text-[var(--text-primary)]">
                    {dashboardData?.network_statistics?.total_team_size || 0}
                  </span>
                </div>
              </div>

              <div className="bg-[var(--bg-card)] border-2 border-orange-500 rounded-lg p-5 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-500/10 p-2 rounded-lg">
                      <Users className="w-5 h-5 text-orange-400" />
                    </div>
                    <span className="text-sm font-semibold text-[var(--text-secondary)]">
                      Active Members
                    </span>
                  </div>
                  <span className="text-3xl font-bold text-[var(--text-primary)]">
                    {dashboardData?.network_statistics?.active_members || 0}
                  </span>
                </div>
              </div>

              <div className="bg-[var(--bg-card)] border-2 border-purple-500 rounded-lg p-5 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-500/10 p-2 rounded-lg">
                      <DollarSign className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className="text-sm font-semibold text-[var(--text-secondary)]">
                      Team Investment
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-green-400">
                    ${dashboardData?.network_statistics?.team_investment || 0}{" "}
                    USDT
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* rank bar graph */}

        <div className="bg-[var(--bg-card)] text-[var(--text-primary)] p-6 rounded-lg shadow-lg mb-6 border border-[var(--border-primary)]">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-[var(--accent-primary)]" />
            <h3 className="text-2xl font-semibold">Business Carry Forward</h3>
          </div>
          <RankChart />
        </div>

        {/* Commission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* ROI Earnings History */}
          <div className="bg-[var(--bg-card)] text-[var(--text-primary)] p-6 rounded-lg shadow-lg max-h-100 overflow-auto border border-[var(--border-primary)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[var(--status-success)]" />
                <h3 className="text-lg font-semibold">ROI Earnings History</h3>
              </div>
              <button
                onClick={() => navigate("/roi-earnings")}
                className="bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <ChevronRight className="w-4 h-4" />
                View More
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[var(--border-secondary)]">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-[var(--text-secondary)]">
                      Date
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-[var(--text-secondary)]">
                      Amount
                    </th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-[var(--text-secondary)]">
                      Package
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData?.roi_earnings_history &&
                  dashboardData?.roi_earnings_history.length > 0 ? (
                    dashboardData?.roi_earnings_history.map((entry, index) => (
                      <tr
                        key={index}
                        className="border-b border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                      >
                        <td className="text-left py-3 px-2 text-sm text-[var(--text-secondary)]">
                          {formatDate(entry.date)}
                        </td>
                        <td className="text-left py-3 px-2 text-sm font-semibold text-[var(--status-success)]">
                          {entry.amount || "N/A"} USDT
                        </td>
                        <td className="text-left py-3 px-2 text-sm text-[var(--text-secondary)]">
                          {entry.package || "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-center py-12 text-[var(--text-muted)] text-xl"
                      >
                        <div className="flex flex-col items-center justify-center ">
                          <img src={NoData} alt="No data" className=" h-40 object-contain mb-3" />
                          <h3 className="text-lg font-semibold text-[var(--text-primary)]">No data available yet</h3>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Commission Earnings */}
          <div className="bg-[var(--bg-card)] text-[var(--text-primary)] p-6 rounded-lg shadow-lg max-h-96 overflow-y-auto border border-[var(--border-primary)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[var(--status-success)]" />
                <h3 className="text-lg font-semibold">
                  Leadership Earnings History
                </h3>
              </div>
              <button
                onClick={() => navigate("/commissions")}
                className="bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <ChevronRight className="w-4 h-4" />
                View More
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b-2 border-[var(--border-secondary)]">
                    <th className="text-left py-3 px-3 text-sm font-semibold text-[var(--text-secondary)] w-28">
                      Date
                    </th>
                    <th className="text-left py-3 px-3 text-sm font-semibold text-[var(--text-secondary)] w-24">
                      Amount
                    </th>
                    <th className="text-left py-3 px-3 text-sm font-semibold text-[var(--text-secondary)] w-20">
                      Level
                    </th>
                    <th className="text-left py-3 px-3 text-sm font-semibold text-[var(--text-secondary)] min-w-[200px]">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData?.commission_earnings_history.earnings &&
                  dashboardData?.commission_earnings_history.earnings.length >
                    0 ? (
                    dashboardData?.commission_earnings_history.earnings.map(
                      (entry, index) => (
                        <tr
                          key={index}
                          className="border-b border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                        >
                          <td className="text-left py-3 px-3 text-sm text-[var(--text-secondary)] w-28">
                            {formatDate(entry.date)}
                          </td>
                          <td className="text-left py-3 px-3 text-sm font-semibold text-[var(--status-success)] w-24">
                            $ {entry.amount || "N/A"}
                          </td>
                          <td className="text-left py-3 px-3 text-sm text-[var(--text-secondary)] w-20">
                            <span className="font-bold ">
                              Level {" " + (entry.level || "N/A")}
                            </span>
                          </td>
                          <td className="text-left py-3 px-3 text-sm text-[var(--text-secondary)] min-w-[200px] wrap-break-word">
                            {entry.description || "N/A"}
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-12 text-[var(--text-muted)] text-xl"
                      >
                        <div className="flex flex-col items-center justify-center ">
                          <img src={NoData} alt="No data" className=" h-40 object-contain mb-3" />
                          <h3 className="text-lg font-semibold text-[var(--text-primary)]">No data available yet</h3>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Wallet Balance Section - Full Width */}
        <div className="bg-[var(--bg-card)] p-6 rounded-lg shadow-lg mb-6 border border-[var(--border-primary)]">
          <div className="flex items-center gap-2 mb-6">
            <Wallet className="w-5 h-5 text-[var(--status-info)]" />
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Wallet Balances
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Available Wallet Balance */}
            <div className="bg-[var(--bg-card)] border-2 border-cyan-500 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Available Wallet Balance
                </p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  $ {parseFloat(balance?.main_balance || 0).toFixed(2)}
                </p>
              </div>
              <div className="bg-cyan-500/10 p-2 rounded-lg">
                <Wallet className="w-8 h-8 text-cyan-500" />
              </div>
            </div>

            {/* Main Wallet Balance */}
            <div className="bg-[var(--bg-card)] border-2 border-blue-500 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-[var(--text-secondary)] mb-1">
                  INCOME Wallet Balance
                </p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  ${" "}
                  {parseFloat(
                    dashboardData?.user_balance?.income_wallet
                  ).toFixed(2) || "0.00"}{" "}
                  USDT
                </p>
              </div>
              <div className="bg-blue-500/10 p-2 rounded-lg">
                <Building2 className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            {/* Action Buttons - Vertical Stack */}
            <div className="flex flex-col gap-4">
              <button
                className="bg-red-600 hover:bg-red-700 border-2 border-red-500 text-white p-4 rounded-lg font-semibold text-base transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                onClick={() => navigate("/withdraw")}
              >
                <ArrowUpFromLine className="w-5 h-5" />
                Withdraw
              </button>
              <button
                className="bg-green-600 hover:bg-green-700 border-2 border-green-500 text-white p-4 rounded-lg font-semibold text-base transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
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
