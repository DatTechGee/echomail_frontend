/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Check,
  ArrowRight,
  Users,
  Zap,
  TrendingUp,
  Phone,
} from "lucide-react";
import { brand } from "@/constants/brand";
import { SUBSCRIPTION_SOURCE_OPTIONS } from "@/constants/newsletter";
import { useSubscribeNewsletter } from "@/hooks/useNewsletter";
import { toast } from "react-hot-toast";
import type { SubscribeRequest, NewsletterSource } from "@/types/newsletter";
import { FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa";

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

  const handleWhatsAppClick = () => {
    const phoneNumber = "2347041137971";
    const message = encodeURIComponent(
      "Hi! I'm interested in joining Levelup Xperience community."
    );
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleFacebookClick = () => {
    window.open("https://www.facebook.com/share/16g9YULeFL/", "_blank");
  };

  const handleInstagramClick = () => {
    window.open(
      "https://www.instagram.com/levelupxperiences?igsh=dmNvNml3YjV6d3h2",
      "_blank"
    );
  };

  const features = [
    {
      icon: Users,
      title: "Vibrant Community",
      description:
        "Connect with talented freelancers, content creators, and learners from around the world",
    },
    {
      icon: Zap,
      title: "Skill Development",
      description:
        "Access exclusive workshops, resources, and learning opportunities to level up your skills",
    },
    {
      icon: TrendingUp,
      title: "Collaboration & Growth",
      description:
        "Find projects, collaborate with peers, and grow your career in a supportive environment",
    },
  ];

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50/30 to-green-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="w-full max-w-md text-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-2xl" />

            <div className="relative p-8 space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${brand.colors.accent}20` }}
              >
                <Check
                  className="w-10 h-10"
                  style={{ color: brand.colors.accent }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-3"
              >
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  You're on the waitlist!
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Welcome to Levelup Xperience! Check your email for
                  confirmation and be the first to know when we launch.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <div className="text-center">
                  <img
                    src={brand.logo}
                    alt={brand.projectName}
                    className="w-48 mx-auto object-contain mb-4"
                  />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Level up your journey with us
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Floating Social Media Buttons */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleWhatsAppClick}
            className="w-14 h-14 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full shadow-lg flex items-center justify-center transition-colors duration-300 group relative"
            aria-label="Chat on WhatsApp"
          >
            <FaWhatsapp className="w-7 h-7" />
            <div className="absolute right-full mr-3 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              WhatsApp
              <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45" />
            </div>
          </motion.button>

          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleFacebookClick}
            className="w-14 h-14 bg-[#1877F2] hover:bg-[#0c63d4] text-white rounded-full shadow-lg flex items-center justify-center transition-colors duration-300 group relative"
            aria-label="Follow us on Facebook"
          >
            <FaFacebook className="w-7 h-7" />
            <div className="absolute right-full mr-3 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              Facebook
              <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45" />
            </div>
          </motion.button>

          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleInstagramClick}
            className="w-14 h-14 bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] hover:opacity-90 text-white rounded-full shadow-lg flex items-center justify-center transition-opacity duration-300 group relative"
            aria-label="Follow us on Instagram"
          >
            <FaInstagram className="w-7 h-7" />
            <div className="absolute right-full mr-3 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              Instagram
              <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45" />
            </div>
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50/30 to-green-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full filter blur-3xl opacity-20"
          style={{ backgroundColor: brand.colors.primary }}
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -100, 50, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full filter blur-3xl opacity-15"
          style={{ backgroundColor: brand.colors.secondary }}
          animate={{
            x: [0, -80, 120, 0],
            y: [0, 100, -80, 0],
            scale: [0.8, 1.1, 0.9, 0.8],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-3"
            >
              <img
                src={brand.logo}
                alt={brand.projectName}
                className="w-56 object-contain"
              />
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
                Join the community where
                <br />
                <span style={{ color: brand.colors.primary }}>
                  talents thrive together
                </span>
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                Whether you're a freelancer, content creator, or eager to learn,
                Levelup Xperience is your platform to connect, collaborate, and
                grow.
              </p>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: `${brand.colors.primary}20` }}
                  >
                    <feature.icon
                      className="w-5 h-5"
                      style={{ color: brand.colors.primary }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex items-center space-x-2 text-slate-600 dark:text-slate-400"
            >
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 border-2 border-white dark:border-slate-800" />
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 border-2 border-white dark:border-slate-800" />
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 border-2 border-white dark:border-slate-800" />
              </div>
              <p className="text-sm font-medium">
                Join 500+ professionals already on the waitlist
              </p>
            </motion.div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full"
          >
            <div className="relative">
              {/* Glassmorphism background */}
              <div className="absolute inset-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-2xl" />

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
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-center mb-8"
                >
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                    Join the Waitlist
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    Be among the first to level up your journey
                  </p>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name Input */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="space-y-2"
                  >
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Full Name
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3.5 bg-white/80 dark:bg-slate-700/80 border-2 border-slate-200/50 dark:border-slate-600/50 rounded-2xl focus:outline-none focus:border-opacity-100 transition-all duration-300 placeholder:text-slate-400 text-slate-800 dark:text-slate-200 font-medium"
                        style={
                          {
                            borderColor: `${brand.colors.primary}30`,
                            "--tw-ring-color": `${brand.colors.primary}50`,
                          } as React.CSSProperties
                        }
                        placeholder="Enter your full name"
                      />
                    </div>
                  </motion.div>

                  {/* Email Input */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.75 }}
                    className="space-y-2"
                  >
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3.5 bg-white/80 dark:bg-slate-700/80 border-2 border-slate-200/50 dark:border-slate-600/50 rounded-2xl focus:outline-none focus:border-opacity-100 transition-all duration-300 placeholder:text-slate-400 text-slate-800 dark:text-slate-200 font-medium"
                        style={
                          {
                            borderColor: `${brand.colors.primary}30`,
                            "--tw-ring-color": `${brand.colors.primary}50`,
                          } as React.CSSProperties
                        }
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </motion.div>

                  {/* Phone Input */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="space-y-2"
                  >
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3.5 bg-white/80 dark:bg-slate-700/80 border-2 border-slate-200/50 dark:border-slate-600/50 rounded-2xl focus:outline-none focus:border-opacity-100 transition-all duration-300 placeholder:text-slate-400 text-slate-800 dark:text-slate-200 font-medium"
                        style={
                          {
                            borderColor: `${brand.colors.primary}30`,
                            "--tw-ring-color": `${brand.colors.primary}50`,
                          } as React.CSSProperties
                        }
                        placeholder="+234 800 123 4567"
                      />
                    </div>
                  </motion.div>

                  {/* Source Selection */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.85 }}
                    className="space-y-2"
                  >
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      How did you find us?{" "}
                      <span className="text-red-500">*</span>
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
                        className="w-full px-4 py-3.5 bg-white/80 dark:bg-slate-700/80 border-2 border-slate-200/50 dark:border-slate-600/50 rounded-2xl focus:outline-none focus:border-opacity-100 transition-all duration-300 text-slate-800 dark:text-slate-200 font-medium appearance-none cursor-pointer"
                        style={
                          {
                            borderColor: `${brand.colors.primary}30`,
                            "--tw-ring-color": `${brand.colors.primary}50`,
                          } as React.CSSProperties
                        }
                        required
                      >
                        {SUBSCRIPTION_SOURCE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
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
                  </motion.div>

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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    type="submit"
                    disabled={subscribeMutation.isPending}
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
                        background: `linear-gradient(135deg, ${brand.colors.primary}dd, ${brand.colors.secondary})`,
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
                            <span className="text-lg">Join the Waitlist</span>
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
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-center mt-6"
                >
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    By joining, you'll be among the first to access Levelup
                    Xperience when we launch. We respect your privacy and will
                    never share your information.
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Social Media Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleWhatsAppClick}
          className="w-14 h-14 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full shadow-lg flex items-center justify-center transition-colors duration-300 group relative"
          aria-label="Chat on WhatsApp"
        >
          <FaWhatsapp className="w-7 h-7" />
          <div className="absolute right-full mr-3 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            WhatsApp
            <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45" />
          </div>
        </motion.button>

        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.3, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleFacebookClick}
          className="w-14 h-14 bg-[#1877F2] hover:bg-[#0c63d4] text-white rounded-full shadow-lg flex items-center justify-center transition-colors duration-300 group relative"
          aria-label="Follow us on Facebook"
        >
          <FaFacebook className="w-7 h-7" />
          <div className="absolute right-full mr-3 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Facebook
            <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45" />
          </div>
        </motion.button>

        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.4, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleInstagramClick}
          className="w-14 h-14 bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] hover:opacity-90 text-white rounded-full shadow-lg flex items-center justify-center transition-opacity duration-300 group relative"
          aria-label="Follow us on Instagram"
        >
          <FaInstagram className="w-7 h-7" />
          <div className="absolute right-full mr-3 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Instagram
            <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45" />
          </div>
        </motion.button>
      </div>
    </div>
  );
};
