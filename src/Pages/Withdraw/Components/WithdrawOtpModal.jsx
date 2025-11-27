import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { apiRequest } from "../../../Services/Api";
import {
  WITHDRAWAL_VERIFY_OTP,
  WITHDRAWAL_RESEND_OTP,
} from "../../../Api/Api_variables";
import { X, RefreshCw } from "lucide-react";
import { useAuth } from "../../../Context/UseAuth";

const WithdrawOtpModal = ({ open, onClose, requestId,  onVerified }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (open) setOtp("");
  }, [open]);

  if (!open) return null;

  const handleVerify = async () => {
    if (!/^[0-9]{6}$/.test(otp)) {
      enqueueSnackbar("Please enter a valid 6-digit OTP", {
        variant: "warning",
      });
      return;
    }
    // if (!requestId) {
    //   enqueueSnackbar("Missing request identifier", { variant: "error" });
    //   return;
    // }

    setBusy(true);
    try {
      const response = await apiRequest({
        endpoint: WITHDRAWAL_VERIFY_OTP,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        data: { request_id: requestId, otp },
      });
      if (
        response?.success ||
        response?.data?.status === "verified" ||
        response?.data?.verified
      ) {
        enqueueSnackbar("OTP verified successfully", { variant: "success" });
        onVerified && onVerified(response?.data);
      } else {
        enqueueSnackbar(
          response?.data?.message ||
            response?.message ||
            "OTP verification failed",
          { variant: "error" }
        );
      }
    } catch (err) {
      console.error("Verify OTP error", err);
      enqueueSnackbar(
        err?.response?.data?.message || err?.message || "Failed to verify OTP",
        { variant: "error" }
      );
    } finally {
      setBusy(false);
    }
  };

  const handleResend = async () => {
    if (!requestId) {
      enqueueSnackbar("Missing request identifier", { variant: "error" });
      return;
    }

    setResending(true);
    try {
      const response = await apiRequest({
        endpoint: WITHDRAWAL_RESEND_OTP,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        data: { request_id: requestId },
      });

      if (response?.success) {
        enqueueSnackbar("OTP resent successfully", { variant: "success" });
      } else {
        enqueueSnackbar(
          response?.data?.message ||
            response?.message ||
            "Failed to resend OTP",
          { variant: "error" }
        );
      }
    } catch (err) {
      console.error("Resend OTP error", err);
      enqueueSnackbar(
        err?.response?.data?.message || err?.message || "Failed to resend OTP",
        { variant: "error" }
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md p-6 bg-(--bg-card) border border-(--border-primary) rounded-lg shadow-xl">
        <button
          aria-label="Close"
          className="absolute right-3 top-3 text-(--text-secondary) hover:text-(--text-primary)"
          onClick={() => onClose && onClose()}
        >
          <X className="w-5 h-5" />
        </button>

        <h4 className="text-lg font-bold text-(--text-primary) mb-2">
          Verify OTP
        </h4>
        <p className="text-(--text-secondary) text-sm mb-4">
          Enter the 6-digit verification code we just sent to your phone or
          email.
        </p>

        <div className="mb-4">
          <input
            value={otp}
            onChange={(e) => {
              const v = e.target.value.replace(/[^0-9]/g, "");
              setOtp(v.slice(0, 6));
            }}
            maxLength={6}
            inputMode="numeric"
            placeholder="Enter 6-digit OTP"
            className="w-full px-4 py-3 text-(--text-primary) bg-(--input-bg) border-2 border-(--border-primary) rounded-lg text-center text-xl tracking-widest"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleVerify();
              }
            }}
          />
        </div>

        <div className="flex gap-3">
          <button
            className="flex-1 px-4 py-2 bg-(--accent-primary) hover:bg-(--accent-hover) text-(--bg-card) rounded-lg font-semibold"
            onClick={handleVerify}
            disabled={busy}
          >
            {busy ? (
              <div className="flex items-center gap-2 justify-center">
                <RefreshCw className="w-4 h-4 animate-spin" /> Verifying...
              </div>
            ) : (
              "Submit"
            )}
          </button>
          <button
            className="flex-1 px-4 py-2 border border-(--border-primary) bg-(--bg-secondary) rounded-lg text-(--text-primary) font-semibold"
            onClick={handleResend}
            disabled={resending}
          >
            {resending ? (
              <div className="flex items-center gap-2 justify-center">
                <RefreshCw className="w-4 h-4 animate-spin" /> Resending...
              </div>
            ) : (
              "Resend OTP"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawOtpModal;
