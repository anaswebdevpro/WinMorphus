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
      return "bg-(--accent-primary) text-(--text-primary) border-(--accent-primary)";
    }

    switch (variant) {
      case "primary":
        return "bg-(--accent-primary) text-(--text-primary) border-(--accent-primary) hover:bg-(--accent-hover)";
      case "secondary":
        return "bg-(--bg-secondary) text-(--text-primary) border-(--border-primary) hover:bg-(--bg-tertiary)";
      default:
        return "border-(--border-primary) text-(--text-secondary) hover:border-(--accent-primary) hover:text-(--text-primary)";
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
