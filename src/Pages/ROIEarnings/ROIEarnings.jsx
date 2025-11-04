import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  TrendingUp,
  Calendar,
  Package,
  DollarSign,
  Percent,
} from "lucide-react";

// Constants
const ENTRIES_PER_PAGE_OPTIONS = [5, 10, 25];
const DEFAULT_ENTRIES_PER_PAGE = 10;
const DEBOUNCE_DELAY = 300;

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

const PaginationButton = ({ onClick, disabled, children, isActive }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-3 py-1 border rounded-md transition-colors ${
      isActive
        ? "bg-yellow-500 text-white border-yellow-500"
        : "border-slate-600 text-gray-300 hover:border-yellow-500"
    } disabled:opacity-50 disabled:cursor-not-allowed`}
  >
    {children}
  </button>
);

const ROIEarnings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(
    DEFAULT_ENTRIES_PER_PAGE
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const debounceTimer = useRef(null);

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

  // Debounce search
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, DEBOUNCE_DELAY);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchTerm]);

  // Filter data
  const filteredData = useMemo(
    () =>
      data.filter((item) => {
        const searchLower = debouncedSearch.toLowerCase();
        return (
          item.package?.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower) ||
          item.date?.toLowerCase().includes(searchLower) ||
          item.amount?.toString().includes(searchLower)
        );
      }),
    [data, debouncedSearch]
  );

  // Paginate data
  const paginatedData = useMemo(
    () =>
      filteredData.slice(
        (currentPage - 1) * entriesPerPage,
        currentPage * entriesPerPage
      ),
    [filteredData, currentPage, entriesPerPage]
  );

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
      total: filteredData.length,
      totalPages: Math.ceil(filteredData.length / entriesPerPage),
    };
  }, [data, filteredData, entriesPerPage]);

  // Handlers
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEntriesPerPageChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, stats.totalPages));
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

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

        {/* Search and Filter Controls */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search by package, date, or amount..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Entries per page
              </label>
              <select
                value={entriesPerPage}
                onChange={handleEntriesPerPageChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
              >
                {ENTRIES_PER_PAGE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option} entries
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleClearFilters}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-gray-300 rounded-lg hover:bg-slate-600 hover:border-yellow-500/50 transition-colors font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>
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
                {paginatedData.length > 0 ? (
                  paginatedData.map((item, index) => (
                    <tr
                      key={item.id || index}
                      className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="p-4 text-gray-300">
                        <span className="font-medium">
                          {(currentPage - 1) * entriesPerPage + index + 1}
                        </span>
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
              <div>
                Showing{" "}
                {paginatedData.length > 0
                  ? (currentPage - 1) * entriesPerPage + 1
                  : 0}{" "}
                to {Math.min(currentPage * entriesPerPage, filteredData.length)}{" "}
                of {filteredData.length} entries
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center space-x-2">
                <PaginationButton
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </PaginationButton>

                <div className="flex space-x-1">
                  {Array.from(
                    { length: Math.min(5, stats.totalPages) },
                    (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <PaginationButton
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          isActive={currentPage === pageNum}
                        >
                          {pageNum}
                        </PaginationButton>
                      );
                    }
                  )}
                </div>

                <PaginationButton
                  onClick={handleNextPage}
                  disabled={currentPage === stats.totalPages}
                >
                  Next
                </PaginationButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROIEarnings;
