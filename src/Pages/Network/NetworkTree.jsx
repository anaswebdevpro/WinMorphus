import React, { useState } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import { useAuth } from "../../Context/UseAuth";
import { NoData } from "../../assets";
import StatusBadge from "../../Component/ui/StatusBadge";

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
          <StatusBadge
            status={
              member.is_active || member.status === "active"
                ? "success"
                : "error"
            }
            label={
              member.is_active || member.status === "active"
                ? "ACTIVE"
                : "INACTIVE"
            }
          />
        </div>

        {member.created_at && (
          <div className="text-xs text-[#AAAAAA] mb-2">
            Joined: {member.created_at}
          </div>
        )}

        <div className="text-xs text-[#AAAAAA]">
          Team: {member.team_size || 0} | Business: $
          {member.total_business || 0}
        </div>

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
 */
const TreeNodeRenderer = ({
  member,
  onNodeClick,
  selectedMemberId,
  currentDepth = 1,
  maxDepth = 10,
}) => {
  if (!member) return null;

  // Prevent rendering beyond max depth
  if (currentDepth > maxDepth) {
    return null;
  }

  return (
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
      {member.children &&
        member.children.length > 0 &&
        member.children.map((child) => (
          <TreeNodeRenderer
            key={child.id}
            member={child}
            onNodeClick={onNodeClick}
            selectedMemberId={selectedMemberId}
            currentDepth={currentDepth + 1}
            maxDepth={maxDepth}
          />
        ))}
    </TreeNode>
  );
};

const NetworkTree = ({ networkData }) => {
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [rootMemberId, setRootMemberId] = useState(null);
  const [networkTree, setNetworkTree] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [allMembersMap, setAllMembersMap] = useState({});
  const [maxLevels, setMaxLevels] = useState(5);
  const [maxNodesPerLevel, setMaxNodesPerLevel] = useState(5);
  const { user } = useAuth();
  // console.log("Logged-in User:", user);

  // Build hierarchical tree structure from level-wise data
  React.useEffect(() => {
    if (!user) {
      setNetworkTree(null);
      setAllMembersMap({});
      return;
    }

    // console.log("Logged-in User:", user);
    // console.log("Raw Network Data:", networkData);

    // Start with the logged-in user as the root
    const loggedInUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      level: "0",
      is_active: user.status === "active",
      status: user.status,
      current_package: user.current_package || null,
      created_at: user.created_at,
      team_size: user.team_size || 0,
      total_business: user.total_business || 0,
      sponsor_id: user.sponsor,
      sponsor_name: user.sponsor_name || null,
      referral_code: user.referral_code,
      direct_referrals: user.direct_referrals || 0,
      commission_earned: user.commission_earned || 0,
      active_investment: user.active_investment || 0,
      total_invested: user.total_invested || 0,
      children: [],
    };

    // Flatten the level-wise data into a single array (excluding level 0 since we have it from auth)
    const allMembers = [loggedInUser];

    if (networkData && Object.keys(networkData).length > 0) {
      Object.keys(networkData)
        .sort((a, b) => parseInt(a) - parseInt(b))
        .forEach((level) => {
          const levelNum = parseInt(level);

          // Only include levels up to maxLevels
          if (levelNum <= maxLevels && Array.isArray(networkData[level])) {
            // console.log(`Level ${level}:`, networkData[level]);

            // Limit number of nodes per level
            const limitedMembers = networkData[level].slice(
              0,
              maxNodesPerLevel
            );
            allMembers.push(...limitedMembers);

            if (networkData[level].length > maxNodesPerLevel) {
              console.warn(
                `Level ${level} has ${networkData[level].length} members, limiting to ${maxNodesPerLevel}`
              );
            }
          }
        });
    }

    // console.log("All Members (including logged-in user):", allMembers);

    // Create a map of members by ID for quick lookup
    const memberMap = {};
    allMembers.forEach((member) => {
      memberMap[member.id] = { ...member, children: [] };
    });

    // console.log("Member Map:", memberMap);

    // Build the tree by linking children to their sponsors based on sponsor_id === id
    allMembers.forEach((member) => {
      // Skip the root user (logged-in user)
      if (member.id === user.id) return;

      // If member has a sponsor_id, find the sponsor and add this member as a child
      if (member.sponsor_id && memberMap[member.sponsor_id]) {
        memberMap[member.sponsor_id].children.push(memberMap[member.id]);
      }
    });

    // console.log("Member Map with Children:", memberMap);

    setAllMembersMap(memberMap);

    // Set the logged-in user as root
    // console.log("Setting logged-in user as root:", memberMap[user.id]);
    setRootMemberId(user.id);
    setSelectedMemberId(user.id);
    setNetworkTree(memberMap[user.id]);
  }, [networkData, user, maxLevels, maxNodesPerLevel]);

  // Update tree when selected member changes
  React.useEffect(() => {
    if (selectedMemberId && allMembersMap[selectedMemberId]) {
      setNetworkTree(allMembersMap[selectedMemberId]);
    }
  }, [selectedMemberId, allMembersMap]);

  const handleNodeClick = (member) => {
    setSelectedMemberId(member.id);
  };

  const handleResetToRoot = () => {
    if (rootMemberId) {
      setSelectedMemberId(rootMemberId);
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

  if (!networkTree) {
    return (
      <div className="bg-green-300/10 rounded-2xl shadow-yellow-800 shadow-lg p-6">
        <div className="text-center py-12 text-[#CCCCCC]">
          <div className="mb-4">
            <img src={NoData} alt="No data" className="h-24 mx-auto mb-3" />
          </div>
          <div className="text-xl font-semibold mb-2">No Network Members</div>
          <div>No data available to display</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Control Panel */}
      <div className="mb-4 bg-slate-800 border border-slate-700 rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-4 justify-between">
          <div className="flex flex-wrap items-center gap-4">
            {/* Max Levels Input */}
            <div className="flex items-center gap-2">
              <label className="text-gray-300 text-sm font-medium whitespace-nowrap">
                Max Levels:
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={maxLevels}
                onChange={(e) =>
                  setMaxLevels(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-20 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>

            {/* Max Nodes Per Level Input */}
            <div className="flex items-center gap-2">
              <label className="text-gray-300 text-sm font-medium whitespace-nowrap">
                Max User:
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={maxNodesPerLevel}
                onChange={(e) =>
                  setMaxNodesPerLevel(
                    Math.max(1, parseInt(e.target.value) || 1)
                  )
                }
                className="w-20 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>

            {/* Current Stats */}
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetToRoot}
              className="px-4 py-2 bg-[#FFD700] text-black rounded-lg hover:bg-[#e6c200] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
              title="Reset to Root"
            >
              Reset
            </button>
            <button
              onClick={handleZoomIn}
              className="px-3 py-2 bg-[#FFD700] text-black rounded-lg hover:bg-[#e6c200] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
              title="Zoom In"
            >
              +
            </button>
            <button
              onClick={handleResetZoom}
              className="px-3 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
              title="Reset Zoom"
            >
              100%
            </button>
            <button
              onClick={handleZoomOut}
              className="px-3 py-2 bg-[#FFD700] text-black rounded-lg hover:bg-[#e6c200] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
              title="Zoom Out"
            >
              -
            </button>
          </div>
        </div>
      </div>

      {/* Tree Container */}
      <div className="bg-green-300/10 rounded-2xl shadow-yellow-800 shadow-lg p-6 overflow-auto relative">
        <div
          className="min-w-full transition-transform duration-200"
          style={{
            minHeight: "400px",
            transform: `scale(${zoomLevel})`,
            transformOrigin: "top center",
          }}
        >
          <Tree
            lineWidth="2px"
            lineColor="#FFD700"
            lineBorderRadius="10px"
            label={
              <MemberNode
                member={networkTree}
                onClick={handleNodeClick}
                isSelected={selectedMemberId === networkTree.id}
              />
            }
          >
            {networkTree.children.map((child) => (
              <TreeNodeRenderer
                key={child.id}
                member={child}
                onNodeClick={handleNodeClick}
                selectedMemberId={selectedMemberId}
                currentDepth={1}
                maxDepth={maxLevels}
              />
            ))}
          </Tree>
        </div>
      </div>
    </div>
  );
};

export default NetworkTree;
