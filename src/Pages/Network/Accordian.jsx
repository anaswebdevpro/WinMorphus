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
      1: "border-emerald-500 bg-emerald-500/10 text-emerald-600",
      2: "border-blue-500 bg-blue-500/10 text-blue-600",
      3: "border-purple-500 bg-purple-500/10 text-purple-600",
      4: "border-orange-500 bg-orange-500/10 text-orange-600",
      5: "border-pink-500 bg-pink-500/10 text-pink-600",
      6: "border-cyan-500 bg-cyan-500/10 text-cyan-600",
      7: "border-yellow-500 bg-yellow-500/10 text-yellow-600",
      8: "border-red-500 bg-red-500/10 text-red-600",
      9: "border-violet-500 bg-violet-500/10 text-violet-600",
      10: "border-indigo-500 bg-indigo-500/10 text-indigo-600",
    };
    return colors[level] || "border-gray-500 bg-gray-500/10 text-gray-600";
  };

  // Get status color
  const getStatusColor = (isActive) => {
    return isActive
      ? "bg-green-500/10 text-green-600 border border-green-500/30"
      : "bg-red-500/10 text-red-600 border border-red-500/30";
  };

  // Render individual member card
  const MemberCard = ({ member }) => (
    <div className="bg-[var(--bg-card)] border-2 border-[var(--border-secondary)] rounded-lg p-3 hover:border-blue-500 transition-all duration-300 shadow-sm">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20">
            <User className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <h4 className="font-bold text-[var(--text-primary)] text-2xl">
              {member.name}
            </h4>
            <p className="text-[var(--text-secondary)] text-lg -mt-1">
              {member.email}
            </p>
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
            <p className="text-[var(--text-secondary)] text-sm">ID</p>
            <p className="text-[var(--text-primary)] font-medium text-base">
              {member.id}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content - Simplified Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-2">
        {/* Investment */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <DollarSign className="w-3 h-3 text-green-500" />
            <span className="text-green-500 font-medium text-sm">
              Investment
            </span>
          </div>
          <p className="text-[var(--text-primary)] font-bold text-base">
            ${member.total_invested?.toLocaleString() || "0"}
          </p>
        </div>

        {/* Business */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="w-3 h-3 text-blue-500" />
            <span className="text-blue-500 font-medium text-sm">Business</span>
          </div>
          <p className="text-[var(--text-primary)] font-bold text-base">
            ${member.total_business?.toLocaleString() || "0"}
          </p>
        </div>

        {/* Team */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Users className="w-3 h-3 text-purple-500" />
            <span className="text-purple-500 font-medium text-sm">Team</span>
          </div>
          <p className="text-[var(--text-primary)] font-bold text-base">
            {member.team_size || 0}
          </p>
        </div>

        {/* Direct */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Users className="w-3 h-3 text-orange-500" />
            <span className="text-orange-500 font-medium text-sm">Direct</span>
          </div>
          <p className="text-[var(--text-primary)] font-bold text-base">
            {member.direct_referrals || 0}
          </p>
        </div>

        {/* Package */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Building className="w-4 h-4 text-[var(--accent-primary)]" />
            <span className="text-[var(--accent-primary)] font-medium text-base">
              Package
            </span>
          </div>
          <p className="text-[var(--text-primary)] font-bold text-lg">
            {member.current_package?.name || "None"}
          </p>
        </div>

        {/* Package Amount */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <DollarSign className="w-4 h-4 text-[var(--accent-primary)]" />
            <span className="text-[var(--accent-primary)] font-medium text-base">
              Amount
            </span>
          </div>
          <p className="text-[var(--text-primary)] font-bold text-lg">
            ${member.current_package?.amount?.toLocaleString() || "0"}
          </p>
        </div>
      </div>

      {/* Bottom Row - Additional Details */}
      <div className="flex items-center justify-between text-base text-[var(--text-secondary)] pt-1 border-t border-[var(--border-primary)]">
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
      <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg p-8 text-center">
        <Users className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-[var(--text-secondary)] mb-2">
          No Network Data
        </h3>
        <p className="text-[var(--text-muted)]">
          No network members found at this time.
        </p>
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
            className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg overflow-hidden"
          >
            {/* Level Header */}
            <div
              className={`p-4 cursor-pointer hover:bg-[var(--bg-tertiary)] transition-colors border-l-4 ${getLevelColor(
                level
              )}`}
              onClick={() => toggleLevel(level)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {expandedLevels[level] ? (
                      <ChevronDown className="w-5 h-5 text-[var(--text-muted)]" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
                    )}
                    <h3 className="text-xl font-bold text-[var(--text-primary)]">
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

                <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
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
              <div className="p-3 bg-[var(--bg-secondary)] border-t border-[var(--border-primary)]">
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
