import React from "react";
import { Award, TrendingUp } from "lucide-react";

const Leaderprogress = ( { data } ) => {
  // Current rank data
 

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
      {/* Header */}
      <div className="text-center space-y-4">
        {/* <div className="flex justify-center">
          <TrendingUp className="w-12 h-12 text-yellow-400" />
        </div> */}
        <div className="space-y-2">
          <h3 className="text-2xl md:text-4xl  lg:text-4xl font-bold text-white">
            You're    <span className="text-3xl md:text5xl lg:text-5xl font-bold text-yellow-400">
            Leader
          </span>
          </h3>
         
        </div>
        {/* text display middle numbers   */}
         {/* Points Display */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <div className="text-3xl font-bold text-blue-400">
            $ {parseFloat(data?.threexincome?.total_income_receive || 0).toFixed(2)}
          </div>
          <div className="text-sm text-gray-400">You've Earned </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-300">
            $ {parseFloat(data?.threexincome?.income || 0).toFixed(2)}
          </div>
          <div className="text-sm text-gray-400">Total Income</div>
        </div>
      </div>

        {/* // info message about leader rank */}
        <div className="flex items-start gap-2 bg-slate-700/30 border border-slate-600 rounded-lg p-3 my-5">
          <div className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center shrink-0 mt-0.5">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          </div>
          <p className="text-gray-300 text-lg">
            congratulations finally you became a{" "}
            <span className="font-bold text-yellow-400"> Leader</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Leaderprogress;
