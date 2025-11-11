import React from "react";
import { Gift, Lock } from "lucide-react";
import { PageHeader } from "../../Component/ui";

const Loyalty = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto p-6">
        <PageHeader
          title="Loyalty Allowance"
          description="Exclusive rewards and benefits for our loyal members"
        />

        {/* Coming Soon Section */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 bg-yellow-400/20 rounded-full flex items-center justify-center">
                  <Gift className="w-12 h-12 text-yellow-400" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center border-2 border-slate-800">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white mb-4">
              Coming Soon
            </h2>
            <p className="text-gray-400 text-lg mb-6">
              We're working on something special for our loyal members. Stay tuned for exclusive rewards and benefits!
            </p>

            <div className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400/10 border border-yellow-400/30 rounded-lg">
              <span className="text-yellow-400 font-semibold">
                This feature will be available soon
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loyalty;
