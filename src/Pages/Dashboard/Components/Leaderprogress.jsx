import React from "react";
import { Award, TrendingUp } from "lucide-react";

const Leaderprogress = ({ data }) => {
  // Current rank data

  return (
    <div className="bg-[var(--bg-card)] border-2 border-slate-600 rounded-xl p-6 shadow-lg">
      {/* Header */}
      <div className="text-center space-y-4">
        {/* <div className="flex justify-center">
          <TrendingUp className="w-12 h-12 text-yellow-400" />
        </div> */}
        <div className="space-y-2">
          <h3 className="text-2xl md:text-4xl  lg:text-4xl font-bold text-[var(--text-primary)]">
            You're{" "}
            <span className="text-3xl md:text5xl lg:text-5xl font-bold text-[var(--accent-primary)]">
              Leader
            </span>
          </h3>
        </div>
        {/* text display middle numbers   */}
        {/* Points Display */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="text-3xl font-bold text-blue-400">
              ${" "}
              {parseFloat(
                data?.threexincome?.total_income_receive || 0
              ).toFixed(2)}
            </div>
            <div className="text-sm text-[var(--text-secondary)]">
              You've Earned{" "}
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-[var(--text-primary)]">
              $ {parseFloat(data?.threexincome?.income || 0).toFixed(2)}
            </div>
            <div className="text-sm text-[var(--text-secondary)]">
              Total Income
            </div>
          </div>
        </div>

        {/* // info message about leader rank */}
        <div className="flex items-start gap-2 bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] rounded-lg p-3 my-5">
          <div className="w-5 h-5 rounded-full border-2 border-[var(--text-secondary)] flex items-center justify-center shrink-0 mt-0.5">
            <div className="w-2 h-2 bg-[var(--text-secondary)] rounded-full"></div>
          </div>
          <p className="text-[var(--text-primary)] text-lg">
            congratulations finally you became a{" "}
            <span className="font-bold text-[var(--accent-primary)]">
              {" "}
              Leader
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Leaderprogress;
