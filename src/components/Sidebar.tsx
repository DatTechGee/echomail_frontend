import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Mail,
  Users,
  FileText,
  Settings,
  ChevronLeft,
  LogOut,
  X,
  LayoutTemplate,
  BarChart3,
  Zap,
} from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import { brand } from "@/constants/brand";
import { useLogout } from "@/hooks/useAuth";
import { toast } from "react-hot-toast";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: number;
}

const navigationItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    href: "/analytics",
  },
  {
    id: "campaigns",
    label: "Campaigns",
    icon: Mail,
    href: "/campaigns",
  },
  {
    id: "templates",
    label: "Templates",
    icon: LayoutTemplate,
    href: "/templates",
  },
  {
    id: "contacts",
    label: "Contacts",
    icon: Users,
    href: "/contacts",
  },
  {
    id: "automations",
    label: "Automations",
    icon: Zap,
    href: "/automations",
  },
  {
    id: "WaitLists",
    label: "WaitLists Subscriber",
    icon: FileText,
    href: "/newsletters",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar = ({
  isCollapsed,
  onToggle,
  isMobileOpen = false,
  onMobileClose,
}: SidebarProps) => {
  const location = useLocation();
  const logoutMutation = useLogout();

  // Get active item from current pathname
  const getActiveItem = () => {
    const pathname = location.pathname;
    const activeItem = navigationItems.find((item) =>
      pathname.startsWith(item.href)
    );
    return activeItem?.id || "dashboard";
  };

  const activeItem = getActiveItem();

  const handleSignOut = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast.success("Logged out successfully");
    } catch {
      toast.error("Failed to logout. Please try again.");
    }
  };

  const handleMobileNavClick = () => {
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onMobileClose}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="fixed left-0 top-0 z-50 w-280 h-screen bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 lg:hidden"
          >
            {/* Gradient border effect */}
            <div
              className="absolute inset-0 opacity-50"
              style={{
                background: `linear-gradient(180deg, ${brand.colors.primary}05, transparent, ${brand.colors.accent}05)`,
              }}
            />

            <div className="relative h-full flex flex-col">
              {/* Mobile Header */}
              <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center space-x-3">
                  <img
                    src={brand.logo}
                    alt={brand.projectName}
                    className="w-40 object-contain"
                  />
                </div>
                <motion.button
                  onClick={onMobileClose}
                  className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.id}
                    to={item.href}
                    className="block"
                    onClick={handleMobileNavClick}
                  >
                    <motion.div
                      className={`w-[300px] flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden cursor-pointer ${
                        activeItem === item.id
                          ? "text-white shadow-lg"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
                      }`}
                      style={{
                        backgroundColor:
                          activeItem === item.id
                            ? brand.colors.primary
                            : "transparent",
                        boxShadow:
                          activeItem === item.id
                            ? `0 8px 25px ${brand.colors.primary}25`
                            : "none",
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Active background animation */}
                      {activeItem === item.id && (
                        <motion.div
                          layoutId="mobileActiveBackground"
                          className="absolute inset-0 rounded-xl"
                          style={{
                            background: `linear-gradient(135deg, ${brand.colors.primary}, ${brand.colors.primary}dd)`,
                          }}
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}

                      <div className="relative z-10 flex items-center space-x-3 w-full">
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium">{item.label}</span>
                        {item.badge && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="px-2 py-1 text-xs rounded-full font-semibold ml-auto"
                            style={{
                              backgroundColor:
                                activeItem === item.id
                                  ? "rgba(255,255,255,0.2)"
                                  : brand.colors.secondary,
                              color: "white",
                            }}
                          >
                            {item.badge}
                          </motion.span>
                        )}
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </nav>

              {/* Mobile Sign Out */}
              <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50">
                <motion.button
                  onClick={handleSignOut}
                  disabled={logoutMutation.isPending}
                  className="w-full flex items-center space-x-3 p-3 rounded-xl text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">
                    {logoutMutation.isPending ? "Signing Out..." : "Sign Out"}
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? 80 : 280,
        }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className="fixed left-0 top-0 z-40 h-screen bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 hidden lg:block"
      >
        {/* Gradient border effect */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background: `linear-gradient(180deg, ${brand.colors.primary}05, transparent, ${brand.colors.accent}05)`,
          }}
        />

        <div className="relative h-full flex flex-col">
          {/* Logo Section */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200/50 dark:border-slate-700/50">
            <AnimatePresence mode="wait">
              {!isCollapsed ? (
                <motion.div
                  key="full-logo"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center space-x-3"
                >
                  <img
                    src={brand.logo}
                    alt={brand.projectName}
                    className="w-40 object-contain"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="collapsed-logo"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="mx-auto"
                >
                  <img
                    src={brand.logo}
                    alt={brand.projectName}
                    className="w-8 h-8 object-contain"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => (
              <Link key={item.id} to={item.href} className="block">
                <motion.div
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden cursor-pointer ${
                    activeItem === item.id
                      ? "text-white shadow-lg"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
                  }`}
                  style={{
                    backgroundColor:
                      activeItem === item.id
                        ? brand.colors.primary
                        : "transparent",
                    boxShadow:
                      activeItem === item.id
                        ? `0 8px 25px ${brand.colors.primary}25`
                        : "none",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Active background animation */}
                  {activeItem === item.id && (
                    <motion.div
                      layoutId="activeBackground"
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: `linear-gradient(135deg, ${brand.colors.primary}, ${brand.colors.primary}dd)`,
                      }}
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}

                  <div className="relative z-10 flex items-center space-x-3 w-full">
                    <item.icon className="w-5 h-5 flex-shrink-0" />

                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center justify-between w-full"
                        >
                          <span className="font-medium">{item.label}</span>
                          {item.badge && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="px-2 py-1 text-xs rounded-full font-semibold"
                              style={{
                                backgroundColor:
                                  activeItem === item.id
                                    ? "rgba(255,255,255,0.2)"
                                    : brand.colors.secondary,
                                color: "white",
                              }}
                            >
                              {item.badge}
                            </motion.span>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </Link>
            ))}
          </nav>

          {/* Collapse Toggle */}
          <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50">
            <motion.button
              onClick={onToggle}
              className="w-full flex items-center justify-center p-3 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: isCollapsed ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.div>
            </motion.button>
          </div>

          {/* User Section */}
          <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50">
            <motion.button
              onClick={handleSignOut}
              disabled={logoutMutation.isPending}
              className="w-full flex items-center space-x-3 p-3 rounded-xl text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="font-medium"
                  >
                    {logoutMutation.isPending ? "Signing Out..." : "Sign Out"}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};
