import React from "react";
import { User, Lock, FileText, CreditCard } from "lucide-react";

const ProfileTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "profile", label: "Profile Info", icon: User },
    { id: "password", label: "Change Password", icon: Lock },
    { id: "kyc", label: "KYC Verification", icon: FileText },
    { id: "bank", label: "Bank Details", icon: CreditCard },
  ];

  return (
    <div className="border-b border-slate-700">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                isActive
                  ? "border-emerald-500 text-emerald-400"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-slate-600"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default ProfileTabs;
