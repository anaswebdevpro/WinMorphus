import React from "react";

/**
 * Reusable Card component for consistent layout
 * Dark theme with slate borders and backgrounds
 */
const Card = ({ children, className, title, subtitle, onClick }) => {
  return (
    <div
      className={`bg-slate-800 rounded-lg shadow-sm border border-slate-700 hover:border-slate-600 transition-all ${
        className || ""
      }`}
      onClick={onClick}
    >
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-slate-700 bg-slate-800/50">
          {title && (
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          )}
          {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
        </div>
      )}
      <div className="p-6 bg-slate-800/80">{children}</div>
    </div>
  );
};

export default Card;
