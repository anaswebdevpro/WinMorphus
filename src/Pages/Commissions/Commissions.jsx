import React, { useState, useEffect } from "react";
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Award,
  Target,
} from "lucide-react";
import { PageHeader, ShimmerLoader } from "../../Component/ui";
import { useAuth } from "../../Context/UseAuth";
import { apiRequest } from "../../Services/Api";
import {
  COMMISSION_STATISTICS,
  COMMISSION_EARNINGS_HISTORY,
} from "../../Api/Api_variables";
import { enqueueSnackbar } from "notistack";

// Reusable StatCard Component
// eslint-disable-next-line no-unused-vars
const StatCard = ({
  title,
  value,
  gradient,
  border,
  iconBg,
  iconColor,
  // eslint-disable-next-line no-unused-vars
  icon: IconComponent,
}) => (
  <div
    className={`bg-linear-to-br ${gradient} border-2 ${border} rounded-lg p-6 shadow-lg hover:shadow-xl transition-all relative overflow-hidden`}
  >
    <div className="absolute top-4 right-4">
      <div className={`${iconBg} p-3 rounded-lg`}>
        <IconComponent className={`w-6 h-6 ${iconColor}`} />
      </div>
    </div>
    <div className="flex items-center gap-2 mb-2">
      <IconComponent className={`w-5 h-5 ${iconColor}`} />
      <p className="text-sm font-medium opacity-90">{title}</p>
    </div>
    <h2 className="text-3xl font-bold text-white">{value}</h2>
  </div>
);

const Commissions = () => {
  const [earnings, setEarnings] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 20,
    total: 0,
    last_page: 0,
  });
  const [stats, setStats] = useState({
    total_commission_earned: 0,
    total_referrals: 0,
    active_referrals: 0,
    commission_rate: 0,
  });
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const fetchCommissionData = () => {
    if (!token) return;

    setLoading(true);

    // Fetch both statistics and earnings history
    Promise.all([
      apiRequest({
        endpoint: COMMISSION_STATISTICS,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }),
      apiRequest({
        endpoint: COMMISSION_EARNINGS_HISTORY,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
      .then(([statsResponse, earningsResponse]) => {
        // Set stats from statistics API
        setStats({
          total_commission_earned:
            statsResponse.data.total_commission_earned || 0,
          total_referrals: statsResponse.data.total_referrals || 0,
          active_referrals: statsResponse.data.active_referrals || 0,
          commission_rate: statsResponse.data.commission_rate || 0,
        });

        // Set earnings and pagination from earnings history API
        setEarnings(earningsResponse.data.earnings);
        setPagination(earningsResponse.data.pagination);
        setLoading(false);
      })
      .catch((error) => {
        enqueueSnackbar(
          error.message || "Failed to load commission information",
          { variant: "error" }
        );
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCommissionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto p-6">
          <PageHeader
            title="Commission Earnings"
            description="Track and manage your referral commission earnings"
          />
          <ShimmerLoader variant="dashboard" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto p-6">
        <PageHeader
          title="Commission Earnings"
          description="Track and manage your referral commission earnings"
        />

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Commission"
            value={`$${stats.total_commission_earned.toFixed(2)}`}
            icon={DollarSign}
            gradient="from-green-900 to-slate-900"
            border="border-green-500"
            iconBg="bg-green-700/30"
            iconColor="text-green-400"
          />
          <StatCard
            title="Total Referrals"
            value={stats.total_referrals}
            icon={Users}
            gradient="from-blue-900 to-slate-900"
            border="border-blue-500"
            iconBg="bg-blue-700/30"
            iconColor="text-blue-400"
          />
          <StatCard
            title="Active Referrals"
            value={stats.active_referrals}
            icon={Target}
            gradient="from-yellow-900 to-slate-900"
            border="border-yellow-500"
            iconBg="bg-yellow-700/30"
            iconColor="text-yellow-400"
          />
          <StatCard
            title="Commission Rate"
            value={`${stats.commission_rate}%`}
            icon={Award}
            gradient="from-purple-900 to-slate-900"
            border="border-purple-500"
            iconBg="bg-purple-700/30"
            iconColor="text-purple-400"
          />
        </div>

        {/* Data Table */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto min-h-100">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-700/50">
                  <th className="text-left p-4 font-semibold text-gray-300">
                    S.No
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Date
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Referral Name
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Package
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Investment Amount
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Commission Rate
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Commission Earned
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Level
                  </th>
                </tr>
              </thead>
              <tbody>
                {earnings.length > 0 ? (
                  earnings.map((item, index) => (
                    <tr
                      key={item.id || index}
                      className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="p-4 text-gray-300">
                        <span className="font-medium">{index + 1}</span>
                      </td>
                      <td className="p-4 text-gray-300">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-yellow-400" />
                          {item.date}
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-400" />
                          {item.referral_name}
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-600/30 text-purple-300 rounded-lg text-sm">
                          <Award className="w-4 h-4" />
                          {item.package_name}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-white">
                          ${parseFloat(item.investment_amount).toFixed(2)}
                        </span>
                      </td>
                      <td className="p-4 text-cyan-400 font-medium">
                        {item.commission_rate}%
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-green-400">
                          ${parseFloat(item.commission_earned).toFixed(2)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600/30 text-blue-300 rounded text-sm font-medium">
                          <TrendingUp className="w-3 h-3" />
                          Level {item.level}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-500">
                      No commission earnings available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Pagination */}
          <div className="px-4 py-4 border-t border-slate-700 bg-slate-700/30">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
              <div>
                Showing {earnings.length} of {pagination.total} entries
              </div>
              <div className="flex items-center gap-2">
                <span>
                  Page {pagination.current_page} of {pagination.last_page}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Commissions;
