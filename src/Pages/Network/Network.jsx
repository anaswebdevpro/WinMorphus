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
import Accordian from "./Accordian";

/**
 * StatCard Component: Displays a single statistic card with a title, value, and icon.
 */
const StatCard = ({
  title,
  value,
  icon,
  gradient,
  border,
  iconBg,
  iconColor,
}) => (
  <div
    className={`bg-linear-to-br ${gradient} border-2 ${border} rounded-lg p-6 shadow-lg hover:shadow-xl transition-all relative overflow-hidden`}
  >
    <div className="absolute top-4 right-4">
      <div className={`${iconBg} p-3 rounded-lg`}>
        {React.cloneElement(icon, { className: `w-6 h-6 ${iconColor}` })}
      </div>
    </div>
    <div className="flex items-center gap-2 mb-2">
      {React.cloneElement(icon, { className: `w-5 h-5 ${iconColor}` })}
      <p className="text-sm font-medium opacity-90">{title}</p>
    </div>
    <h2 className="text-3xl font-bold text-white">{value}</h2>
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
                icon={<Users />}
                gradient="from-blue-900 to-slate-900"
                border="border-blue-500"
                iconBg="bg-blue-700/30"
                iconColor="text-blue-400"
              />
              <StatCard
                title="Total Team"
                value={networkStats.totalTeam}
                icon={<TrendingUp />}
                gradient="from-green-900 to-slate-900"
                border="border-green-500"
                iconBg="bg-green-700/30"
                iconColor="text-green-400"
              />
              <StatCard
                title="Active Team"
                value={networkStats.activeTeam}
                icon={<UserCheck />}
                gradient="from-yellow-900 to-slate-900"
                border="border-yellow-500"
                iconBg="bg-yellow-700/30"
                iconColor="text-yellow-400"
              />
              <StatCard
                title="Team Business"
                value={`$${networkStats.teamBusiness}`}
                icon={<DollarSign />}
                gradient="from-purple-900 to-slate-900"
                border="border-purple-500"
                iconBg="bg-purple-700/30"
                iconColor="text-purple-400"
              />
              <StatCard
                title="Total Investment"
                value={`$${networkStats.totalInvestment}`}
                icon={<Briefcase />}
                gradient="from-indigo-900 to-slate-900"
                border="border-indigo-500"
                iconBg="bg-indigo-700/30"
                iconColor="text-indigo-400"
              />
              <StatCard
                title="Active Investment"
                value={`$${networkStats.activeInvestment}`}
                icon={<Activity />}
                gradient="from-pink-900 to-slate-900"
                border="border-pink-500"
                iconBg="bg-pink-700/30"
                iconColor="text-pink-400"
              />
            </div>
          )}

          {/* <div>
            <NetworkTree networkData={networkData} />
          </div> */}

          <div>
            <Accordian networkData={networkData} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Network;
