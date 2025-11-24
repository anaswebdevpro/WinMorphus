import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const RoiChart = ({ stats }) => {
  // Demo data object

 
  const data = [
   { name: "Total investment", value: parseFloat((parseFloat(stats?.total_investment) || 0).toFixed(2)) },
   { name: "Level Income", value: parseFloat((parseFloat(stats?.current_level_income) || 0).toFixed(2)) },
    { name: "ROI Earned", value: parseFloat((parseFloat(stats?.current_roi_earned) || 0).toFixed(2)) },
    { name: "Reward Income", value: parseFloat((parseFloat(stats?.reward_income) || 0).toFixed(2)) },
  ];
 

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={5}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RoiChart;
