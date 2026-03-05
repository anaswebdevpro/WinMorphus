import React, { useEffect, useState, useRef } from "react";
import { apiRequest } from "../Services/Api";
import { DASHBOARD_HIGHLIGHT } from "../Api/Api_variables";
import { useAuth } from "../Context/UseAuth";
import { useTheme } from "../Context/UseTheme";
import { ShimmerLoader } from "./ui";

// Responsive Marquee Highlight Bar
const Highlight = () => {
  const { token } = useAuth();
  const { isDark } = useTheme();
  // Use dummy text if API not available
  const [highlight, setHighlight] = useState("");
  const dummyText =
    "🚀 WinMorphus: Trade, Earn, Refer & Withdraw Instantly! Enjoy secure crypto investments, fast ROI payouts, and exclusive rewards. Join now and grow your network!";

  const marqueeRef = useRef(null);

  useEffect(() => {
    if (!token) return;
  
    apiRequest({
      endpoint: DASHBOARD_HIGHLIGHT,
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        // API returns { success: true, data: [ { content_heading: "..." } ] }
        console.log("Highlight API Response:", response);
        const arr = response?.data;
        if (Array.isArray(arr) && arr.length > 0 && arr[0].content_heading) {
          setHighlight(arr[0].content_heading);
        } else {
          setHighlight("");
        }
     
      })
      .catch(() => {

        setHighlight(dummyText);
        
      });
  }, [token]);

  // Marquee animation (CSS only, no JS loop)
  return (
    <div
      className={`w-full mx-auto  overflow-hidden bg-[var(--bg-card)]  py-2 px-0 flex items-center relative`}
      style={{ minHeight: "40px" }}
    >
      {       
       (
        <div
          ref={marqueeRef}
          className="whitespace-nowrap flex items-center w-full max-w-7xl mx-auto"
          style={{
            animation: "marquee 28s linear infinite",
            color: isDark ? "var(--accent-primary)" : "var(--accent-secondary)",
            fontWeight: 600,
            fontSize: "1.1rem",
          }}
        >
          <span className="mx-4">{highlight || dummyText}</span>
        </div>
      )}
      {/* Marquee animation keyframes */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

export default Highlight;
