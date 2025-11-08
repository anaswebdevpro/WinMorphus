import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Calendar,
  Package,
  DollarSign,
  Percent,
} from "lucide-react";
import { PageHeader, ShimmerLoader } from "../../Component/ui";
import { useAuth } from "../../Context/UseAuth";
import { apiRequest } from "../../Services/Api";
import { ROI_ACTIVE_INVESTMENTS } from "../../Api/Api_variables";
import { enqueueSnackbar } from "notistack";

// Reusable StatCard Component

// eslint-disable-next-line no-unused-vars
const StatCard = ({ title, value, color, icon: IconComponent, bgColor }) => (
  <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-yellow-500/50 transition-all">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-400 text-sm font-medium mb-2">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
      <div className={`${bgColor} p-3 rounded-lg`}>
        <IconComponent className={`w-6 h-6 ${color}`} />
      </div>
    </div>
  </div>
);

const ROIEarnings = () => {
  const [investments, setInvestments] = useState([]);
  const [stats, setStats] = useState({
    active_invest: 0,
    total_invest: 0,
    total_earned: 0,
  });
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const fetchInvestments = () => {
    if (!token) return;

    setLoading(true);
    apiRequest({
      endpoint: ROI_ACTIVE_INVESTMENTS,
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (response?.data) {
          setInvestments(response.data.investments || []);
          setStats({
            active_invest: response.data.total_active_investments,
            total_invest: response.data.total_invested_amount,
            total_earned: response.data.total_earned_so_far,
          });
        }
        setLoading(false);
      })
      .catch((error) => {
        enqueueSnackbar(
          error.message || "Failed to load Active Investment information",
          { variant: "error" }
        );
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchInvestments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto p-6">
          <PageHeader
            title="ROI Earnings"
            description="Track and manage your ROI earnings from investments"
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
          title="ROI Earnings"
          description="Track and manage your ROI earnings from investments"
        />

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total ROI Earned"
            value={`$${stats.total_earned.toFixed(2)}`}
            icon={TrendingUp}
            color="text-green-400"
            bgColor="bg-green-600/30"
          />
          <StatCard
            title="Total Investment"
            value={`$${stats.total_invest.toFixed(2)}`}
            icon={DollarSign}
            color="text-blue-400"
            bgColor="bg-blue-600/30"
          />
          <StatCard
            title="Active Investments"
            value={stats.active_invest}
            icon={Package}
            color="text-yellow-400"
            bgColor="bg-yellow-600/30"
          />
          <StatCard
            title="ROI Percentage"
            value={`${
              investments.length > 0 ? investments[0].rate_percentage : "0.00"
            }%`}
            icon={Percent}
            color="text-purple-400"
            bgColor="bg-purple-600/30"
          />
        </div>

        {/* Data Table */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-700/50">
                  <th className="text-left p-4 font-semibold text-gray-300">
                    S.No
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Package
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Amount
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Rate
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Purchase Date
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Days Active
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Progress
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Earned So Far
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Projected Earnings
                  </th>
                </tr>
              </thead>
              <tbody>
                {investments.length > 0 ? (
                  investments.map((item, index) => (
                    <tr
                      key={item.id || index}
                      className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="p-4 text-gray-300">
                        <span className="font-medium">{index + 1}</span>
                      </td>
                      <td className="p-4 text-gray-300">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/30 text-blue-300 rounded-lg text-sm">
                          <Package className="w-4 h-4" />
                          {item.package_name}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-white">
                          ${parseFloat(item.amount || 0).toFixed(2)}
                        </span>
                      </td>
                      <td className="p-4 text-cyan-400 font-medium">
                        {item.rate_percentage}%
                      </td>
                      <td className="p-4 text-gray-300">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-yellow-400" />
                          {item.purchase_date}
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">
                        {Math.max(0, Math.floor(item.days_active))} /{" "}
                        {item.total_days} days
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full transition-all"
                              style={{
                                width: `${Math.max(
                                  0,
                                  Math.min(100, item.progress_percentage)
                                )}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-400">
                            {Math.max(0, item.progress_percentage).toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-green-400">
                          ${Math.max(0, item.earned_so_far).toFixed(2)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-emerald-400">
                          $
                          {parseFloat(
                            item.projected_total_earnings || 0
                          ).toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-gray-500">
                      No active investments available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Pagination */}
          <div className="px-4 py-4 border-t border-slate-700 bg-slate-700/30">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
              <div>Total: {investments.length} entries</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROIEarnings;
