import React, { useState, useEffect, useRef } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import {
  Users,
  TrendingUp,
  UserCheck,
  DollarSign,
  ZoomIn,
  ZoomOut,
  Briefcase,
  Activity,
} from "lucide-react";
import ShimmerLoader from "../../Component/ui/ShimmerLoader";
import { apiRequest } from "../../Services/Api";
import { MY_NETWORK, NETWORK_STATS } from "../../Api/Api_variables";
import { useAuth } from "../../Context/UseAuth";
import { enqueueSnackbar } from "notistack";

// Helper function to get member data from the tree
// Note: Member data is already included in each member object from the API

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
 * MemberNode Component: Renders a single member's information card within the organizational chart.
 */
const MemberNode = ({ member, onClick, isSelected }) => {
  if (!member) return null;

  return (
    <div
      className={`rounded-xl p-4 shadow-[0_4px_12px_rgba(255,215,0,0.2)] hover:shadow-[0_4px_16px_rgba(255,215,0,0.3)] transition-all duration-300 min-w-[220px]
        max-w-[280px] mx-auto cursor-pointer transform hover:scale-105 ${
          isSelected
            ? "bg-[#1E1E1E] border border-[#FFD700] ring-2 ring-[#FFD700] ring-opacity-30"
            : "bg-[#1E1E1E] border border-[#333] hover:border-[#FFD700]"
        }`}
      onClick={() => onClick?.(member)}
    >
      <div className="text-center text-white">
        <div className="font-bold text-[#FFD700] mb-2 text-lg">
          {member?.name || `Member ${member.id}`}
        </div>

        <div
          className="text-sm text-[#CCCCCC] mb-3 truncate"
          title={member.email}
        >
          {member.email}
        </div>
        <div className="flex justify-between text-xs text-[#CCCCCC] mb-3">
          <span className="font-medium">ID: {member.id}</span>
          <span className="font-medium">Level: {member.level}</span>
        </div>
        <div className="mb-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              member.current_package
                ? "bg-[#FFD700] text-black"
                : "bg-[#555] text-white"
            }`}
          >
            {member.current_package?.name || "No Package"}
          </span>
        </div>

        {/* Status Badge */}
        <div className="mb-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              member.is_active || member.status === "active"
                ? "bg-green-900 text-green-300"
                : "bg-red-900 text-red-300"
            }`}
          >
            {member.is_active || member.status === "active"
              ? "ACTIVE"
              : "INACTIVE"}
          </span>
        </div>

        {member && (
          <div className="text-xs text-[#AAAAAA] mb-2">
            Joined: {member.created_at}
          </div>
        )}
        {isSelected && (
          <div className="text-xs text-[#FFD700] font-bold mt-2 flex items-center justify-center gap-1">
            <span>←</span>
            <span>Selected Root</span>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * TreeNodeRenderer Component: Recursively renders the tree structure for the network.
 * It takes a list of members and renders them as tree nodes.
 */
const TreeNodeRenderer = ({
  members,
  onNodeClick,
  selectedMemberId,
  currentLevel,
  maxLevel,
  maxNodes,
  renderCountRef,
}) => {
  if (currentLevel > maxLevel || renderCountRef.current >= maxNodes)
    return null;

  if (!members || members.length === 0) return null;

  const renderedNodes = [];

  for (const member of members) {
    if (renderCountRef.current >= maxNodes) break;
    renderCountRef.current += 1;

    renderedNodes.push(
      <TreeNode
        key={member.id}
        label={
          <MemberNode
            member={member}
            onClick={onNodeClick}
            isSelected={selectedMemberId === member.id}
          />
        }
      >
        {/* This component is designed for a flat hierarchy and does not render further descendants recursively here. */}
      </TreeNode>
    );
  }

  return <>{renderedNodes}</>;
};

/**
 * Network Component: The main page for displaying the user's network tree and statistics.
 */
const Network = () => {
  // State for the currently selected member's ID to be displayed as the root of the tree
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  // State to manage loading status while fetching data
  const [isLoading, setIsLoading] = useState(true);
  // State to store the entire network data from the API
  const [networkData, setNetworkData] = useState(null);
  // State to store network statistics (directs, total team, etc.)
  const [networkStats, setNetworkStats] = useState(null);
  // State to control the zoom level of the network chart
  const [zoomLevel, setZoomLevel] = useState(1);
  const { token } = useAuth();

  const MAX_LEVEL = 5;
  const MAX_NODES = 15;
  const renderCountRef = useRef(0);

  const FetchNetwork = React.useCallback(() => {
    return apiRequest({
      endpoint: MY_NETWORK,
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (response.success === false) {
          enqueueSnackbar(response.message || "Failed to fetch network data!", {
            variant: "error",
          });
        } else {
          const networkResponse = response.data;
          setNetworkData(networkResponse || null);

          if (networkResponse?.team_tree?.[0]) {
            setSelectedMemberId(networkResponse.team_tree[0].id);
          }
        }
      })
      .catch((error) => {
        const errorMessage =
          error?.message ||
          error?.response?.data?.message ||
          "Failed to fetch network data";
        enqueueSnackbar(errorMessage, { variant: "error" });
      });
  }, [token]);
  const fetchStats = React.useCallback(() => {
    return apiRequest({
      endpoint: NETWORK_STATS,
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (response.success === false) {
          enqueueSnackbar(
            response.message || "Failed to fetch network stats!",
            {
              variant: "error",
            }
          );
        } else {
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
        }
      })
      .catch((error) => {
        const errorMessage =
          error?.message ||
          error?.response?.data?.message ||
          "Failed to fetch network stats";
        enqueueSnackbar(errorMessage, { variant: "error" });
      });
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([FetchNetwork(), fetchStats()]);
      setIsLoading(false);
    };
    fetchData();
  }, [FetchNetwork, fetchStats]);

  const selectedMember =
    networkData?.team_tree?.find((member) => member.id === selectedMemberId) ||
    null;

  // Handles clicks on a member node to set it as the new root
  const handleNodeClick = (member) => {
    setSelectedMemberId(member.id);
  };

  // Resets the view to the original root member
  const handleResetToRoot = () => {
    if (networkData?.team_tree?.[0]) {
      setSelectedMemberId(networkData.team_tree[0].id);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  //  * always appear after their parent in the array.
  //  */
  const getDescendants = (rootId) => {
    if (!networkData?.team_tree) return [];

    const rootIndex = networkData.team_tree.findIndex((m) => m.id === rootId);
    if (rootIndex === -1) return [];

    // Return all members that appear after the root member in the array.
    return networkData.team_tree.slice(rootIndex + 1);
  };

  // Get the descendants for the currently selected member
  const descendants = getDescendants(selectedMemberId);
  // Reset the render count before rendering the tree
  renderCountRef.current = selectedMember ? 1 : 0;

  if (isLoading) {
    return (
      <div className="p-6 bg-[#121212] min-h-screen text-white">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-2">
                Track your Network Members
              </h1>
              <p className="text-gray-400">
                Monitor and manage your network members effectively
              </p>
            </div>
          </div>
          <ShimmerLoader variant="dashboard" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 bg-[#121212] min-h-screen text-white">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-2">
                Track your Network Members
              </h1>
              <p className="text-gray-400">
                Monitor and manage your network members effectively
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleZoomIn}
                className="px-4 py-2 bg-[#FFD700] text-black rounded-lg hover:bg-[#e6c200] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                title="Zoom In"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={handleResetZoom}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                title="Reset Zoom"
              >
                100%
              </button>
              <button
                onClick={handleZoomOut}
                className="px-4 py-2 bg-[#FFD700] text-black rounded-lg hover:bg-[#e6c200] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                title="Zoom Out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button
                onClick={handleResetToRoot}
                className="px-6 py-2 bg-[#FFD700] text-black rounded-lg hover:bg-[#e6c200] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Reset to Root
              </button>
            </div>
          </div>

          {/* Statistics Grid */}
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

          <div className="bg-green-300/10 rounded-2xl shadow-yellow-800 shadow-lg p-6 overflow-auto relative">
            <div
              className="min-w-full transition-transform duration-200"
              style={{
                minHeight: "400px",
                transform: `scale(${zoomLevel})`,
                transformOrigin: "top center",
              }}
            >
              {networkData && networkData.team_tree?.length > 0 ? (
                <Tree
                  lineWidth="2px"
                  lineColor="#FFD700"
                  lineBorderRadius="10px"
                  label={
                    <MemberNode
                      member={selectedMember}
                      onClick={handleNodeClick}
                      isSelected={true}
                    />
                  }
                >
                  <TreeNodeRenderer
                    members={descendants}
                    onNodeClick={handleNodeClick}
                    selectedMemberId={selectedMemberId}
                    currentLevel={2}
                    maxLevel={MAX_LEVEL}
                    maxNodes={MAX_NODES}
                    renderCountRef={renderCountRef}
                  />
                </Tree>
              ) : (
                <div className="text-center py-12 text-[#CCCCCC]">
                  <div className="text-6xl mb-4">🌳</div>
                  <div className="text-xl font-semibold mb-2">
                    No Network Members
                  </div>
                  <div>This member has no descendants to display</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Network;
