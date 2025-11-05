import React, { useState, useMemo, useEffect } from "react";
import {
  TrendingUp,
  Calendar,
  Package,
  DollarSign,
  Percent,
} from "lucide-react";

// Constants
const DEFAULT_ENTRIES_PER_PAGE = 10;

// Reusable Components
// eslint-disable-next-line no-unused-vars
const StatCard = ({ title, value, icon: IconComponent, color, bgColor }) => (
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

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
      status === 1 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
    }`}
  >
    {status === 1 ? "ACTIVE" : "INACTIVE"}
  </span>
);

const ROIEarnings = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data
  useEffect(() => {
    const mockROIData = [
      {
        id: 1,
        date: "2024-11-04",
        package: "Premium",
        amount: 150.0,
        description: "Daily ROI Earnings",
        status: 1,
      },
      {
        id: 2,
        date: "2024-11-03",
        package: "Standard",
        amount: 120.0,
        description: "Daily ROI Earnings",
        status: 1,
      },
      {
        id: 3,
        date: "2024-11-02",
        package: "Elite",
        amount: 200.0,
        description: "Daily ROI Earnings",
        status: 1,
      },
      {
        id: 4,
        date: "2024-11-01",
        package: "Premium",
        amount: 150.0,
        description: "Daily ROI Earnings",
        status: 1,
      },
      {
        id: 5,
        date: "2024-10-31",
        package: "Standard",
        amount: 120.0,
        description: "Daily ROI Earnings",
        status: 1,
      },
      {
        id: 6,
        date: "2024-10-30",
        package: "Premium",
        amount: 150.0,
        description: "Daily ROI Earnings",
        status: 1,
      },
      {
        id: 7,
        date: "2024-10-29",
        package: "Elite",
        amount: 200.0,
        description: "Daily ROI Earnings",
        status: 1,
      },
      {
        id: 8,
        date: "2024-10-28",
        package: "Standard",
        amount: 120.0,
        description: "Daily ROI Earnings",
        status: 1,
      },
    ];

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setData(mockROIData);
      setLoading(false);
    }, 500);
  }, []);

  // Filter data
  const filteredData = useMemo(() => data, [data]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalROI = data.reduce(
      (sum, item) => sum + (parseFloat(item.amount) || 0),
      0
    );
    const activeInvestments = data.filter((item) => item.status === 1).length;

    return {
      totalROIEarned: totalROI.toFixed(2),
      totalInvestment: (totalROI * 10).toFixed(2), // Mock calculation
      activeInvestments,
      roiPercentage: (3.5).toFixed(2), // Mock percentage
    };
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-slate-800 rounded-lg h-24"></div>
              ))}
            </div>
            <div className="bg-slate-800 rounded-lg h-96"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-2">
            ROI Earnings
          </h1>
          <p className="text-gray-400">
            Track and manage your ROI earnings from investments
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total ROI Earned"
            value={`$${stats.totalROIEarned}`}
            icon={TrendingUp}
            color="text-green-400"
            bgColor="bg-green-600/30"
          />
          <StatCard
            title="Total Investment"
            value={`$${stats.totalInvestment}`}
            icon={DollarSign}
            color="text-blue-400"
            bgColor="bg-blue-600/30"
          />
          <StatCard
            title="Active Investments"
            value={stats.activeInvestments}
            icon={Package}
            color="text-yellow-400"
            bgColor="bg-yellow-600/30"
          />
          <StatCard
            title="ROI Percentage"
            value={`${stats.roiPercentage}%`}
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
                    Serial No.
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Date
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Package
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Amount
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
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
                          {item.date || "N/A"}
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/30 text-blue-300 rounded-lg text-sm">
                          <Package className="w-4 h-4" />
                          {item.package || "N/A"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-green-400">
                          ${parseFloat(item.amount || 0).toFixed(2)}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400">
                        {item.description || "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Pagination */}
          <div className="px-4 py-4 border-t border-slate-700 bg-slate-700/30">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
              <div>Total: {filteredData.length} entries</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROIEarnings;
