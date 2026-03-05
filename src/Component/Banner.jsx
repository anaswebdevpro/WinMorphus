import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { apiRequest } from "../Services/Api";
import { GET_BANNER } from "../Api/Api_variables";

import { useAuth } from "../Context/UseAuth";

const Banner = () => {
  const { token } = useAuth();

  const [banner, setBanner] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const fetchBanner = () => {
    if (!token) return;

    try {
      apiRequest({
        endpoint: GET_BANNER,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          if (response.data && response.data.length > 0) {
            // Get the first active banner
            const activeBanner = response.data.find(
              (banner) => banner.status === "active",
            );
            if (activeBanner) {
              setBanner(activeBanner);
              setIsOpen(true);
            }
          }
        })
        .catch((error) => {
          console.error("Failed to fetch banner data:", error);
        });
    } catch (error) {
      console.error("Banner fetch error:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchBanner();
    }
  }, [token]);

  const closeBanner = () => {
    setIsOpen(false);
  };

  // Handle ESC key to close popup
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape" && isOpen) {
        closeBanner();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!banner || !isOpen) {
    return null;
  }

  return (
    <>
      {/* Modal Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={closeBanner}
      >
        {/* Modal Content */}
        <div
          className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={closeBanner}
            className="absolute top-4 right-4 z-10 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all"
            aria-label="Close banner"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Banner Image */}
          <div className="w-full">
            <img
              src={banner.image_url}
              alt={banner.title || "Promotion Banner"}
              className="w-full h-auto max-h-[80vh] object-auto"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Banner;
