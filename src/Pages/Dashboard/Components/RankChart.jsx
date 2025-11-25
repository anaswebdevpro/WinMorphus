import React, { useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { RANK_CARRFORWARD_BALANCE } from "../../../Api/Api_variables";
import { apiRequest } from "../../../Services/Api";
import { useSnackbar } from "notistack";
import { useAuth } from "../../../Context/UseAuth";

// RankChart

const RankChart = () => {
  const [loading, setLoading] = React.useState(false);
  const { token } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [RankData, setRankData] = React.useState(null);
  const levels = Array.isArray(RankData?.levels) ? RankData.levels : [];

  const FetchRanks = () => {
    if (!token) return;

    try {
      setLoading(true);

      apiRequest({
        endpoint: RANK_CARRFORWARD_BALANCE,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          setRankData(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch balance data:", error);
          const errorMessage = error?.message || "Failed to fetch balance data";
          enqueueSnackbar(errorMessage, { variant: "error" });
          setLoading(false);
        });
    } catch (error) {
      enqueueSnackbar(error?.message, { variant: "error" });
    }
  };
  useEffect(() => {
    if (token) {
      FetchRanks();
    }
  }, []);

  if (loading || !RankData) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg animate-pulse h-48"></div>
    );
  }

  // Map incoming levels into chart-friendly data
  const chartData = levels.map((lvl) => ({
    name: `Level ${lvl.level}`,
    required: Number(lvl.required_amount) || 0,
    carry: Number(lvl.carry_forward_amount) || 0,
  }));

  // If no levels available, render a small placeholder message
  if (!chartData.length) {
    return (
      <div className="text-center text-sm text-gray-400 p-4">
        No level data available
      </div>
    );
  }

  return (
    <div className="w-full" style={{ minWidth: 300 }}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 12, right: 12, left: 0, bottom: 12 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#27354A" />
          <XAxis dataKey="name" tick={{ fill: "#c7d2fe" }} />
          <YAxis
            tickFormatter={(v) => v.toLocaleString()}
            tick={{ fill: "#c7d2fe" }}
          />
          <Tooltip formatter={(value) => value?.toLocaleString?.() ?? value} />
          <Legend />
          <Bar dataKey="carry" name="Business Carry Forward" fill="#00C950" />
          <Bar dataKey="required" name="Required Amount" fill="#FF8042" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RankChart;
