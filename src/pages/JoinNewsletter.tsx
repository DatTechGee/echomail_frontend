/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Check,
  ArrowRight,
  Users,
  Phone,
  Send,
  Lock,
  Home,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { brand } from "@/constants/brand";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SUBSCRIPTION_SOURCE_OPTIONS } from "@/constants/newsletter";
import { useSubscribeNewsletter } from "@/hooks/useNewsletter";
import { toast } from "react-hot-toast";
import type { SubscribeRequest, NewsletterSource } from "@/types/newsletter";

interface FormData {
  email: string;
  name?: string;
  phone?: string;
  source: NewsletterSource | "";
}

export const JoinNewsletter = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    name: "",
    phone: "",
    source: "",
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const subscribeMutation = useSubscribeNewsletter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.source) {
      setError("Please fill in all required fields");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      const subscribeData: SubscribeRequest = {
        email: formData.email,
        source: formData.source as NewsletterSource,
        ...(formData.name && { name: formData.name }),
        ...(formData.phone && { phone: formData.phone }),
      };

      const response = await subscribeMutation.mutateAsync(subscribeData);

      if (response.data.status === 1) {
        setIsSuccess(true);
        toast.success(response.data.message);
        setFormData({ email: "", name: "", phone: "", source: "" });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to join waitlist. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${brand.colors.primary}60, transparent)`,
            }}
          />
          <div
            className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full filter blur-3xl opacity-20"
            style={{ backgroundColor: brand.colors.primary }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full filter blur-3xl opacity-10"
            style={{ backgroundColor: brand.colors.accent }}
          />
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="w-full max-w-md text-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-800/50 shadow-2xl" />

              <div className="relative p-10 space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                  className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${brand.colors.primary}15` }}
                >
                  <motion.div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${brand.colors.primary}, ${brand.colors.accent})`,
                    }}
                  >
                    <Check className="w-6 h-6 text-white" />
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-3"
                >
                  <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
                    You're on the waitlist!
                  </h1>
<p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      Welcome to EchoMail! Check your email for
                      confirmation and be the first to access our email campaigns.
                    </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="pt-2"
                >
                  <img
                    src={brand.logo}
                    alt={brand.projectName}
                    className="w-44 mx-auto object-contain mb-3"
                  />
<p className="text-sm text-slate-500 dark:text-slate-400">
                      Experience EchoMail's features firsthand
                    </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55 }}
                  className="pt-2"
                >
                  <Link
                    to="/"
                    className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors duration-200"
                  >
                    <Home className="w-4 h-4" />
                    <span>Back to home</span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${brand.colors.primary}50, transparent)`,
          }}
        />

        <motion.div
          className="absolute -top-32 -left-32 w-[30rem] h-[30rem] rounded-full filter blur-3xl opacity-20"
          style={{ backgroundColor: brand.colors.primary }}
          animate={{
            x: [0, 60, -30, 0],
            y: [0, 40, -20, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 -right-40 w-[26rem] h-[26rem] rounded-full filter blur-3xl opacity-15"
          style={{ backgroundColor: brand.colors.accent }}
          animate={{
            x: [0, -60, 30, 0],
            y: [0, -30, 20, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 w-[24rem] h-[24rem] rounded-full filter blur-3xl opacity-10"
          style={{ backgroundColor: brand.colors.secondary }}
          animate={{ x: [0, 40, -40, 0], y: [0, -40, 20, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />

        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse at center, black 40%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 40%, transparent 75%)",
          }}
        />
      </div>

      {/* Navbar */}
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-20"
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/">
            <img
              src={brand.logo}
              alt={brand.projectName}
              className="w-44 object-contain"
            />
          </Link>
          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 border border-slate-300/70 dark:border-slate-700/70 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-200"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 border border-slate-300/70 dark:border-slate-700/70 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-200"
            >
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">Admin Login</span>
            </Link>
            <ThemeToggle />
          </div>
        </nav>
      </motion.header>

      <div className="relative z-10 flex items-center justify-center px-4 sm:px-6 pb-16 pt-6 lg:pt-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-lg"
        >
          <div className="relative">
            {/* Glow behind card */}
            <div
              className="absolute -inset-1 rounded-[2rem] blur-2xl opacity-30"
              style={{
                background: `linear-gradient(135deg, ${brand.colors.primary}, ${brand.colors.accent})`,
              }}
            />

            {/* Glassmorphism background */}
            <div className="relative bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl rounded-3xl border border-white/60 dark:border-slate-800/60 shadow-2xl overflow-hidden">
              {/* Top accent bar */}
              <div
                className="h-1.5 w-full"
                style={{
                  background: `linear-gradient(90deg, ${brand.colors.primary}, ${brand.colors.accent}, ${brand.colors.secondary})`,
                }}
              />

              <div className="p-8 sm:p-10">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">
                    Join the Newsletter
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    Be among the first to level up your journey
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Full Name
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 placeholder:text-slate-400 text-slate-800 dark:text-slate-200 font-medium"
                        style={
                          {
                            "--tw-ring-color": `${brand.colors.primary}40`,
                          } as React.CSSProperties
                        }
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 placeholder:text-slate-400 text-slate-800 dark:text-slate-200 font-medium"
                        style={
                          {
                            "--tw-ring-color": `${brand.colors.primary}40`,
                          } as React.CSSProperties
                        }
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone Input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 placeholder:text-slate-400 text-slate-800 dark:text-slate-200 font-medium"
                        style={
                          {
                            "--tw-ring-color": `${brand.colors.primary}40`,
                          } as React.CSSProperties
                        }
                        placeholder="+234 800 123 4567"
                      />
                    </div>
                  </div>

                  {/* Source Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      How did you find us? <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.source}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            source: e.target.value as NewsletterSource | "",
                          })
                        }
                        className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 text-slate-800 dark:text-slate-200 font-medium appearance-none cursor-pointer"
                        style={
                          {
                            "--tw-ring-color": `${brand.colors.primary}40`,
                          } as React.CSSProperties
                        }
                        required
                      >
                        {SUBSCRIPTION_SOURCE_OPTIONS.map((option) => (
                          <option
                            key={option.value}
                            value={option.value}
                            className="bg-white dark:bg-slate-800"
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg
                          className="w-5 h-5 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm"
                      >
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={subscribeMutation.isPending}
                    className="w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                    style={{
                      background: `linear-gradient(135deg, ${brand.colors.primary}, ${brand.colors.secondary})`,
                      boxShadow: `0 10px 30px ${brand.colors.primary}40`,
                    }}
                  >
                    {/* Button shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent rounded-xl"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />

                    <div className="relative z-10 flex items-center justify-center space-x-2">
                      <AnimatePresence mode="wait">
                        {subscribeMutation.isPending ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center space-x-3"
                          >
                            <motion.div
                              className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            />
                            <span className="text-lg">Joining...</span>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="subscribe"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center space-x-2"
                          >
                            <Send className="w-5 h-5" />
                            <span className="text-lg">Join the Newsletter</span>
                            <motion.div
                              whileHover={{ x: 5 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <ArrowRight className="w-5 h-5" />
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.button>
                </form>

                {/* Privacy Notice */}
                <div className="text-center mt-6">
<p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      By joining, you'll be among the first to access EchoMail when we launch. We respect your privacy and will
                      never share your information.
                    </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
