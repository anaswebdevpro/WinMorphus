import React, { useEffect } from "react";
import { Award, TrendingUp } from "lucide-react";
import { apiRequest } from "../../../Services/Api";
import { DASHBOARD_RANKS, GET_BALANCE } from "../../../Api/Api_variables";
import { useAuth } from "../../../Context/UseAuth";
import { useSnackbar } from "notistack";

const RankProgress = () => {
  // Dummy data

  const [loading, setLoading] = React.useState(false);
  const { token } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [RankData, setRankData] = React.useState(null);

  const FetchRanks = () => {
    if (!token) return;

    try {
      setLoading(true);

      apiRequest({
        endpoint: DASHBOARD_RANKS,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          setRankData(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch balance data:", error);
          const errorMessage = error?.message || "Failed to fetch balance data";
          enqueueSnackbar(errorMessage, { variant: "error" });
          setLoading(false);
        });
    } catch (error) {
      enqueueSnackbar(error?.message, { variant: "error" });
    }
  };
  useEffect(() => {
    if (token) {
      FetchRanks();
    }
  }, []);

  if (loading || !RankData) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg animate-pulse h-48"></div>
    );
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-yellow-400" />
          You're at{" "}
          <span className="text-yellow-400 text-2xl">
            {" "}
            Rank {RankData?.current_rank || 0}
          </span>
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
            $ {RankData?.current_reward?.reward_amount || 0}
          </div>
          <div className="text-sm text-gray-400">You've Earned</div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-300">
            $ {RankData?.next_reward?.reward_amount || 0}
          </div>
          <div className="text-sm text-gray-400">Goal</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-3 bg-slate-700 rounded-full overflow-hidden mb-4">
        <div
          className="absolute top-0 left-0 h-full bg-linear-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
          style={{
            width: `${
              (RankData?.current_reward?.reward_amount /
                RankData?.next_reward?.reward_amount) *
                100 || 0
            }%`,
          }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
        </div>
      </div>

      {/* Rank Display */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-lg">
          <Award className="w-5 h-5 text-gray-400" />
          <span className="text-white font-medium">
            {" "}
            {`Rank ${RankData?.current_rank || 0}`}
          </span>
        </div>
        <div className="flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-lg">
          <span className="text-yellow-400 font-medium">{`Rank ${
            RankData?.next_rank || 0
          }`}</span>
          <Award className="w-5 h-5 text-yellow-400" />
        </div>
      </div>

      {/* Info Message */}
      {/* <div className="flex items-start gap-2 bg-slate-700/30 border border-slate-600 rounded-lg p-3">
        <div className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center shrink-0 mt-0.5">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        </div>
        <p className="text-gray-300 text-sm">
          You need to earn{" "}
          <span className="font-bold text-yellow-400">
           {RankData?.next_reward?.reward_amount - RankData?.current_reward?.reward_amount || 0} Dollars
          </span>{" "}
          more to reach your goal.
        </p>
      </div> */}
    </div>
  );
};

export default RankProgress;
