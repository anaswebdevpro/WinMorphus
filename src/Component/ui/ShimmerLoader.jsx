import React from "react";
import ContentLoader from "react-content-loader";

const ShimmerLoader = ({ variant = "card", width, height, className = "" }) => {
  const renderShimmer = () => {
    switch (variant) {
      case "dashboard":
        return (
          <ContentLoader
            speed={2}
            width={width || 1200}
            height={height || 400}
            viewBox="0 0 1200 400"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
            className={className}
          >
            {/* Header */}
            <rect x="0" y="0" rx="8" ry="8" width="1200" height="60" />

            {/* Stats Cards */}
            <rect x="0" y="80" rx="8" ry="8" width="280" height="120" />
            <rect x="300" y="80" rx="8" ry="8" width="280" height="120" />
            <rect x="600" y="80" rx="8" ry="8" width="280" height="120" />
            <rect x="900" y="80" rx="8" ry="8" width="280" height="120" />

            {/* Chart Area */}
            <rect x="0" y="220" rx="8" ry="8" width="800" height="160" />

            {/* Recent Transactions */}
            <rect x="820" y="220" rx="8" ry="8" width="360" height="160" />
          </ContentLoader>
        );

      case "table":
        return (
          <ContentLoader
            speed={2}
            width={width || 1000}
            height={height || 400}
            viewBox="0 0 1000 400"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
            className={className}
          >
            {/* Table Header */}
            <rect x="0" y="0" rx="4" ry="4" width="1000" height="40" />

            {/* Table Rows */}
            <rect x="0" y="60" rx="4" ry="4" width="1000" height="30" />
            <rect x="0" y="110" rx="4" ry="4" width="1000" height="30" />
            <rect x="0" y="160" rx="4" ry="4" width="1000" height="30" />
            <rect x="0" y="210" rx="4" ry="4" width="1000" height="30" />
            <rect x="0" y="260" rx="4" ry="4" width="1000" height="30" />
            <rect x="0" y="310" rx="4" ry="4" width="1000" height="30" />
          </ContentLoader>
        );

      case "card":
        return (
          <ContentLoader
            speed={2}
            width={width || 300}
            height={height || 200}
            viewBox="0 0 300 200"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
            className={className}
          >
            <rect x="0" y="0" rx="8" ry="8" width="300" height="200" />
          </ContentLoader>
        );

      case "form":
        return (
          <ContentLoader
            speed={2}
            width={width || 400}
            height={height || 500}
            viewBox="0 0 400 500"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
            className={className}
          >
            {/* Form Title */}
            <rect x="0" y="0" rx="4" ry="4" width="200" height="24" />

            {/* Form Fields */}
            <rect x="0" y="50" rx="4" ry="4" width="400" height="40" />
            <rect x="0" y="110" rx="4" ry="4" width="400" height="40" />
            <rect x="0" y="170" rx="4" ry="4" width="400" height="40" />
            <rect x="0" y="230" rx="4" ry="4" width="400" height="40" />
            <rect x="0" y="290" rx="4" ry="4" width="400" height="40" />

            {/* Submit Button */}
            <rect x="0" y="360" rx="4" ry="4" width="120" height="40" />
          </ContentLoader>
        );

      case "chart":
        return (
          <ContentLoader
            speed={2}
            width={width || 400}
            height={height || 300}
            viewBox="0 0 400 300"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
            className={className}
          >
            {/* Chart Title */}
            <rect x="0" y="0" rx="4" ry="4" width="200" height="20" />

            {/* Chart Area */}
            <rect x="0" y="40" rx="4" ry="4" width="400" height="220" />

            {/* Legend */}
            <rect x="0" y="280" rx="4" ry="4" width="80" height="16" />
            <rect x="100" y="280" rx="4" ry="4" width="80" height="16" />
          </ContentLoader>
        );

      case "list":
        return (
          <ContentLoader
            speed={2}
            width={width || 400}
            height={height || 300}
            viewBox="0 0 400 300"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
            className={className}
          >
            {/* List Items */}
            <rect x="0" y="0" rx="4" ry="4" width="400" height="40" />
            <rect x="0" y="60" rx="4" ry="4" width="400" height="40" />
            <rect x="0" y="120" rx="4" ry="4" width="400" height="40" />
            <rect x="0" y="180" rx="4" ry="4" width="400" height="40" />
            <rect x="0" y="240" rx="4" ry="4" width="400" height="40" />
          </ContentLoader>
        );

      case "profile":
        return (
          <ContentLoader
            speed={2}
            width={width || 300}
            height={height || 400}
            viewBox="0 0 300 400"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
            className={className}
          >
            {/* Profile Picture */}
            <circle cx="150" cy="60" r="40" />

            {/* Name */}
            <rect x="50" y="120" rx="4" ry="4" width="200" height="20" />

            {/* Email */}
            <rect x="50" y="160" rx="4" ry="4" width="180" height="16" />

            {/* Profile Fields */}
            <rect x="20" y="200" rx="4" ry="4" width="260" height="30" />
            <rect x="20" y="250" rx="4" ry="4" width="260" height="30" />
            <rect x="20" y="300" rx="4" ry="4" width="260" height="30" />
            <rect x="20" y="350" rx="4" ry="4" width="260" height="30" />
          </ContentLoader>
        );

      default:
        return (
          <ContentLoader
            speed={2}
            width={width || 300}
            height={height || 200}
            viewBox="0 0 300 200"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
            className={className}
          >
            <rect x="0" y="0" rx="8" ry="8" width="300" height="200" />
          </ContentLoader>
        );
    }
  };

  return renderShimmer();
};

export default ShimmerLoader;
