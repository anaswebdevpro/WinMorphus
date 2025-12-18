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
import PaginationButton from "../../Component/ui/PaginationButton";
import { useAuth } from "../../Context/UseAuth";
import { apiRequest } from "../../Services/Api";
import { ROI_ACTIVE_INVESTMENTS } from "../../Api/Api_variables";
import { enqueueSnackbar } from "notistack";
import { NoData } from "../../assets";

// Reusable StatCard Component
// eslint-disable-next-line no-unused-vars
const StatCard = ({ title, value, icon: IconComponent }) => (
  <div className="bg-(--bg-card-gradient-start) bg-linear-to-br from-(--bg-card-gradient-start) to-(--bg-card-gradient-end) border-2 border-(--border-accent) rounded-lg p-6 shadow-lg hover:shadow-xl transition-all relative overflow-hidden">
    <div className="absolute top-4 right-4">
      <div className="bg-(--accent-primary)/20 p-3 rounded-lg">
        <IconComponent className="w-6 h-6 text-(--accent-primary)" />
      </div>
    </div>
    <div className="flex items-center gap-2 mb-2">
      <IconComponent className="w-5 h-5 text-(--accent-primary)" />
      <p className="text-sm font-medium text-(--text-secondary) opacity-90">
        {title}
      </p>
    </div>
    <h2 className="text-3xl font-bold text-(--text-primary)">{value}</h2>
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
  // Pagination
  const ENTRIES_PER_PAGE_OPTIONS = [5, 10, 25];
  const DEFAULT_ENTRIES_PER_PAGE = 5;
  const [entriesPerPage, setEntriesPerPage] = useState(
    DEFAULT_ENTRIES_PER_PAGE
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    per_page: DEFAULT_ENTRIES_PER_PAGE,
    current_page: 1,
    last_page: 1,
  });
  const { token } = useAuth();

  const fetchInvestments = () => {
    if (!token) return;

    setLoading(true);
    const payload = {
      page: currentPage,
      per_page: entriesPerPage,
    };
    apiRequest({
      endpoint: ROI_ACTIVE_INVESTMENTS,
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      data: payload,
    })
      .then((response) => {
        if (response?.data) {
          setInvestments(response.data.investments || []);
          setStats({
            active_invest: response.data.total_active_investments,
            total_invest: response.data.total_invested_amount,
            total_earned: response.data.total_earned_so_far,
          });
          // update pagination if available
          if (response.data.pagination) {
            setPagination(response.data.pagination);
          }
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
  }, [currentPage, entriesPerPage]);

  // Pagination derived values
  const totalPages = pagination?.last_page || 1;
  const paginatedData = investments; // server paginated

  const handleEntriesPerPageChange = (e) => {
    const newEntries = parseInt(e.target.value, 10);
    setEntriesPerPage(newEntries);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-(--bg-primary) text-(--text-primary)">
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
    <div className="min-h-screen bg-(--bg-primary) text-(--text-primary)">
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
        <div className="bg-(--bg-card) border border-(--border-primary) rounded-lg overflow-hidden">
          <div className="overflow-x-auto min-h-100">
            <table className="w-full">
              <thead>
                <tr className="border-b border-(--border-primary) bg-(--bg-tertiary)">
                  <th className="text-left p-4 font-semibold text-[var(--text-secondary)]">
                    S.No
                  </th>
                  <th className="text-left p-4 font-semibold text-[var(--text-secondary)]">
                    Package
                  </th>
                  <th className="text-left p-4 font-semibold text-(--text-secondary)">
                    Amount
                  </th>
                  <th className="text-left p-4 font-semibold text-[var(--text-secondary)]">
                    Rate
                  </th>
                  <th className="text-left p-4 font-semibold text-[var(--text-secondary)]">
                    Purchase Date
                  </th>
                  <th className="text-left p-4 font-semibold text-[var(--text-secondary)]">
                    Days Active
                  </th>
                  <th className="text-left p-4 font-semibold text-[var(--text-secondary)]">
                    Earned So Far
                  </th>
                  <th className="text-left p-4 font-semibold text-[var(--text-secondary)]">
                    Total Earnings
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
                      <td className="p-4 text-[var(--text-secondary)]">
                        <span className="font-medium">
                          {(currentPage - 1) * entriesPerPage + index + 1}
                        </span>
                      </td>
                      <td className="p-4 text-[var(--text-secondary)]">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-600 rounded-lg text-sm border border-blue-500/20">
                          <Package className="w-4 h-4" />
                          {item.package_name}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-[var(--text-primary)]">
                          ${parseFloat(item.amount || 0).toFixed(2)}
                        </span>
                      </td>
                      <td className="p-4 text-cyan-500 font-medium">
                        ${item.rate_percentage}
                      </td>
                      <td className="p-4 text-[var(--text-secondary)]">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[var(--accent-primary)]" />
                          {item.purchase_date}
                        </div>
                      </td>
                      <td className="p-4 text-[var(--text-secondary)] font-semibold">
                        {/* {item.total_entries >= 365 ? (
                          <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-600 rounded-lg text-sm font-medium border border-green-500/20">
                            Completed
                          </span>
                        ) : (
                          <>
                           {Math.max(0, Math.floor(item.total_entries))} Days
                            
                          </>
                        )} */}
                        {item.total_entries} Days
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-green-600">
                          ${Math.max(0, item.earned_so_far).toFixed(2)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-green-600">
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
                    <td
                      colSpan={8}
                      className="p-8 text-center  text-(--text-muted)"
                    >
                      <div className="flex flex-col items-center justify-center py-8">
                        <img
                          src={NoData}
                          alt="No data"
                          className=" h-50 object-contain mb-4"
                        />
                        <h3 className="text-lg font-semibold text-(--text-primary)">
                          No data available yet
                        </h3>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Pagination */}
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
            <div className="text-sm text-(--text-muted) mt-2">
              Total: {pagination?.total || investments.length} entries
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROIEarnings;
