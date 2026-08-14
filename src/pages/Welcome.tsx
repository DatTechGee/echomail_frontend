import { motion } from "framer-motion";
import {
  Mail,
  ArrowRight,
  Users,
  Zap,
  TrendingUp,
  Phone,
  MapPin,
  Sparkles,
  Send,
  Lock,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { brand } from "@/constants/brand";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";

const features = [
  {
    icon: Mail,
    title: "Beautiful Templates",
    description:
      "Pre-designed email templates that look great on any device and drive higher engagement",
  },
  {
    icon: Zap,
    title: "Automated Workflows",
    description:
      "Set up drip campaigns, onboarding sequences, and nurture paths that run on autopilot",
  },
  {
    icon: TrendingUp,
    title: "Real-time Analytics",
    description:
      "Track opens, clicks, and subscriber growth with detailed reports to optimize your strategy",
  },
];

export const Welcome = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${brand.colors.primary}50, transparent)`,
          }}
        />

        {/* Animated gradient orbs */}
        <motion.div
          className="absolute -top-32 -left-32 w-[30rem] h-[30rem] rounded-full filter blur-3xl opacity-20"
          style={{ backgroundColor: brand.colors.primary }}
          animate={{
            x: [0, 60, -30, 0],
            y: [0, 40, -20, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 -right-40 w-[26rem] h-[26rem] rounded-full filter blur-3xl opacity-15"
          style={{ backgroundColor: brand.colors.accent }}
          animate={{
            x: [0, -60, 30, 0],
            y: [0, -30, 20, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 w-[24rem] h-[24rem] rounded-full filter blur-3xl opacity-10"
          style={{ backgroundColor: brand.colors.secondary }}
          animate={{
            x: [0, 40, -40, 0],
            y: [0, -40, 20, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Subtle grid overlay */}
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
          <img
            src={brand.logo}
            alt={brand.projectName}
            className="w-44 object-contain"
          />
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 border border-slate-300/70 dark:border-slate-700/70 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-200"
            >
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">Admin Login</span>
            </Link>
            <Link
              to="/join-newsletters"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-300 shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${brand.colors.primary}, ${brand.colors.secondary})`,
                boxShadow: `0 8px 24px ${brand.colors.primary}30`,
              }}
            >
              <span className="hidden sm:inline">Join the Newsletter</span>
              <span className="sm:hidden">Join</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </nav>
      </motion.header>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 lg:pt-16 pb-16">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            {/* Left Side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-9"
            >
              {/* Pill badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: `${brand.colors.primary}10`,
                  color: brand.colors.primary,
                  border: `1px solid ${brand.colors.primary}25`,
                }}
              >
                <Sparkles className="w-4 h-4" />
                <span>Now accepting newsletter members</span>
              </motion.div>

              {/* Headline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="space-y-5"
              >
<h1 className="text-4xl lg:text-6xl font-extrabold text-slate-800 dark:text-slate-100 leading-[1.1] tracking-tight">
  Send emails that get opened
</h1>
<p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
  Create, automate, and track beautiful newsletters that reach every inbox. Whether you're a business owner, creator, or marketer, EchoMail helps you engage your audience and grow your list.
</p>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="space-y-4"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ x: 6 }}
                    className="flex items-start space-x-4 group"
                  >
                    <div
                      className="p-2.5 rounded-xl flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                      style={{ backgroundColor: `${brand.colors.primary}15` }}
                    >
                      <feature.icon
                        className="w-5 h-5"
                        style={{ color: brand.colors.primary }}
                      />
                    </div>
                    <div className="pt-0.5">
                      <h3 className="font-bold text-slate-800 dark:text-slate-200">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
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
                transition={{ delay: 0.7 }}
                className="flex items-center space-x-4"
              >
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 border-[3px] border-slate-50 dark:border-slate-950 shadow" />
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 border-[3px] border-slate-50 dark:border-slate-950 shadow" />
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 border-[3px] border-slate-50 dark:border-slate-950 shadow" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                    Join 500+ subscribers
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    on our newsletter list
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Welcome visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full lg:justify-self-end lg:max-w-lg"
            >
              <div className="relative">
                {/* Glow behind card */}
                <div
                  className="absolute -inset-1 rounded-[2rem] blur-2xl opacity-30"
                  style={{
                    background: `linear-gradient(135deg, ${brand.colors.primary}, ${brand.colors.accent})`,
                  }}
                />

                <div className="relative bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl rounded-3xl border border-white/60 dark:border-slate-800/60 shadow-2xl overflow-hidden p-8 sm:p-10 text-center">
                  {/* Top accent bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1.5"
                    style={{
                      background: `linear-gradient(90deg, ${brand.colors.primary}, ${brand.colors.accent}, ${brand.colors.secondary})`,
                    }}
                  />

                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: 0.4,
                      type: "spring",
                      stiffness: 200,
                    }}
                    className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: `${brand.colors.primary}15` }}
                  >
                    <Mail className="w-10 h-10" style={{ color: brand.colors.primary }} />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 space-y-3"
                  >
                    <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
                      Stay in the loop
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      Get early access, exclusive tips, and community updates
                      delivered straight to your inbox.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8"
                  >
                    <Link
                      to="/join-newsletters"
                      className="inline-flex items-center justify-center space-x-2 w-full px-6 py-4 rounded-xl font-bold text-white transition-all duration-300 shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${brand.colors.primary}, ${brand.colors.secondary})`,
                        boxShadow: `0 10px 30px ${brand.colors.primary}40`,
                      }}
                    >
                      <Send className="w-5 h-5" />
                      <span>Join the Newsletter</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.75 }}
                    className="mt-6"
                  >
                    <Link
                      to="/login"
                      className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 border border-slate-300/70 dark:border-slate-700/70 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-200"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Admin Login</span>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* What We Do */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto mb-12 lg:mb-16"
          >
            <span
              className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
              style={{
                backgroundColor: `${brand.colors.primary}10`,
                color: brand.colors.primary,
                border: `1px solid ${brand.colors.primary}25`,
              }}
            >
              What We Do
            </span>
            <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-800 dark:text-slate-100 leading-tight tracking-tight mb-5">
              Everything you need to{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(120deg, ${brand.colors.primary}, ${brand.colors.accent})`,
                }}
              >
                grow together
              </span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              {brand.aboutUs}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.12, duration: 0.6 }}
                whileHover={{ y: -6 }}
                className="group relative bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl p-8 transition-all duration-300"
              >
                <div
                  className="absolute inset-x-0 top-0 h-1 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(90deg, ${brand.colors.primary}, ${brand.colors.accent})`,
                  }}
                />
                <div
                  className="p-3.5 rounded-2xl w-fit mb-6 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${brand.colors.primary}15` }}
                >
                  <feature.icon
                    className="w-7 h-7"
                    style={{ color: brand.colors.primary }}
                  />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-16 lg:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-[2rem] p-10 lg:p-16 text-center shadow-2xl"
            style={{
              background: `linear-gradient(135deg, ${brand.colors.primary}, ${brand.colors.secondary})`,
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{
                background: `linear-gradient(90deg, transparent, #fff, transparent)`,
              }}
            />
            <motion.div
              className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10 blur-3xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 12, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-white/10 blur-3xl"
              animate={{ scale: [1.1, 1, 1.1] }}
              transition={{ duration: 14, repeat: Infinity }}
            />

<div className="relative z-10 max-w-2xl mx-auto">
  <h2 className="text-3xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
    Ready to launch your next campaign?
  </h2>
  <p className="text-lg text-white/85 leading-relaxed mb-10">
    Create and send beautiful email campaigns that engage your audience and grow your list.
  </p>
  <div className="flex flex-col sm:flex-row gap-4 justify-center">
    <Link
      to="/login"
      className="inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-xl font-bold text-slate-800 bg-white hover:bg-slate-100 transition-all duration-300 shadow-lg"
    >
      <Lock className="w-5 h-5" />
      <span>EchoMail Admin</span>
    </Link>
    <Link
      to="/join-newsletters"
      className="inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-xl font-bold text-white border-2 border-white/60 hover:bg-white/10 transition-all duration-300"
    >
      <Send className="w-5 h-5" />
      <span>Get Started</span>
      <ArrowRight className="w-5 h-5" />
    </Link>
  </div>
        </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 border-t border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
            <div className="grid md:grid-cols-3 gap-8 items-start">
              {/* Brand + about */}
              <div className="space-y-3">
                <img
                  src={brand.logo}
                  alt={brand.projectName}
                  className="w-36 object-contain"
                />
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
                  {brand.aboutUs}
                </p>
              </div>

              {/* Contact */}
              <div className="space-y-3 md:justify-self-center">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Contact
                </h3>
                <div className="space-y-2.5">
                  <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400">
                    <Mail className="w-4 h-4" style={{ color: brand.colors.primary }} />
                    <a
                      href={`mailto:${brand.contact.email}`}
                      className="hover:underline"
                    >
                      {brand.contact.email}
                    </a>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400">
                    <Phone className="w-4 h-4" style={{ color: brand.colors.primary }} />
                    <span>{brand.contact.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400">
                    <MapPin className="w-4 h-4" style={{ color: brand.colors.primary }} />
                    <span>{brand.contact.address}</span>
                  </div>
                </div>
              </div>

              {/* Quick links */}
              <div className="space-y-3 md:justify-self-end">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Get Started
                </h3>
                <Link
                  to="/join-newsletters"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${brand.colors.primary}, ${brand.colors.secondary})`,
                    boxShadow: `0 8px 24px ${brand.colors.primary}30`,
                  }}
                >
                  <span>Join the Newsletter</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 border border-slate-300/70 dark:border-slate-700/70 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-200"
                >
                  <Lock className="w-4 h-4" />
                  <span>Admin Login</span>
                </Link>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                © {new Date().getFullYear()} {brand.projectName}. All rights
                reserved.
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Made with care for creators and learners everywhere
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
