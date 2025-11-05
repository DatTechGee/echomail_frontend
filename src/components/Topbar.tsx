import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, ChevronDown, Settings, LogOut } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { brand } from "@/constants/brand";
import { useLogout } from "@/hooks/useAuth";
import { getInitials, getFullName } from "@/utils/auth";
import { toast } from "react-hot-toast";

interface TopbarProps {
  onMenuToggle: () => void;
  isSidebarCollapsed: boolean;
}

export const Topbar = ({ onMenuToggle, isSidebarCollapsed }: TopbarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const logoutMutation = useLogout();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      setShowProfileMenu(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast.success("Logged out successfully");
    } catch {
      toast.error("Failed to logout. Please try again.");
    }
  };

  const userInitials = getInitials();
  const userFullName = getFullName();

  return (
    <motion.header
      className={`sticky top-0 right-0 z-50 h-16 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-sm border-b border-slate-200/50 dark:border-slate-700/50"
          : "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50"
      }`}
      style={{
        marginLeft:
          typeof window !== "undefined" && window.innerWidth >= 1024
            ? isSidebarCollapsed
              ? 80
              : 280
            : 0,
      }}
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `linear-gradient(90deg, ${brand.colors.primary}05, transparent, ${brand.colors.accent}05)`,
        }}
      />

      <div className="relative h-full flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onMenuToggle();
            }}
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="w-5 h-5" />
          </motion.button>

          <div className="relative">
            <motion.div
              initial={{ width: 250 }}
              whileFocus={{ width: 350 }}
              className="relative hidden sm:block"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search campaigns, contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                style={
                  {
                    "--tw-ring-color": `${brand.colors.primary}50`,
                  } as React.CSSProperties
                }
              />
            </motion.div>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <motion.button
            className="sm:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Search className="w-5 h-5" />
          </motion.button>

          <div className="relative">
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                setShowProfileMenu(!showProfileMenu);
              }}
              className="flex items-center space-x-3 p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                style={{
                  background: `linear-gradient(135deg, ${brand.colors.primary}, ${brand.colors.accent})`,
                }}
              >
                {userInitials || "AD"}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  {userFullName || "Admin User"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Administrator
                </p>
              </div>
              <ChevronDown className="w-4 h-4 hidden sm:block" />
            </motion.button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-xl overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-2">
                    <Link to="/settings" className="block">
                      <motion.div
                        className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-all duration-200"
                        whileHover={{ x: 4 }}
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">Settings</span>
                      </motion.div>
                    </Link>
                    <hr className="my-2 border-slate-200/50 dark:border-slate-700/50" />
                    <motion.button
                      onClick={handleSignOut}
                      disabled={logoutMutation.isPending}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 disabled:opacity-50"
                      whileHover={{ x: 4 }}
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">
                        {logoutMutation.isPending
                          ? "Signing Out..."
                          : "Sign Out"}
                      </span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
};
