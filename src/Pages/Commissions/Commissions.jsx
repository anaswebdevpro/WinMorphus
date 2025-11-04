import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  DollarSign,
  Calendar,
  Users,
  UserCheck,
  RefreshCw,
} from "lucide-react";

// Constants
const ENTRIES_PER_PAGE_OPTIONS = [5, 10, 25];
const DEFAULT_ENTRIES_PER_PAGE = 10;
const DEBOUNCE_DELAY = 300;

// Reusable Components
// eslint-disable-next-line no-unused-vars
const StatCard = ({ title, value, icon: IconComponent, color, bgColor }) => {
  const getGradientStyle = () => {
    if (color === "text-green-400") {
      return {
        backgroundImage: "linear-gradient(to bottom right, #10b981, #059669)",
        borderColor: "rgba(16, 185, 129, 0.5)",
      };
    } else if (color === "text-purple-400") {
      return {
        backgroundImage: "linear-gradient(to bottom right, #a855f7, #9333ea)",
        borderColor: "rgba(168, 85, 247, 0.5)",
      };
    } else if (color === "text-cyan-400") {
      return {
        backgroundImage: "linear-gradient(to bottom right, #06b6d4, #0891b2)",
        borderColor: "rgba(6, 182, 212, 0.5)",
      };
    }
    return {
      backgroundImage: "linear-gradient(to bottom right, #f97316, #ea580c)",
      borderColor: "rgba(249, 115, 22, 0.5)",
    };
  };

  return (
    <div
      className="rounded-lg p-6 hover:shadow-lg transition-all border"
      style={getGradientStyle()}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium mb-2">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-white">{value}</p>
        </div>
        <div className={`${bgColor} p-3 rounded-lg`}>
          <IconComponent className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

const PaginationButton = ({ onClick, disabled, children, isActive }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-3 py-1 border rounded-md transition-colors ${
      isActive
        ? "bg-blue-500 text-white border-blue-500"
        : "border-slate-600 text-gray-300 hover:border-blue-500"
    } disabled:opacity-50 disabled:cursor-not-allowed`}
  >
    {children}
  </button>
);

const Commissions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(
    DEFAULT_ENTRIES_PER_PAGE
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const debounceTimer = useRef(null);

  // Fetch data
  useEffect(() => {
    const mockCommissionData = [
      {
        id: 1,
        date: "2024-11-04",
        referral: "user@example.com",
        level: 1,
        commission: 50.0,
        description: "Direct Referral Commission",
        status: 1,
      },
      {
        id: 2,
        date: "2024-11-03",
        referral: "john@example.com",
        level: 2,
        commission: 25.0,
        description: "Level 2 Commission",
        status: 1,
      },
      {
        id: 3,
        date: "2024-11-02",
        referral: "sarah@example.com",
        level: 1,
        commission: 50.0,
        description: "Direct Referral Commission",
        status: 1,
      },
      {
        id: 4,
        date: "2024-11-01",
        referral: "mike@example.com",
        level: 3,
        commission: 10.0,
        description: "Level 3 Commission",
        status: 1,
      },
      {
        id: 5,
        date: "2024-10-31",
        referral: "emma@example.com",
        level: 1,
        commission: 50.0,
        description: "Direct Referral Commission",
        status: 1,
      },
      {
        id: 6,
        date: "2024-10-30",
        referral: "alex@example.com",
        level: 2,
        commission: 25.0,
        description: "Level 2 Commission",
        status: 1,
      },
      {
        id: 7,
        date: "2024-10-29",
        referral: "lisa@example.com",
        level: 1,
        commission: 50.0,
        description: "Direct Referral Commission",
        status: 1,
      },
      {
        id: 8,
        date: "2024-10-28",
        referral: "james@example.com",
        level: 4,
        commission: 5.0,
        description: "Level 4 Commission",
        status: 1,
      },
    ];

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setData(mockCommissionData);
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
      setCurrentPage(1);
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
        const matchesSearch =
          item.referral?.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower) ||
          item.date?.toLowerCase().includes(searchLower) ||
          item.commission?.toString().includes(searchLower) ||
          item.level?.toString().includes(searchLower);

        return matchesSearch;
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
    const totalCommission = data.reduce(
      (sum, item) => sum + (parseFloat(item.commission) || 0),
      0
    );
    const totalReferrals = data.length;
    const activeReferrals = data.filter((item) => item.status === 1).length;
    const thisMonthCommission = data
      .filter((item) => {
        const itemDate = new Date(item.date);
        const now = new Date();
        return (
          itemDate.getMonth() === now.getMonth() &&
          itemDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, item) => sum + (parseFloat(item.commission) || 0), 0);

    return {
      totalCommission: totalCommission.toFixed(2),
      thisMonthCommission: thisMonthCommission.toFixed(2),
      totalReferrals,
      activeReferrals,
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
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Commissions
            </h1>
            <p className="text-gray-400">
              Track and manage your commission earnings from referrals and
              network activities
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Commissions"
            value={`$${stats.totalCommission}`}
            icon={DollarSign}
            bgColor="bg-orange-400/30"
            color="text-orange-400"
          />
          <StatCard
            title="This Month"
            value={`$${stats.thisMonthCommission}`}
            icon={Calendar}
            bgColor="bg-green-400/30"
            color="text-green-400"
          />
          <StatCard
            title="Total Referrals"
            value={stats.totalReferrals}
            icon={Users}
            bgColor="bg-purple-400/30"
            color="text-purple-400"
          />
          <StatCard
            title="Active Referrals"
            value={stats.activeReferrals}
            icon={UserCheck}
            bgColor="bg-cyan-400/30"
            color="text-cyan-400"
          />
        </div>

        {/* Date Range Filters */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="dd-mm-yyyy"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="dd-mm-yyyy"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search by email or level..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={handleClearFilters}
                className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 text-gray-300 rounded-lg hover:bg-slate-600 hover:border-blue-500/50 transition-colors font-medium"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Commission History Table */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-700/50">
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Date
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Referral
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Level
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-300">
                    Commission
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
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-yellow-400" />
                          {item.date || "N/A"}
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">
                        <span className="font-medium text-blue-400">
                          {item.referral || "N/A"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-3 py-1 bg-slate-700 text-white rounded-lg text-sm font-medium">
                          Level {item.level || "N/A"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-green-400">
                          ${parseFloat(item.commission || 0).toFixed(2)}
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
                      No commission history available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Pagination */}
          <div className="px-4 py-4 border-t border-slate-700 bg-slate-700/30">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-400">
                <select
                  value={entriesPerPage}
                  onChange={handleEntriesPerPageChange}
                  className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {ENTRIES_PER_PAGE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option} entries
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-sm text-gray-400">
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

export default Commissions;
