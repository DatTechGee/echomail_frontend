/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { brand } from "@/constants/brand";
import { AuthContainer } from "@/components/AuthContainer";
import { Link, useNavigate } from "@tanstack/react-router";
import { useLogin } from "@/hooks/useAuth";
import { toast } from "react-hot-toast";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await loginMutation.mutateAsync({
        email,
        password,
        rememberMe,
      });

      if (response.data.status === 1) {
        // Check if 2FA is required
        if (
          "requires_2fa" in response.data.data &&
          response.data.data.requires_2fa
        ) {
          // Navigate to 2FA with email
          navigate({
            to: "/2fa",
            search: { email: response.data.data.email },
          });
          toast.success("Two-factor authentication code sent to your email");
        } else {
          // Direct login success, navigate to dashboard
          navigate({ to: "/dashboard" });
          toast.success("Login successful!");
        }
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <AuthContainer>
      {/* Form header */}
      <div className="text-center mb-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2"
        >
          Sign in
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-slate-600 dark:text-slate-400"
        >
          Access your dashboard and start creating amazing campaigns
        </motion.p>
      </div>

      {/* Enhanced form container */}
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
            {/* Email field with icon */}
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

            {/* Password field with icon */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-2"
            >
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Password
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
                    borderColor: `${brand.colors.primary}30`,
                    boxShadow: `0 4px 20px ${brand.colors.primary}10`,
                  }}
                  placeholder="Enter your password"
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
            </motion.div>

            {/* Enhanced Remember me & Forgot password */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-center justify-between py-2"
            >
              <label className="flex items-center space-x-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <motion.div
                    className="w-6 h-6 rounded-lg border-2 flex items-center justify-center"
                    style={{
                      borderColor: rememberMe
                        ? brand.colors.primary
                        : "#cbd5e1",
                      backgroundColor: rememberMe
                        ? brand.colors.primary
                        : "transparent",
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <AnimatePresence>
                      {rememberMe && (
                        <motion.svg
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 180 }}
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </motion.svg>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">
                  Remember me
                </span>
              </label>

              <motion.button
                type="button"
                className="text-sm font-semibold transition-all duration-200 relative overflow-hidden px-2 py-1 rounded-lg"
                style={{ color: brand.colors.primary }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/forgetpassword" className="relative z-10">
                  Forgot password?
                </Link>
                <motion.div
                  className="absolute inset-0 rounded-lg opacity-0"
                  style={{ backgroundColor: `${brand.colors.primary}10` }}
                  whileHover={{ opacity: 1 }}
                />
              </motion.button>
            </motion.div>

            {/* Enhanced sign in button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-4 px-6 rounded-2xl font-bold text-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              style={{
                background: `linear-gradient(135deg, ${brand.colors.primary}, ${brand.colors.primary}dd)`,
                boxShadow: `0 10px 30px ${brand.colors.primary}40`,
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Button background animation */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: `linear-gradient(135deg, ${brand.colors.primary}dd, ${brand.colors.accent})`,
                }}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />

              {/* Button shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-2xl"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />

              <div className="relative z-10 flex items-center justify-center space-x-2">
                <AnimatePresence mode="wait">
                  {loginMutation.isPending ? (
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
                      <span className="text-lg">Signing in...</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="signin"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center space-x-2"
                    >
                      <span className="text-lg">Sign in to Dashboard</span>
                      <motion.svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </motion.svg>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          </form>

          {/* Enhanced footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center mt-8 space-y-4"
          >
            <div className="flex items-center space-x-4 before:flex-1 before:h-px before:bg-slate-200 dark:before:bg-slate-700 after:flex-1 after:h-px after:bg-slate-200 dark:after:bg-slate-700">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                Need Help?
              </span>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Don't have access?{" "}
              <motion.button
                className="font-semibold transition-all duration-200 relative"
                style={{ color: brand.colors.secondary }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Administrator
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-current"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </AuthContainer>
  );
};
