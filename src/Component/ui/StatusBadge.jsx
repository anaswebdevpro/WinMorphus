import React from "react";

/**
 * StatusBadge Component
 * A reusable status badge component with predefined color schemes for different status types
 *
 * @param {string} status - The status type (approved, pending, completed, failed, cancelled, processing, rejected)
 * @param {string} label - Optional custom label to display (defaults to capitalized status)
 * @param {string} variant - Optional variant for different color schemes (default, success, warning, error, info)
 */
const StatusBadge = ({ status, label, variant }) => {
  const statusConfig = {
    approved: { bg: "bg-green-100", text: "text-green-800" },
    pending: { bg: "bg-yellow-100", text: "text-yellow-800" },
    completed: { bg: "bg-blue-100", text: "text-blue-800" },
    failed: { bg: "bg-red-100", text: "text-red-800" },
    cancelled: { bg: "bg-gray-100", text: "text-gray-800" },
    processing: { bg: "bg-purple-100", text: "text-purple-800" },
    rejected: { bg: "bg-red-100", text: "text-red-800" },
    success: { bg: "bg-green-100", text: "text-green-800" },
    warning: { bg: "bg-yellow-100", text: "text-yellow-800" },
    error: { bg: "bg-red-100", text: "text-red-800" },
    info: { bg: "bg-blue-100", text: "text-blue-800" },
  };

  const config = statusConfig[variant || status] || statusConfig.pending;
  const displayLabel =
    label || status?.charAt(0).toUpperCase() + status?.slice(1);

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}
    >
      {displayLabel}
    </span>
  );
};

export default StatusBadge;
