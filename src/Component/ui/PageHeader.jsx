import React from "react";

/**
 * Reusable Page Header Component
 * @param {string} title - Main heading text (displayed in yellow)
 * @param {string} description - Subtitle/description text (displayed in gray)
 * @param {string} className - Optional additional CSS classes
 */
const PageHeader = ({ title, description, className = "" }) => {
  return (
    <div className={`mb-8 ${className}`}>
      <h1 className="text-3xl sm:text-4xl font-bold text-(--accent-primary) mb-2">
        {title}
      </h1>
      {description && <p className="text-(--text-secondary)">{description}</p>}
    </div>
  );
};

export default PageHeader;
