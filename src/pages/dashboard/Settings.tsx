/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Lock,
  Shield,
  Eye,
  EyeOff,
  Check,
  X,
  Smartphone,
  Save,
  AlertCircle,
} from "lucide-react";
import { brand } from "@/constants/brand";
import { useAuthStore } from "@/stores/auth";
import {
  useUpdateProfile,
  useChangePassword,
  useToggleTwoFactor,
} from "@/hooks/useAuth";
import { toast } from "react-hot-toast";

interface ProfileData {
  firstName: string;
  lastName: string;
  phone: string;
  bio: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { user } = useAuthStore();

  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
  });

  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [showTwoFactorPassword, setShowTwoFactorPassword] = useState(false);
  const [twoFactorPassword, setTwoFactorPassword] = useState("");

  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const toggleTwoFactorMutation = useToggleTwoFactor();

  // Update local state when user data changes
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        phone: user.phone || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
  ];

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateProfileMutation.mutateAsync({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        bio: profileData.bio,
      });
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to update profile. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success("Password updated successfully! Please login again.");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to update password. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleTwoFactorToggle = async () => {
    if (!twoFactorPassword) {
      toast.error("Please enter your password to continue");
      return;
    }

    try {
      await toggleTwoFactorMutation.mutateAsync({
        isEnabled: !user?.two_factor_enabled,
        password: twoFactorPassword,
      });

      setTwoFactorPassword("");
      setShowTwoFactorPassword(false);
      toast.success(
        user?.two_factor_enabled
          ? "Two-factor authentication disabled"
          : "Two-factor authentication enabled"
      );
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to update two-factor authentication. Please try again.";
      toast.error(errorMessage);
    }
  };

  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { strength: "Weak", color: "#ef4444", width: "33%" };
    if (score <= 3) return { strength: "Fair", color: "#f97316", width: "66%" };
    return { strength: "Strong", color: "#22c55e", width: "100%" };
  };

  const passwordStrength = getPasswordStrength(passwordData.newPassword);
  const passwordsMatch =
    passwordData.newPassword === passwordData.confirmPassword;

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-slate-500 dark:text-slate-400">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          Settings
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-xl">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "text-white shadow-lg"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
            style={{
              backgroundColor:
                activeTab === tab.id ? brand.colors.primary : "transparent",
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Content */}
      <div className="relative">
        <div className="absolute inset-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50" />

        <div className="relative p-6 space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-6">
                  Profile Information
                </h2>

                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* First Name */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        First Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          value={profileData.firstName}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              firstName: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-slate-700/80 border border-slate-200/50 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 text-slate-800 dark:text-slate-200"
                          style={
                            {
                              "--tw-ring-color": `${brand.colors.primary}50`,
                            } as React.CSSProperties
                          }
                          required
                        />
                      </div>
                    </div>

                    {/* Last Name */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Last Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          value={profileData.lastName}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              lastName: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-slate-700/80 border border-slate-200/50 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 text-slate-800 dark:text-slate-200"
                          style={
                            {
                              "--tw-ring-color": `${brand.colors.primary}50`,
                            } as React.CSSProperties
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email (Read Only) */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full pl-10 pr-4 py-3 bg-slate-100/80 dark:bg-slate-700/80 border border-slate-200/50 dark:border-slate-600/50 rounded-xl text-slate-500 dark:text-slate-400 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Email address cannot be changed
                    </p>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            phone: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-slate-700/80 border border-slate-200/50 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 text-slate-800 dark:text-slate-200"
                        style={
                          {
                            "--tw-ring-color": `${brand.colors.primary}50`,
                          } as React.CSSProperties
                        }
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Bio
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          bio: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-3 bg-white/80 dark:bg-slate-700/80 border border-slate-200/50 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 text-slate-800 dark:text-slate-200 resize-none"
                      style={
                        {
                          "--tw-ring-color": `${brand.colors.primary}50`,
                        } as React.CSSProperties
                      }
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="flex items-center space-x-2 px-6 py-3 rounded-xl font-medium text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: brand.colors.primary,
                      boxShadow: `0 4px 12px ${brand.colors.primary}25`,
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {updateProfileMutation.isPending ? (
                      <motion.div
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    <span>
                      {updateProfileMutation.isPending
                        ? "Saving..."
                        : "Save Changes"}
                    </span>
                  </motion.button>
                </form>
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Change Password */}
                <div>
                  <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-6">
                    Change Password
                  </h2>

                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    {/* Current Password */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Current Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type={showPasswords.current ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              currentPassword: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-12 py-3 bg-white/80 dark:bg-slate-700/80 border border-slate-200/50 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 text-slate-800 dark:text-slate-200"
                          style={
                            {
                              "--tw-ring-color": `${brand.colors.primary}50`,
                            } as React.CSSProperties
                          }
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords({
                              ...showPasswords,
                              current: !showPasswords.current,
                            })
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                          {showPasswords.current ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              newPassword: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-12 py-3 bg-white/80 dark:bg-slate-700/80 border border-slate-200/50 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 text-slate-800 dark:text-slate-200"
                          style={
                            {
                              "--tw-ring-color": `${brand.colors.primary}50`,
                            } as React.CSSProperties
                          }
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords({
                              ...showPasswords,
                              new: !showPasswords.new,
                            })
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                          {showPasswords.new ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      {/* Password Strength */}
                      {passwordData.newPassword && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              Password strength:
                            </span>
                            <span
                              className="text-sm font-medium"
                              style={{ color: passwordStrength.color }}
                            >
                              {passwordStrength.strength}
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <motion.div
                              className="h-2 rounded-full transition-all duration-300"
                              style={{
                                backgroundColor: passwordStrength.color,
                                width: passwordStrength.width,
                              }}
                              initial={{ width: 0 }}
                              animate={{ width: passwordStrength.width }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-12 py-3 bg-white/80 dark:bg-slate-700/80 border border-slate-200/50 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 text-slate-800 dark:text-slate-200"
                          style={
                            {
                              "--tw-ring-color": `${brand.colors.primary}50`,
                            } as React.CSSProperties
                          }
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords({
                              ...showPasswords,
                              confirm: !showPasswords.confirm,
                            })
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                          {showPasswords.confirm ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      {/* Password Match Indicator */}
                      {passwordData.confirmPassword && (
                        <div className="flex items-center space-x-2">
                          {passwordsMatch ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <X className="w-4 h-4 text-red-600" />
                          )}
                          <span
                            className="text-sm"
                            style={{
                              color: passwordsMatch ? "#22c55e" : "#ef4444",
                            }}
                          >
                            {passwordsMatch
                              ? "Passwords match"
                              : "Passwords don't match"}
                          </span>
                        </div>
                      )}
                    </div>

                    <motion.button
                      type="submit"
                      disabled={
                        changePasswordMutation.isPending ||
                        !passwordsMatch ||
                        !passwordData.currentPassword ||
                        !passwordData.newPassword
                      }
                      className="flex items-center space-x-2 px-6 py-3 rounded-xl font-medium text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: brand.colors.primary,
                        boxShadow: `0 4px 12px ${brand.colors.primary}25`,
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {changePasswordMutation.isPending ? (
                        <motion.div
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                      ) : (
                        <Lock className="w-5 h-5" />
                      )}
                      <span>
                        {changePasswordMutation.isPending
                          ? "Updating..."
                          : "Update Password"}
                      </span>
                    </motion.button>
                  </form>
                </div>

                {/* Two-Factor Authentication */}
                <div className="pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
                    Two-Factor Authentication
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div
                          className="p-2 rounded-lg"
                          style={{
                            backgroundColor: `${brand.colors.primary}20`,
                          }}
                        >
                          <Smartphone
                            className="w-5 h-5"
                            style={{ color: brand.colors.primary }}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800 dark:text-slate-200">
                            Authenticator App
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {user.two_factor_enabled
                              ? "Two-factor authentication is enabled"
                              : "Add an extra layer of security to your account"}
                          </p>
                        </div>
                      </div>

                      <motion.button
                        onClick={() =>
                          setShowTwoFactorPassword(!showTwoFactorPassword)
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                          user.two_factor_enabled
                            ? "bg-green-600"
                            : "bg-slate-300 dark:bg-slate-600"
                        }`}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.span
                          className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200"
                          animate={{ x: user.two_factor_enabled ? 24 : 4 }}
                        />
                      </motion.button>
                    </div>

                    {/* Password input for 2FA toggle */}
                    <AnimatePresence>
                      {showTwoFactorPassword && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4"
                        >
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                              Enter your password to{" "}
                              {user.two_factor_enabled ? "disable" : "enable"}{" "}
                              2FA
                            </label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                              <input
                                type="password"
                                value={twoFactorPassword}
                                onChange={(e) =>
                                  setTwoFactorPassword(e.target.value)
                                }
                                className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-slate-700/80 border border-slate-200/50 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 text-slate-800 dark:text-slate-200"
                                style={
                                  {
                                    "--tw-ring-color": `${brand.colors.primary}50`,
                                  } as React.CSSProperties
                                }
                                placeholder="Enter your current password"
                              />
                            </div>
                          </div>

                          <div className="flex space-x-3">
                            <motion.button
                              onClick={handleTwoFactorToggle}
                              disabled={
                                toggleTwoFactorMutation.isPending ||
                                !twoFactorPassword
                              }
                              className="px-4 py-2 rounded-lg font-medium text-white transition-all duration-200 disabled:opacity-50"
                              style={{ backgroundColor: brand.colors.primary }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {toggleTwoFactorMutation.isPending
                                ? "Processing..."
                                : "Confirm"}
                            </motion.button>
                            <motion.button
                              onClick={() => {
                                setShowTwoFactorPassword(false);
                                setTwoFactorPassword("");
                              }}
                              className="px-4 py-2 rounded-lg font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              Cancel
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {user.two_factor_enabled && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="p-4 bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl"
                      >
                        <div className="flex items-start space-x-3">
                          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                              Two-Factor Authentication Active
                            </p>
                            <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                              You'll need to enter a code from your
                              authenticator app when signing in.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
