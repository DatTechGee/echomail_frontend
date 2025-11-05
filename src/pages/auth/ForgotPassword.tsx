/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";
import { brand } from "@/constants/brand";
import { AuthContainer } from "@/components/AuthContainer";
import { useNavigate } from "@tanstack/react-router";
import { useForgotPassword } from "@/hooks/useAuth";
import { toast } from "react-hot-toast";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const navigate = useNavigate();

  const forgotPasswordMutation = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await forgotPasswordMutation.mutateAsync({ email });

      if (response.data.status === 1) {
        setIsEmailSent(true);
        toast.success("Password reset code sent to your email");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to send reset code. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleBackToLogin = () => {
    navigate({ to: "/login" });
  };

  const handleProceedToOtp = () => {
    navigate({
      to: "/otp",
      search: { email },
    });
  };

  return (
    <AuthContainer title="Forgot your" subtitle="password?">
      <AnimatePresence mode="wait">
        {!isEmailSent ? (
          <motion.div
            key="forgot-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Form header */}
            <div className="text-center mb-8">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2"
              >
                Reset Password
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-slate-600 dark:text-slate-400"
              >
                Enter your email address and we'll send you a reset code
              </motion.p>
            </div>

            {/* Form container */}
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

              {/* Form content */}
              <div className="relative z-10 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email field */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-2"
                  >
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-slate-700/50 rounded-2xl blur-sm group-hover:blur-none transition-all duration-300" />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                        <Mail className="w-5 h-5 text-slate-400" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="relative w-full pl-12 pr-6 py-4 bg-white/80 dark:bg-slate-700/80 border-2 border-slate-200/50 dark:border-slate-600/50 rounded-2xl focus:outline-none focus:border-opacity-100 transition-all duration-300 placeholder:text-slate-400 text-slate-800 dark:text-slate-200 font-medium"
                        style={{
                          borderColor: `${brand.colors.primary}30`,
                          boxShadow: `0 4px 20px ${brand.colors.primary}10`,
                        }}
                        placeholder="Enter your email address"
                        required
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: email
                              ? brand.colors.accent
                              : "transparent",
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Submit button */}
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    type="submit"
                    disabled={forgotPasswordMutation.isPending}
                    className="w-full py-4 px-6 rounded-2xl font-bold text-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                    style={{
                      background: `linear-gradient(135deg, ${brand.colors.primary}, ${brand.colors.primary}dd)`,
                      boxShadow: `0 10px 30px ${brand.colors.primary}40`,
                    }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background: `linear-gradient(135deg, ${brand.colors.primary}dd, ${brand.colors.accent})`,
                      }}
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />

                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-2xl"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />

                    <div className="relative z-10 flex items-center justify-center space-x-2">
                      <AnimatePresence mode="wait">
                        {forgotPasswordMutation.isPending ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center space-x-3"
                          >
                            <motion.div
                              className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            />
                            <span className="text-lg">Sending...</span>
                          </motion.div>
                        ) : (
                          <motion.span
                            key="send"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-lg"
                          >
                            Send Reset Code
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.button>
                </form>

                {/* Back to login */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-center mt-8"
                >
                  <motion.button
                    onClick={handleBackToLogin}
                    className="inline-flex items-center space-x-2 text-sm font-semibold transition-all duration-200 relative"
                    style={{ color: brand.colors.primary }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Sign In</span>
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-current"
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="success-message"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${brand.colors.accent}20` }}
            >
              <Mail
                className="w-10 h-10"
                style={{ color: brand.colors.accent }}
              />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4"
            >
              Check your email
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-slate-600 dark:text-slate-400 mb-8"
            >
              We've sent a password reset code to <strong>{email}</strong>
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onClick={handleProceedToOtp}
              className="w-full py-3 px-6 mb-4 rounded-2xl font-bold text-white transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, ${brand.colors.primary}, ${brand.colors.primary}dd)`,
                boxShadow: `0 10px 30px ${brand.colors.primary}40`,
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Enter Reset Code
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              onClick={handleBackToLogin}
              className="inline-flex items-center space-x-2 text-sm font-semibold transition-all duration-200"
              style={{ color: brand.colors.primary }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sign In</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthContainer>
  );
};
