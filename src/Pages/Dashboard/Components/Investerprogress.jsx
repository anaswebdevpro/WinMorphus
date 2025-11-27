import React from "react";
import { Award, TrendingUp } from "lucide-react";

const Investerprogress = ({ data }) => {
  const currentRank = "Invester";

  return (
    <div className="bg-[var(--bg-card)] border-2 border-slate-600 rounded-xl p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-4xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <TrendingUp className="w-15 h-15 text-[var(--accent-primary)]" />
          You're{" "}
          <span className="text-[var(--accent-primary)] text-4xl">
            {currentRank}
          </span>
        </h3>
        {/* <div className="flex gap-1">
          <span className="text-yellow-400 text-2xl">🏆</span>
          <span className="text-yellow-400 text-2xl">⭐</span>
          <span className="text-yellow-400 text-2xl">⭐</span>
        </div> */}
      </div>

      {/* Points Display */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <div className="text-3xl font-bold text-blue-400">
            {data?.total_directs}
          </div>
          <div className="text-sm text-[var(--text-secondary)]">
            Direct Referrals
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-[var(--text-primary)]">
            $ {data?.total_business}
          </div>
          <div className="text-sm text-[var(--text-secondary)]">
            {" "}
            Required Business
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {/* <div className="relative w-full h-3 bg-slate-700 rounded-full overflow-hidden mb-4">
        <div
          className="absolute top-0 left-0 h-full bg-linear-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
        </div>
      </div> */}

      {/* Rank Display */}
      {/* <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-lg">
          <Award className="w-5 h-5 text-gray-400" />
          <span className="text-white font-medium">{currentRank}</span>
        </div>
        <div className="flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-lg">
          <span className="text-yellow-400 font-medium">{nextRank}</span>
          <Award className="w-5 h-5 text-yellow-400" />
        </div>
      </div> */}

      {/* Info Message */}
      <div className="flex items-start gap-2 bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] rounded-lg p-3 mb-10">
        <div className="w-5 h-5 rounded-full border-2 border-[var(--text-secondary)] flex items-center justify-center shrink-0 mt-0.5">
          <div className="w-2 h-2 bg-[var(--text-secondary)] rounded-full"></div>
        </div>
        <p className="text-[var(--text-primary)] text-lg">
          You need to earn{" "}
          <span className="font-bold text-[var(--accent-primary)]">
            {data?.total_directs} Direct Referrals
          </span>{" "}
          and
          <span className="font-bold text-[var(--accent-primary)]"></span>{" "}
          <span className="font-bold text-[var(--accent-primary)]">
            {data?.total_business + "$"} Business
          </span>{" "}
          Required to Become a Leader.
        </p>
      </div>
    </div>
  );
};

export default Investerprogress;
