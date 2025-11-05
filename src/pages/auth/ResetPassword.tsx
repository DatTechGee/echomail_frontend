/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Eye, EyeOff, Check } from "lucide-react";
import { brand } from "@/constants/brand";
import { AuthContainer } from "@/components/AuthContainer";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useResetPassword } from "@/hooks/useAuth";
import { toast } from "react-hot-toast";

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

export const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const search = useSearch({ from: "/_auth/resetpassword" });
  const email = search.email;
  const otp = search.otp;

  const resetPasswordMutation = useResetPassword();

  // Redirect if missing required data
  if (!email || !otp) {
    navigate({ to: "/forgetpassword" });
    return null;
  }

  const getPasswordStrength = (pwd: string): PasswordStrength => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return { score, label: "Weak", color: "#ef4444" };
    if (score <= 3) return { score, label: "Fair", color: "#f97316" };
    if (score <= 4) return { score, label: "Good", color: "#eab308" };
    return { score, label: "Strong", color: "#22c55e" };
  };

  const passwordStrength = getPasswordStrength(password);
  const passwordsMatch =
    password && confirmPassword && password === confirmPassword;

  const requirements = [
    { text: "At least 8 characters", met: password.length >= 8 },
    { text: "One uppercase letter", met: /[A-Z]/.test(password) },
    { text: "One lowercase letter", met: /[a-z]/.test(password) },
    { text: "One number", met: /[0-9]/.test(password) },
    { text: "One special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch || passwordStrength.score < 3) return;

    try {
      await resetPasswordMutation.mutateAsync({
        email: email!,
        otp: otp!,
        password,
        confirmPassword,
      });

      navigate({ to: "/login" });
      toast.success(
        "Password reset successful! Please sign in with your new password."
      );
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to reset password. Please try again.";
      toast.error(errorMessage);
    }
  };

  const canSubmit = passwordsMatch && passwordStrength.score >= 3;

  return (
    <AuthContainer title="Create a" subtitle="new password">
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
          Choose a strong password for your account
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-2"
            >
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                New Password
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-slate-700/50 rounded-2xl blur-sm group-hover:blur-none transition-all duration-300" />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                  <Lock className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="relative w-full pl-12 pr-14 py-4 bg-white/80 dark:bg-slate-700/80 border-2 border-slate-200/50 dark:border-slate-600/50 rounded-2xl focus:outline-none focus:border-opacity-100 transition-all duration-300 placeholder:text-slate-400 text-slate-800 dark:text-slate-200 font-medium"
                  style={{
                    borderColor: password
                      ? passwordStrength.score >= 3
                        ? brand.colors.accent
                        : brand.colors.secondary
                      : `${brand.colors.primary}30`,
                    boxShadow: `0 4px 20px ${brand.colors.primary}10`,
                  }}
                  placeholder="Enter new password"
                  required
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors z-10"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-slate-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-slate-500" />
                  )}
                </motion.button>
              </div>

              {/* Password strength indicator */}
              {password && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Password strength:
                    </span>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: passwordStrength.color }}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <motion.div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: passwordStrength.color,
                        width: `${(passwordStrength.score / 5) * 100}%`,
                      }}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(passwordStrength.score / 5) * 100}%`,
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Confirm Password field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-2"
            >
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Confirm Password
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-slate-700/50 rounded-2xl blur-sm group-hover:blur-none transition-all duration-300" />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                  <Lock className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="relative w-full pl-12 pr-14 py-4 bg-white/80 dark:bg-slate-700/80 border-2 border-slate-200/50 dark:border-slate-600/50 rounded-2xl focus:outline-none focus:border-opacity-100 transition-all duration-300 placeholder:text-slate-400 text-slate-800 dark:text-slate-200 font-medium"
                  style={{
                    borderColor: confirmPassword
                      ? passwordsMatch
                        ? brand.colors.accent
                        : "#ef4444"
                      : `${brand.colors.primary}30`,
                    boxShadow: `0 4px 20px ${brand.colors.primary}10`,
                  }}
                  placeholder="Confirm your password"
                  required
                />
                <motion.button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors z-10"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5 text-slate-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-slate-500" />
                  )}
                </motion.button>
              </div>

              {/* Password match indicator */}
              {confirmPassword && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-2 mt-2"
                >
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: passwordsMatch
                        ? brand.colors.accent
                        : "#ef4444",
                    }}
                  >
                    {passwordsMatch && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span
                    className="text-sm"
                    style={{
                      color: passwordsMatch ? brand.colors.accent : "#ef4444",
                    }}
                  >
                    {passwordsMatch
                      ? "Passwords match"
                      : "Passwords don't match"}
                  </span>
                </motion.div>
              )}
            </motion.div>

            {/* Password requirements */}
            {password && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-2"
              >
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Password requirements:
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {requirements.map((req, index) => (
                    <motion.div
                      key={req.text}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center space-x-2"
                    >
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: req.met
                            ? brand.colors.accent
                            : "#e2e8f0",
                        }}
                      >
                        {req.met && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span
                        className="text-sm"
                        style={{
                          color: req.met ? brand.colors.accent : "#64748b",
                        }}
                      >
                        {req.text}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Reset button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              type="submit"
              disabled={resetPasswordMutation.isPending || !canSubmit}
              className="w-full py-4 px-6 rounded-2xl font-bold text-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              style={{
                background: canSubmit
                  ? `linear-gradient(135deg, ${brand.colors.primary}, ${brand.colors.primary}dd)`
                  : `linear-gradient(135deg, ${brand.colors.primary}60, ${brand.colors.primary}40)`,
                boxShadow: canSubmit
                  ? `0 10px 30px ${brand.colors.primary}40`
                  : `0 10px 30px ${brand.colors.primary}20`,
              }}
              whileHover={canSubmit ? { scale: 1.02, y: -2 } : {}}
              whileTap={canSubmit ? { scale: 0.98 } : {}}
            >
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: `linear-gradient(135deg, ${brand.colors.primary}dd, ${brand.colors.accent})`,
                }}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: canSubmit ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />

              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-2xl"
                initial={{ x: "-100%" }}
                whileHover={{ x: canSubmit ? "100%" : "-100%" }}
                transition={{ duration: 0.6 }}
              />

              <div className="relative z-10 flex items-center justify-center space-x-2">
                <AnimatePresence mode="wait">
                  {resetPasswordMutation.isPending ? (
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
                      <span className="text-lg">Updating...</span>
                    </motion.div>
                  ) : (
                    <motion.span
                      key="reset"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-lg"
                    >
                      Reset Password
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          </form>
        </div>
      </motion.div>
    </AuthContainer>
  );
};
