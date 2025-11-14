/* eslint-disable no-unused-vars */
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
const StatCard = ({
  title,
  value,
  gradient,
  border,
  iconBg,
  iconColor,
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total ROI Earned"
            value={`$${stats.total_earned.toFixed(2)}`}
            icon={TrendingUp}
            gradient="from-green-900 to-slate-900"
            border="border-green-500"
            iconBg="bg-green-700/30"
            iconColor="text-green-400"
          />
          <StatCard
            title="Total Investment"
            value={`$${stats.total_invest.toFixed(2)}`}
            icon={DollarSign}
            gradient="from-blue-900 to-slate-900"
            border="border-blue-500"
            iconBg="bg-blue-700/30"
            iconColor="text-blue-400"
          />
          <StatCard
            title="Active Investments"
            value={stats.active_invest}
            icon={Package}
            gradient="from-yellow-900 to-slate-900"
            border="border-yellow-500"
            iconBg="bg-yellow-700/30"
            iconColor="text-yellow-400"
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
                    Months Active
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Earned So Far
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Total Earnings
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
                        ${item.rate_percentage}
                      </td>
                      <td className="p-4 text-gray-300">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-yellow-400" />
                          {item.purchase_date}
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">
                        {item.total_entries >= 24 ? (
                          <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-600/30 text-green-300 rounded-lg text-sm font-medium">
                            Completed
                          </span>
                        ) : (
                          <>
                            {Math.max(0, Math.floor(item.total_entries))} /{" "}
                            {item.total_days} 24 Months
                          </>
                        )}
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
                    <td colSpan={8} className="p-8 text-center text-gray-500">
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
