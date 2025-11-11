import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { Month: "Jan", Amount: 1000, Return: 1.2 },
  { Month: "Feb", Amount: 1500, Return: 1.5 },
  { Month: "Mar", Amount: 800, Return: 0.9 },
  { Month: "Apr", Amount: 2000, Return: 2.1 },
  { Month: "May", Amount: 2500, Return: 2.8 },
  { Month: "Jun", Amount: 1800, Return: 2.3 },
];

const RoiChart = () => {
  // Custom tooltip to show return as multiplier
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "#1e293b",
            border: "1px solid #475569",
            borderRadius: "8px",
            padding: "12px",
            color: "#fff",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
          }}
        >
          <p style={{ fontWeight: "bold", marginBottom: "8px" }}>{label}</p>
          {payload.map((entry, index) => (
            <p
              key={index}
              style={{
                color: entry.color,
                padding: "4px 0",
                fontSize: "14px",
              }}
            >
              {entry.name}:{" "}
              {entry.dataKey === "Return"
                ? `${entry.value}x`
                : `$${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom Y-axis tick formatter for return multipliers
  const formatReturnTick = (value) => `${value}x`;

  return (
    <div className="w-full bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold bg-linear-to-r from-yellow-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent inline-flex items-center gap-2">
          <span className="text-2xl text-white">📈</span>
          Investment Amount vs Returns
        </h2>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
        >
          <defs>
            {/* Gradient for Investment Amount - Blue gradient (matching packages) */}
            <linearGradient id="amountGradient" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#1e3a8a" stopOpacity={1} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={1} />
            </linearGradient>

            {/* Gradient for Returns - Purple gradient (matching packages) */}
            <linearGradient id="returnGradient" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#581c87" stopOpacity={1} />
              <stop offset="100%" stopColor="#a855f7" stopOpacity={1} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.3} />
          <XAxis
            dataKey="Month"
            stroke="#94a3b8"
            tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 500 }}
          />
          <YAxis
            yAxisId="left"
            stroke="#94a3b8"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            tickFormatter={formatReturnTick}
            domain={[0, 3]}
            label={{
              value: "Returns",
              angle: -90,
              position: "insideLeft",
              fill: "#94a3b8",
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#94a3b8"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            label={{
              value: "Amount ($)",
              angle: 90,
              position: "insideRight",
              fill: "#94a3b8",
            }}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(148, 163, 184, 0.1)" }}
          />
          <Legend
            wrapperStyle={{
              color: "#94a3b8",
              paddingTop: "10px",
            }}
            iconType="circle"
          />
          <Bar
            yAxisId="right"
            dataKey="Amount"
            fill="url(#amountGradient)"
            name="Investment Amount"
            radius={[8, 8, 0, 0]}
            animationDuration={1000}
          />
          <Bar
            yAxisId="left"
            dataKey="Return"
            fill="url(#returnGradient)"
            name="Return"
            radius={[8, 8, 0, 0]}
            animationDuration={1000}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RoiChart;
