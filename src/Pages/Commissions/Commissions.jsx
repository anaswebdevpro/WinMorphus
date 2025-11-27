/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Users, DollarSign, Award, Target } from "lucide-react";
import { PageHeader, ShimmerLoader } from "../../Component/ui";
import { useAuth } from "../../Context/UseAuth";
import { apiRequest } from "../../Services/Api";
import { COMMISSION_STATISTICS } from "../../Api/Api_variables";
import { enqueueSnackbar } from "notistack";
import CommissionTable from "./CommitionTable";
import AllTransactionTable from "./AllTransactionTable";

// Reusable StatCard Component
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

const Commissions = () => {
  const [stats, setStats] = useState({
    total_commission_earned: 0,
    total_referrals: 0,
    active_referrals: 0,
    commission_rate: 0,
  });
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const fetchCommissionStats = () => {
    if (!token) return;

    setLoading(true);

    // Fetch only statistics
    apiRequest({
      endpoint: COMMISSION_STATISTICS,
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((statsResponse) => {
        // Set stats from statistics API
        setStats(statsResponse.data);
        setLoading(false);
      })
      .catch((error) => {
        enqueueSnackbar(
          error.message || "Failed to load commission statistics",
          { variant: "error" }
        );
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCommissionStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-(--bg-primary) text-(--text-primary)">
        <div className="max-w-7xl mx-auto p-6">
          <PageHeader
            title="LeaderShip Income"
            description="Track and manage your referral commission earnings"
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
          title="LeaderShip Income"
          description="Track and manage your referral commission earnings"
        />

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Leadership Income"
            value={`$${parseFloat(stats?.result?.total || 0).toFixed(2)}`}
            icon={DollarSign}
            gradient="from-green-900 to-slate-900"
            border="border-green-500"
            iconBg="bg-green-700/30"
            iconColor="text-green-400"
          />
          <StatCard
            title="Total Referrals"
            value={`${parseInt(stats?.result?.total_active_directs || 0)}`}
            icon={Users}
            gradient="from-blue-900 to-slate-900"
            border="border-blue-500"
            iconBg="bg-blue-700/30"
            iconColor="text-blue-400"
          />
          <StatCard
            title="Active Referrals"
            value={`${parseInt(stats?.result?.total_directs || 0)}`}
            icon={Target}
            gradient="from-yellow-900 to-slate-900"
            border="border-yellow-500"
            iconBg="bg-yellow-700/30"
            iconColor="text-yellow-400"
          />
          {/* <StatCard
            title="Commission Rate"
            value={`${stats.commission_rate}%`}
            icon={Award}
            gradient="from-purple-900 to-slate-900"
            border="border-purple-500"
            iconBg="bg-purple-700/30"
            iconColor="text-purple-400"
          /> */}
        </div>
        {/* <div className="bg-slate-800 text-white p-4 rounded-lg shadow-lg mb-4 text-center relative">
          <h2 className="text-2xl font-bold">LeaderShip Overview</h2>
          
        </div> */}

        {/* Commission Table */}
        <CommissionTable />

        {/* All Transactions Table */}
        <AllTransactionTable />
      </div>
    </div>
  );
};

export default Commissions;
