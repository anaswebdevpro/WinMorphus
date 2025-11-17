import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Users,
  DollarSign,
  Award,
  Calendar,
  Mail,
  User,
  Building,
  TrendingUp,
} from "lucide-react";

const Accordian = ({ networkData }) => {
  const [expandedLevels, setExpandedLevels] = useState({});

  console.log("Accordian networkData:", networkData);

  // Toggle level expansion
  const toggleLevel = (level) => {
    setExpandedLevels((prev) => ({
      ...prev,
      [level]: !prev[level],
    }));
  };

  // Get level color based on level number
  const getLevelColor = (level) => {
    const colors = {
      1: "border-emerald-500 bg-emerald-500/10 text-emerald-300",
      2: "border-blue-500 bg-blue-500/10 text-blue-300",
      3: "border-purple-500 bg-purple-500/10 text-purple-300",
      4: "border-orange-500 bg-orange-500/10 text-orange-300",
      5: "border-pink-500 bg-pink-500/10 text-pink-300",
      6: "border-cyan-500 bg-cyan-500/10 text-cyan-300",
      7: "border-yellow-500 bg-yellow-500/10 text-yellow-300",
      8: "border-red-500 bg-red-500/10 text-red-300",
      9: "border-violet-500 bg-violet-500/10 text-violet-300",
      10: "border-indigo-500 bg-indigo-500/10 text-indigo-300",
    };
    return colors[level] || "border-gray-500 bg-gray-500/10 text-gray-300";
  };

  // Get status color
  const getStatusColor = (isActive) => {
    return isActive
      ? "bg-green-500/20 text-green-300 border border-green-500/30"
      : "bg-red-500/20 text-red-300 border border-red-500/30";
  };

  // Render individual member card
  const MemberCard = ({ member }) => (
    <div className="bg-linear-to-r from-slate-800 to-slate-700 border border-slate-600 rounded-lg p-3 hover:from-slate-700 hover:to-slate-600 transition-all duration-300">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h4 className="font-bold text-white text-2xl">{member.name}</h4>
            <p className="text-gray-400 text-lg -mt-1">{member.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              member.is_active
            )}`}
          >
            {member.is_active ? "Active" : "Inactive"}
          </span>
          <div className="text-right">
            <p className="text-gray-400 text-sm">ID</p>
            <p className="text-white font-medium text-base">{member.id}</p>
          </div>
        </div>
      </div>

      {/* Main Content - Simplified Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-2">
        {/* Investment */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <DollarSign className="w-3 h-3 text-green-400" />
            <span className="text-green-400 font-medium text-sm">
              Investment
            </span>
          </div>
          <p className="text-white font-bold text-base">
            ${member.total_invested?.toLocaleString() || "0"}
          </p>
        </div>

        {/* Business */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="w-3 h-3 text-blue-400" />
            <span className="text-blue-400 font-medium text-sm">Business</span>
          </div>
          <p className="text-white font-bold text-base">
            ${member.total_business?.toLocaleString() || "0"}
          </p>
        </div>

        {/* Team */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Users className="w-3 h-3 text-purple-400" />
            <span className="text-purple-400 font-medium text-sm">Team</span>
          </div>
          <p className="text-white font-bold text-base">
            {member.team_size || 0}
          </p>
        </div>

        {/* Direct */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Users className="w-3 h-3 text-orange-400" />
            <span className="text-orange-400 font-medium text-sm">Direct</span>
          </div>
          <p className="text-white font-bold text-base">
            {member.direct_referrals || 0}
          </p>
        </div>

        {/* Package */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Building className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-medium text-base">
              Package
            </span>
          </div>
          <p className="text-white font-bold text-lg">
            {member.current_package?.name || "None"}
          </p>
        </div>

        {/* Package Amount */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <DollarSign className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-medium text-base">
              Amount
            </span>
          </div>
          <p className="text-white font-bold text-lg">
            ${member.current_package?.amount?.toLocaleString() || "0"}
          </p>
        </div>
      </div>

      {/* Bottom Row - Additional Details */}
      <div className="flex items-center justify-between text-base text-gray-400 pt-1 border-t border-slate-600">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>
              Joined: {new Date(member.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Award className="w-4 h-4" />
            <span>Code: {member.referral_code}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <User className="w-4 h-4" />
          <span>Sponsor: {member.sponsor_name}</span>
        </div>
      </div>
    </div>
  );

  if (!networkData || Object.keys(networkData).length === 0) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center">
        <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-300 mb-2">
          No Network Data
        </h3>
        <p className="text-gray-500">No network members found at this time.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {Object.entries(networkData)
        .sort(([a], [b]) => parseInt(a) - parseInt(b))
        .map(([level, members]) => (
          <div
            key={level}
            className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden"
          >
            {/* Level Header */}
            <div
              className={`p-4 cursor-pointer hover:bg-slate-700/50 transition-colors border-l-4 ${getLevelColor(
                level
              )}`}
              onClick={() => toggleLevel(level)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {expandedLevels[level] ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                    <h3 className="text-xl font-bold text-white">
                      Level {level}
                    </h3>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(
                      level
                    )}`}
                  >
                    {members.length}{" "}
                    {members.length === 1 ? "Member" : "Members"}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>
                      Active: {members.filter((m) => m.is_active).length}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span>
                      Total: $
                      {members
                        .reduce((sum, m) => sum + (m.total_invested || 0), 0)
                        .toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Level Content */}
            {expandedLevels[level] && (
              <div className="p-3 bg-slate-900/50 border-t border-slate-700">
                <div className="space-y-3">
                  {members.map((member) => (
                    <MemberCard key={member.id} member={member} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default Accordian;
