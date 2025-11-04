import React from "react";

/**
 * Reusable Input component with label and error support
 * Dark theme with slate/gray colors matching the app design
 */
const Input = ({ label, error, icon, className, ...props }) => {
  const baseClasses =
    "block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors";

  const iconClasses = icon ? "pl-10" : "";
  const errorClasses = error
    ? "border-red-600 focus:ring-red-500 focus:border-red-500"
    : "";

  const inputClasses = `${baseClasses} ${iconClasses} ${errorClasses} ${
    className || ""
  }`;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-400 mb-1">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input className={inputClasses} {...props} />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
