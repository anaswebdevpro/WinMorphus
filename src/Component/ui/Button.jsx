import React from "react";

/**
 * Reusable Button component with multiple variants and sizes
 * Dark theme with emerald primary and yellow accents
 */
const Button = ({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary:
      "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500",
    secondary:
      "bg-slate-700 text-white hover:bg-slate-600 focus:ring-slate-500",
    outline:
      "border border-slate-600 bg-transparent text-gray-300 hover:bg-slate-800 focus:ring-yellow-500",
    ghost: "text-gray-300 hover:bg-slate-800 focus:ring-slate-500",
  };

  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ""}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};

export default Button;
