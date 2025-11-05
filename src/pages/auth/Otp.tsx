/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { brand } from "@/constants/brand";
import { AuthContainer } from "@/components/AuthContainer";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useResendOtp } from "@/hooks/useAuth";
import { toast } from "react-hot-toast";

export const ResetPasswordOtp = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const navigate = useNavigate();
  const search = useSearch({ from: "/_auth/otp" });
  const email = search.email;

  const resendOtpMutation = useResendOtp();

  useEffect(() => {
    if (!email) {
      navigate({ to: "/forgetpassword" });
      return;
    }

    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    // Navigate to reset password with email and OTP
    navigate({
      to: "/resetpassword",
      search: { email: email!, otp: otpCode },
    });
  };

  const handleResend = async () => {
    try {
      await resendOtpMutation.mutateAsync({
        email: email!,
        type: "reset",
      });

      setCanResend(false);
      setResendTimer(60);
      toast.success("New reset code sent to your email");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to resend code. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleBack = () => {
    navigate({ to: "/forgetpassword" });
  };

  const isComplete = otp.every((digit) => digit !== "");

  if (!email) {
    return null;
  }

  return (
    <AuthContainer title="Check your" subtitle="email">
      <div className="text-center mb-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2"
        >
          Enter Reset Code
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-slate-600 dark:text-slate-400"
        >
          We've sent a 6-digit reset code to <strong>{email}</strong>
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="relative"
      >
        {/* Glassmorphism background */}
        <div className="absolute inset-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-2xl" />

        {/* Gradient border effect */}
        <div
          className="absolute inset-0 rounded-3xl p-[2px]"
          style={{
            background: `linear-gradient(135deg, ${brand.colors.primary}40, transparent, ${brand.colors.accent}40, transparent, ${brand.colors.secondary}40)`,
          }}
        >
          <div className="w-full h-full bg-white/90 dark:bg-slate-800/90 rounded-3xl" />
        </div>

        <div className="relative z-10 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* OTP Input */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center space-x-3"
            >
              {otp.map((digit, index) => (
                <motion.input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-14 h-14 text-center text-2xl font-bold bg-white/80 dark:bg-slate-700/80 border-2 border-slate-200/50 dark:border-slate-600/50 rounded-xl focus:outline-none focus:border-opacity-100 transition-all duration-300 text-slate-800 dark:text-slate-200"
                  style={{
                    borderColor: digit
                      ? brand.colors.primary
                      : `${brand.colors.primary}30`,
                    boxShadow: digit
                      ? `0 4px 20px ${brand.colors.primary}20`
                      : `0 4px 20px ${brand.colors.primary}10`,
                  }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileFocus={{ scale: 1.05 }}
                />
              ))}
            </motion.div>

            {/* Verify button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              type="submit"
              disabled={!isComplete}
              className="w-full py-4 px-6 rounded-2xl font-bold text-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              style={{
                background: isComplete
                  ? `linear-gradient(135deg, ${brand.colors.primary}, ${brand.colors.primary}dd)`
                  : `linear-gradient(135deg, ${brand.colors.primary}60, ${brand.colors.primary}40)`,
                boxShadow: isComplete
                  ? `0 10px 30px ${brand.colors.primary}40`
                  : `0 10px 30px ${brand.colors.primary}20`,
              }}
              whileHover={isComplete ? { scale: 1.02, y: -2 } : {}}
              whileTap={isComplete ? { scale: 0.98 } : {}}
            >
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: `linear-gradient(135deg, ${brand.colors.primary}dd, ${brand.colors.accent})`,
                }}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: isComplete ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />

              <span className="relative z-10 text-lg">
                Continue to Reset Password
              </span>
            </motion.button>
          </form>

          {/* Resend code */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-6"
          >
            {canResend ? (
              <motion.button
                onClick={handleResend}
                disabled={resendOtpMutation.isPending}
                className="inline-flex items-center space-x-2 text-sm font-semibold transition-all duration-200 disabled:opacity-50"
                style={{ color: brand.colors.secondary }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RotateCcw className="w-4 h-4" />
                <span>
                  {resendOtpMutation.isPending ? "Sending..." : "Resend Code"}
                </span>
              </motion.button>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Resend code in {resendTimer} seconds
              </p>
            )}
          </motion.div>

          {/* Back button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-center mt-6"
          >
            <motion.button
              onClick={handleBack}
              className="inline-flex items-center space-x-2 text-sm font-semibold transition-all duration-200"
              style={{ color: brand.colors.primary }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </AuthContainer>
  );
};
