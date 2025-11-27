import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSnackbar } from "notistack";
import { useAuth } from "../../Context/UseAuth";
import { apiRequest } from "../../Services/Api";
import { COMMISSION_EARNINGS_HISTORY } from "../../Api/Api_variables";
import { Calendar, TrendingUp, Award } from "lucide-react";
import PaginationButton from "../../Component/ui/PaginationButton";

// Constants
const ENTRIES_PER_PAGE_OPTIONS = [5, 10, 25];
const DEFAULT_ENTRIES_PER_PAGE = 5;

const CommissionTable = () => {
  const { token } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    per_page: DEFAULT_ENTRIES_PER_PAGE,
    current_page: 1,
    last_page: 1,
  });
  const [entriesPerPage, setEntriesPerPage] = useState(
    DEFAULT_ENTRIES_PER_PAGE
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);

  // Level color mapping
  const getLevelColors = (level) => {
    const levelColors = {
      1: "bg-emerald-600/30 border-emerald-500/20",
      2: "bg-blue-600/30 border-blue-500/20",
      3: "bg-purple-600/30 border-purple-500/20",
      4: "bg-orange-600/30 border-orange-500/20",
      5: "bg-pink-600/30 border-pink-500/20",
      6: "bg-cyan-600/30 border-cyan-500/20",
      7: "bg-yellow-600/30 border-yellow-500/20",
      8: "bg-red-600/30 border-red-500/20",
      9: "bg-cyan-600/30 border-cyan-500/20",
      10: "bg-violet-600/30 border-violet-500/20",
    };
    // Use theme primary text color for badge label to ensure contrast in light theme
    return (
      (levelColors[level] || "bg-slate-600/30 border-slate-500/20") +
      " text-(--text-primary)"
    );
  };

  // Fetch commission earnings history
  const fetchCommissionEarnings = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const requestData = {
        page: currentPage,
        per_page: entriesPerPage,
      };

      // Add date filters if both dates are provided
      if (startDate && endDate) {
        requestData.start_date = startDate;
        requestData.end_date = endDate;
      }

      apiRequest({
        endpoint: COMMISSION_EARNINGS_HISTORY,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        data: requestData,
      }).then((response) => {
        if (response?.data) {
          setEarnings(response.data.earnings || []);
          setPagination(response.data.pagination || {});
        }
      });
    } catch (error) {
      console.error("Error fetching commission earnings:", error);
      enqueueSnackbar("Failed to load commission earnings", {
        variant: "error",
      });
    } finally {
      setLoading(false);
      setIsFiltering(false);
    }
  }, [token, currentPage, entriesPerPage, startDate, endDate, enqueueSnackbar]);

  useEffect(() => {
    fetchCommissionEarnings();
  }, [fetchCommissionEarnings]);

  // Pagination calculations
  const totalPages = useMemo(
    () => pagination?.last_page || 1,
    [pagination?.last_page]
  );

  const paginatedData = useMemo(() => earnings, [earnings]);

  // Handlers
  const handleEntriesPerPageChange = (e) => {
    const newEntriesPerPage = parseInt(e.target.value, 10);
    setEntriesPerPage(newEntriesPerPage);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Date filter handlers
  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
    setIsFiltering(true);
    // This will trigger fetchCommissionEarnings through useEffect
  };

  // Auto-filter when dates change
  useEffect(() => {
    if (startDate && endDate) {
      setIsFiltering(true);
      setCurrentPage(1);
      fetchCommissionEarnings();
    }
  }, [startDate, endDate, fetchCommissionEarnings]);

  // Clear filter effect
  useEffect(() => {
    if (isFiltering && !startDate && !endDate) {
      fetchCommissionEarnings();
    }
  }, [startDate, endDate, isFiltering, fetchCommissionEarnings]);

  if (loading) {
    return (
      <div className="bg-(--bg-card) border border-(--border-primary) rounded-lg overflow-hidden animate-pulse">
        <div className="p-4 space-y-4">
          <div className="h-12 bg-(--bg-tertiary) rounded"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-(--bg-tertiary) rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header with Title and Filters - Separate from table */}
      <div className="bg-(--bg-card) border border-(--border-primary) rounded-lg overflow-hidden mb-6">
        <div className="p-4 bg-(--bg-tertiary)">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            {/* Title */}
            <div className="shrink-0">
              <h2 className="text-xl font-semibold text-(--text-primary)">
                Leadership Income History
              </h2>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:flex-wrap">
              {/* Date Filter */}
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <label className="text-sm font-medium text-(--text-secondary) whitespace-nowrap">
                  Filter by Date:
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-(--input-bg) border border-(--input-border) rounded px-3 py-1 text-(--text-primary) text-sm focus:outline-none focus:ring-2 focus:ring-(--accent-primary) w-full sm:w-auto"
                    placeholder="Start Date"
                  />
                  <span className="text-(--text-muted) text-sm">to</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-(--input-bg) border border-(--input-border) rounded px-3 py-1 text-(--text-primary) text-sm focus:outline-none focus:ring-2 focus:ring-(--accent-primary) w-full sm:w-auto"
                    placeholder="End Date"
                  />
                </div>
              </div>

              {/* Clear Filter Button */}
              {(startDate || endDate) && (
                <button
                  onClick={handleClearFilter}
                  disabled={isFiltering}
                  className="bg-(--accent-secondary) hover:bg-(--accent-hover) disabled:bg-(--bg-tertiary) text-(--text-primary) px-4 py-1 rounded text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-(--accent-primary) whitespace-nowrap"
                >
                  Clear Filter
                </button>
              )}
            </div>
          </div>

          {/* Filter Status Messages */}
          {startDate && endDate && (
            <div className="mt-3 text-sm text-(--text-secondary)">
              Showing results from {new Date(startDate).toLocaleDateString()} to{" "}
              {new Date(endDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      {/* Table Component - Separate */}
      <div className="bg-(--bg-card) border border-(--border-primary) rounded-lg overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b-2 border-(--border-secondary) px-10 bg-(--bg-secondary)">
                <th className="text-left py-4 pl-30 pr-6 font-semibold text-(--text-secondary) w-20">
                  S.No
                </th>
                <th className="text-left py-4 px-6 font-semibold text-(--text-secondary) w-40">
                  Date
                </th>
                <th className="text-left py-4 px-6 font-semibold text-(--text-secondary) w-32">
                  Amount
                </th>
                <th className="text-left py-4 px-6 font-semibold text-(--text-secondary) w-32">
                  Level
                </th>
                <th className="text-left py-4 pl-6 pr-8 font-semibold text-(--text-secondary) min-w-[300px]">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <tr
                    key={item.id || index}
                    className="border-b border-(--border-primary) hover:bg-(--bg-tertiary) transition-colors"
                  >
                    <td className="py-4 pl-32 pr-6 text-(--text-primary) font-medium w-4">
                      <span className="font-medium">
                        {(currentPage - 1) * entriesPerPage + index + 1}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-(--text-secondary) w-40">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
                        <span className="whitespace-nowrap">
                          {new Date(item.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 w-32">
                      <span className="font-semibold text-green-600 whitespace-nowrap">
                        ${parseFloat(item.amount).toFixed(2)}
                      </span>
                    </td>
                    <td className="py-4 px-6 w-32">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm font-medium border whitespace-nowrap ${getLevelColors(
                          item.level
                        )}`}
                      >
                        <TrendingUp className="w-3 h-3 shrink-0" />
                        Level {item.level}
                      </span>
                    </td>
                    <td className="py-4 pl-6 pr-8 min-w-[300px]">
                      <div className="flex items-start gap-2">
                        <Award className="w-4 h-4 text-(--accent-primary) mt-0.5 shrink-0" />
                        <span className="text-(--text-secondary) text-sm leading-relaxed wrap-break-word">
                          {item.description}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 pl-12 pr-8 text-center text-(--text-secondary)"
                  >
                    No commission earnings available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-4 border-t border-(--border-primary) bg-(--bg-tertiary)">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-(--text-muted)">
              <select
                value={entriesPerPage}
                onChange={handleEntriesPerPageChange}
                className="bg-(--input-bg) border border-(--input-border) rounded px-2 py-1 text-(--text-primary) text-sm focus:outline-none focus:ring-2 focus:ring-(--accent-primary) w-full sm:w-auto"
              >
                {ENTRIES_PER_PAGE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option} entries
                  </option>
                ))}
              </select>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center space-x-2 overflow-x-auto">
              <PaginationButton
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </PaginationButton>

              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                })}
              </div>

              <PaginationButton
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </PaginationButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommissionTable;
