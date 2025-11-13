import React from "react";
import { Award, TrendingUp } from "lucide-react";

const RankProgress = () => {
  // Dummy data
  const currentPoints = 50000;
  const goalPoints = 75000;
  const currentRank = "level 1";
  const nextRank = "Gold level 3";
  const pointsNeeded = goalPoints - currentPoints;
  const progress = (currentPoints / goalPoints) * 100;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-yellow-400" />
          You're at <span className="text-yellow-400 text-2xl">{currentRank}</span>
        </h3>
        <div className="flex gap-1">
          <span className="text-yellow-400 text-5xl">🏆</span>
          {/* <span className="text-yellow-400 text-3xl">🏆</span>
          <span className="text-yellow-400 text-3xl">🏆</span> */}
        </div>
      </div>

      {/* Points Display */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <div className="text-3xl font-bold text-blue-400">
           $ {currentPoints.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">You've Earned</div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-300">
           $ {goalPoints.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">Goal</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-3 bg-slate-700 rounded-full overflow-hidden mb-4">
        <div
          className="absolute top-0 left-0 h-full bg-linear-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
        </div>
      </div>

      {/* Rank Display */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-lg">
          <Award className="w-5 h-5 text-gray-400" />
          <span className="text-white font-medium">{currentRank}</span>
        </div>
        <div className="flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-lg">
          <span className="text-yellow-400 font-medium">{nextRank}</span>
          <Award className="w-5 h-5 text-yellow-400" />
        </div>
      </div>

      {/* Info Message */}
      <div className="flex items-start gap-2 bg-slate-700/30 border border-slate-600 rounded-lg p-3">
        <div className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center shrink-0 mt-0.5">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        </div>
        <p className="text-gray-300 text-sm">
          You need to earn{" "}
          <span className="font-bold text-yellow-400">
            {pointsNeeded.toLocaleString()} points
          </span>{" "}
          more to reach your goal.
        </p>
      </div>
    </div>
  );
};

export default RankProgress;
