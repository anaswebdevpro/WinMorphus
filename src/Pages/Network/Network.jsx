import React, { useState, useEffect } from "react";
import {
  Users,
  TrendingUp,
  UserCheck,
  DollarSign,
  Briefcase,
  Activity,
} from "lucide-react";
import { ShimmerLoader, PageHeader } from "../../Component/ui";
import { apiRequest } from "../../Services/Api";
import { NETWORK_LEVEL_WISE, NETWORK_STATS } from "../../Api/Api_variables";
import { useAuth } from "../../Context/UseAuth";
import { enqueueSnackbar } from "notistack";
import NetworkTree from "./NetworkTree";

/**
 * StatCard Component: Displays a single statistic card with a title, value, and icon.
 */
const StatCard = ({ title, value, icon, bgColor }) => (
  <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-yellow-500/50 transition-all">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-400 text-sm font-medium mb-2">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
      <div className={`${bgColor} p-3 rounded-lg`}>{icon}</div>
    </div>
  </div>
);

/**
 * Network Component: The main page for displaying the user's network statistics.
 */
const Network = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [networkStats, setNetworkStats] = useState(null);
  const [networkData, setNetworkData] = useState(null);
  const { token } = useAuth();

  const FetchNetwork = () => {
    setIsLoading(true);
    try {
      apiRequest({
        endpoint: NETWORK_LEVEL_WISE,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          console.log("Network Data:", response);
          setIsLoading(false);
          setNetworkData(response.data);
        })
        .catch((error) => {
          setIsLoading(false);
          console.error("Failed to fetch Network Data:", error);
          enqueueSnackbar("Failed to fetch Network Data: " + error.message, {
            variant: "error",
          });
        });
    } catch (error) {
      setIsLoading(false);
      console.error("Failed to fetch Network Data:", error);
      enqueueSnackbar("Failed to fetch Network Data. Please try again.", {
        variant: "error",
      });
    }
  };

  const fetchStats = () => {
    setIsLoading(true);
    try {
      apiRequest({
        endpoint: NETWORK_STATS,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          console.log("Network Data:", response);
          setIsLoading(false);
          const statsData = response.data;
          if (statsData) {
            setNetworkStats({
              directs: statsData.directs || 0,
              totalTeam: statsData.total_team || 0,
              activeTeam: statsData.active_team || 0,
              teamBusiness: statsData.team_business || 0,
              totalInvestment: statsData.total_investment || 0,
              activeInvestment: statsData.active_investment || 0,
            });
          }
        })
        .catch((error) => {
          setIsLoading(false);
          console.error("Failed to fetch Network Data:", error);
          enqueueSnackbar("Failed to fetch Network Data: " + error.message, {
            variant: "error",
          });
        });
    } catch (error) {
      setIsLoading(false);
      console.error("Failed to fetch Network Data:", error);
      enqueueSnackbar("Failed to fetch Network Data. Please try again.", {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    FetchNetwork();
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 bg-[#121212] min-h-screen text-white">
        <div className="max-w-7xl mx-auto">
          <PageHeader
            title="Track your Network Members"
            description="Monitor and manage your network members effectively"
          />
          <ShimmerLoader variant="dashboard" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 bg-[#121212] min-h-screen text-white">
        <div className="max-w-7xl mx-auto">
          <PageHeader
            title="Track your Network Members"
            description="Monitor and manage your network members effectively"
          />

          {/* Stat Cards */}
          {networkStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <StatCard
                title="Direct Referrals"
                value={networkStats.directs}
                icon={<Users className="w-6 h-6 text-blue-400" />}
                bgColor="bg-blue-600/30"
              />
              <StatCard
                title="Total Team"
                value={networkStats.totalTeam}
                icon={<TrendingUp className="w-6 h-6 text-green-400" />}
                bgColor="bg-green-600/30"
              />
              <StatCard
                title="Active Team"
                value={networkStats.activeTeam}
                icon={<UserCheck className="w-6 h-6 text-yellow-400" />}
                bgColor="bg-yellow-600/30"
              />
              <StatCard
                title="Team Business"
                value={`$${networkStats.teamBusiness}`}
                icon={<DollarSign className="w-6 h-6 text-purple-400" />}
                bgColor="bg-purple-600/30"
              />
              <StatCard
                title="Total Investment"
                value={`$${networkStats.totalInvestment}`}
                icon={<Briefcase className="w-6 h-6 text-indigo-400" />}
                bgColor="bg-indigo-600/30"
              />
              <StatCard
                title="Active Investment"
                value={`$${networkStats.activeInvestment}`}
                icon={<Activity className="w-6 h-6 text-pink-400" />}
                bgColor="bg-pink-600/30"
              />
            </div>
          )}

          <div>
            <NetworkTree networkData={networkData} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Network;
