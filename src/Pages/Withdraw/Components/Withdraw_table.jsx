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
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden animate-pulse">
        <div className="p-4 space-y-4">
          <div className="h-12 bg-slate-700 rounded"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
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
                Amount
              </th>
              <th className="text-left p-4 font-semibold text-gray-300">Fee</th>
              <th className="text-left p-4 font-semibold text-gray-300">
                Network
              </th>
              <th className="text-left p-4 font-semibold text-gray-300">
                Status
              </th>
              <th className="text-left p-4 font-semibold text-gray-300">OTP</th>
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
                    {(currentPage - 1) * entriesPerPage + index + 1}
                  </td>
                  <td className="p-4 text-gray-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-yellow-400" />
                      {item.date}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-green-400 font-semibold">
                        {item.amount} {item.currency || "USDT"}
                      </span>
                      {item.notes && (
                        <span className="text-xs text-gray-500 mt-1">
                          {item.notes}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-red-400 font-medium">
                    {item.fee ? `${item.fee} ${item.currency || "USDT"}` : "-"}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-gray-300 font-medium">
                        {item.network}
                      </span>
                      {item.wallet_address && (
                        <span className="text-xs text-gray-400 mt-1 break-all">
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
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Check className="w-3 h-3" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  No withdrawal history available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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
