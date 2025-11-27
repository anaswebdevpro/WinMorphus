import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSnackbar } from "notistack";
import { useAuth } from "../../../Context/UseAuth";
import { apiRequest } from "../../../Services/Api";
import { WITHDRAWAL_TABLE_HISTORY } from "../../../Api/Api_variables";
import { Calendar, Check } from "lucide-react";
import StatusBadge from "../../../Component/ui/StatusBadge";
import PaginationButton from "../../../Component/ui/PaginationButton";

// Constants
const ENTRIES_PER_PAGE_OPTIONS = [5, 10, 25];
const DEFAULT_ENTRIES_PER_PAGE = 20;

const Withdraw_table = () => {
  const { token } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
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

  // Fetch withdrawal history
  const fetchWithdrawalHistory = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      apiRequest({
        endpoint: WITHDRAWAL_TABLE_HISTORY,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        data: {
          page: currentPage,
          per_page: entriesPerPage,
        },
      }).then((response) => {
        if (response?.data) {
          setWithdrawalHistory(response.data.requests || []);
          setPagination(response.data.pagination || {});
        }
      });
    } catch (error) {
      console.error("Error fetching withdrawal history:", error);
      enqueueSnackbar("Failed to load withdrawal history", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [token, currentPage, entriesPerPage, enqueueSnackbar]);

  useEffect(() => {
    fetchWithdrawalHistory();
  }, [fetchWithdrawalHistory]);

  // Pagination calculations
  const totalPages = useMemo(
    () => pagination?.last_page || 1,
    [pagination?.last_page]
  );

  const paginatedData = useMemo(() => withdrawalHistory, [withdrawalHistory]);

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

  if (loading) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg overflow-hidden animate-pulse">
        <div className="p-4 space-y-4">
          <div className="h-12 bg-[var(--bg-tertiary)] rounded"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-[var(--bg-tertiary)] rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto min-h-100">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border-primary)] bg-[var(--bg-tertiary)]">
              <th className="text-left p-4 font-semibold text-[var(--text-secondary)]">
                S.No
              </th>
              <th className="text-left p-4 font-semibold text-[var(--text-secondary)]">
                Date
              </th>
              <th className="text-left p-4 font-semibold text-[var(--text-secondary)]">
                Amount
              </th>
              <th className="text-left p-4 font-semibold text-[var(--text-secondary)]">
                Fee
              </th>
              <th className="text-left p-4 font-semibold text-[var(--text-secondary)]">
                Network
              </th>
              <th className="text-left p-4 font-semibold text-[var(--text-secondary)]">
                Status
              </th>
              <th className="text-left p-4 font-semibold text-[var(--text-secondary)]">
                OTP
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr
                  key={item.id || index}
                  className="border-b border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                  <td className="p-4 text-[var(--text-secondary)]">
                    {(currentPage - 1) * entriesPerPage + index + 1}
                  </td>
                  <td className="p-4 text-[var(--text-secondary)]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-(--accent-primary)" />
                      {item.date}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-(--status-success) font-semibold">
                        {item.amount} {item.currency || "USDT"}
                      </span>
                      {item.notes && (
                        <span className="text-xs text-(--text-muted) mt-1">
                          {item.notes}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-(--status-error) font-medium">
                    {item.fee ? `${item.fee} ${item.currency || "USDT"}` : "-"}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-[var(--text-secondary)] font-medium">
                        {item.network}
                      </span>
                      {item.wallet_address && (
                        <span className="text-xs text-[var(--text-muted)] mt-1 break-all">
                          {item.wallet_address}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <StatusBadge
                      status={item.status}
                      label={item.status_label}
                    />
                  </td>
                  <td className="p-4">
                    {item.is_otp_verified ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-(--status-success) text-(--text-primary)">
                        <Check className="w-3 h-3" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-(--bg-tertiary) text-(--text-secondary)">
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="p-8 text-center text-[var(--text-muted)]"
                >
                  No withdrawal history available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-4 border-t border-[var(--border-primary)] bg-[var(--bg-tertiary)]">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-[var(--text-muted)]">
            <select
              value={entriesPerPage}
              onChange={handleEntriesPerPageChange}
              className="bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] rounded px-2 py-1 text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ENTRIES_PER_PAGE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option} entries
                </option>
              ))}
            </select>
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
  );
};

export default Withdraw_table;
