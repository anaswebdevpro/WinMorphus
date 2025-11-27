import React, { useState, useEffect, useCallback } from "react";
import { useSnackbar } from "notistack";
import { useAuth } from "../../../Context/UseAuth";
import { apiRequest } from "../../../Services/Api";
import { WITHDRAWAL_STATISTICS } from "../../../Api/Api_variables";

const Stats_30days = () => {
  const { token } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch withdrawal statistics
  const fetchWithdrawalStatistics = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      apiRequest({
        endpoint: WITHDRAWAL_STATISTICS,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          if (response?.data) {
            setStatistics(response.data);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.error("Error fetching withdrawal statistics:", error);
          setLoading(false);
          enqueueSnackbar("Failed to load withdrawal statistics", {
            variant: "error",
          });
        });
    } catch (error) {
      console.error("Error fetching withdrawal statistics:", error);
      enqueueSnackbar(error.message || "Failed to load withdrawal statistics", {
        variant: "error",
      });
      setLoading(false);
    }
  }, [token, enqueueSnackbar]);

  useEffect(() => {
    fetchWithdrawalStatistics();
  }, []);

  if (loading) {
    return (
      <div className="mb-8">
        <div className="bg-[var(--bg-card)] rounded-lg h-8 w-48 mb-4 animate-pulse"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-[var(--bg-card)] rounded-lg h-24"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!statistics) return null;

  // Statistics configuration
  const statsConfig = [
    {
      label: "Total Withdrawals",
      value: statistics.total_withdrawals || 0,
      color: "text-(--accent-primary)",
      format: (val) => val,
    },
    {
      label: "Completed",
      value: statistics.completed_withdrawals || 0,
      color: "text-(--status-success)",
      format: (val) => val,
    },
    {
      label: "Pending",
      value: statistics.pending_withdrawals || 0,
      color: "text-(--status-warning)",
      format: (val) => val,
    },
    {
      label: "Failed",
      value: statistics.failed_withdrawals || 0,
      color: "text-(--status-error)",
      format: (val) => val,
    },
    {
      label: "Average Amount",
      value: statistics.average_withdrawal || 0,
      color: "text-(--status-info)",
      format: (val) => `$${val}`,
    },
    {
      label: "Success Rate",
      value: statistics.success_rate || 0,
      color: "text-(--status-success)",
      format: (val) => `${val}%`,
    },
    {
      label: "Total Transactions",
      value: statistics.total_transactions || 0,
      color: "text-(--accent-primary)",
      format: (val) => val,
    },
    {
      label: "Period",
      value: statistics.period_days || 0,
      color: "text-(--status-info)",
      format: (val) => `${val} Days`,
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
        Withdrawal Statistics (Last {statistics.period_days} Days)
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsConfig.map((stat, index) => (
          <div
            key={index}
            className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg p-6"
          >
            <div className="flex flex-col">
              <span className="text-[var(--text-secondary)] text-sm font-medium mb-2">
                {stat.label}
              </span>
              <span className={`text-3xl font-bold ${stat.color}`}>
                {stat.format(stat.value)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats_30days;
