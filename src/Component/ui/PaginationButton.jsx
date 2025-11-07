import React from "react";

/**
 * PaginationButton Component
 * A reusable button component for pagination controls
 *
 * @param {function} onClick - Click handler function
 * @param {boolean} disabled - Whether the button is disabled
 * @param {React.ReactNode} children - Button content (text, icons, etc.)
 * @param {boolean} isActive - Whether this is the currently active page
 * @param {string} variant - Optional variant ('default', 'primary', 'secondary')
 */
const PaginationButton = ({
  onClick,
  disabled,
  children,
  isActive,
  variant = "default",
}) => {
  const getVariantClasses = () => {
    if (isActive) {
      return "bg-blue-500 text-white border-blue-500";
    }

    switch (variant) {
      case "primary":
        return "bg-blue-600 text-white border-blue-600 hover:bg-blue-700";
      case "secondary":
        return "bg-slate-600 text-white border-slate-600 hover:bg-slate-700";
      default:
        return "border-slate-600 text-gray-300 hover:border-blue-500 hover:text-white";
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1 border rounded-md transition-colors ${getVariantClasses()} disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-600`}
    >
      {children}
    </button>
  );
};

export default PaginationButton;
