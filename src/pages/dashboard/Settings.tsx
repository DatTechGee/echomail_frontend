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
  Webhook,
  Plus,
  Trash2,
  RefreshCw,
  Copy,
  Server,
  Key,
  Send,
  CheckCircle,
  XCircle,
  ExternalLink,
  Code,
  Terminal,
  Globe,
  Database,
} from "lucide-react";
import { brand } from "@/constants/brand";
import { useAuthStore } from "@/stores/auth";
import {
  useUpdateProfile,
  useChangePassword,
  useToggleTwoFactor,
} from "@/hooks/useAuth";
import { WEBHOOK_EVENTS } from "@/types/webhook";
import {
  useWebhooks,
  useCreateWebhook,
  useDeleteWebhook,
  useTestWebhook,
} from "@/hooks/useWebhooks";
import {
  useSmtpSettings,
  useUpdateSmtp,
  useTestSmtp,
  useTestSmtpConnection,
  useApiKeys,
  useCreateApiKey,
  useToggleApiKey,
  useRevokeApiKey,
} from "@/hooks/useSettings";
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

  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookEvents, setWebhookEvents] = useState<string[]>([]);

  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const toggleTwoFactorMutation = useToggleTwoFactor();

  const { data: webhooksData, isLoading: webhooksLoading } = useWebhooks();
  const createWebhookMutation = useCreateWebhook();
  const deleteWebhookMutation = useDeleteWebhook();
  const testWebhookMutation = useTestWebhook();

  const webhooks = webhooksData?.data?.data?.webhooks || [];

  // Developer Settings
  const { data: smtpData } = useSmtpSettings();
  const updateSmtpMutation = useUpdateSmtp();
  const testSmtpMutation = useTestSmtp();
  const testConnectionMutation = useTestSmtpConnection();

  const { data: apiKeysData, isLoading: apiKeysLoading } = useApiKeys();
  const createApiKeyMutation = useCreateApiKey();
  const toggleApiKeyMutation = useToggleApiKey();
  const revokeApiKeyMutation = useRevokeApiKey();

  const apiKeys = apiKeysData?.data?.data?.api_keys || [];

  const [smtpForm, setSmtpForm] = useState({
    host: "",
    port: 587,
    username: "",
    password: "",
    encryption: "tls" as "tls" | "ssl" | "none",
    from_address: "",
    from_name: "",
  });

  const [testEmail, setTestEmail] = useState("");
  const [showSmtpPassword, setShowSmtpPassword] = useState(false);
  const [newApiKeyName, setNewApiKeyName] = useState("");

  // Load SMTP settings
  useEffect(() => {
    if (smtpData?.data?.data?.smtp) {
      setSmtpForm(smtpData.data.data.smtp);
    }
  }, [smtpData]);

  const toggleWebhookEvent = (event: string) => {
    setWebhookEvents((prev) =>
      prev.includes(event)
        ? prev.filter((e) => e !== event)
        : [...prev, event]
    );
  };

  const handleCreateWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!webhookUrl.trim()) {
      toast.error("Please enter a webhook URL");
      return;
    }
    if (webhookEvents.length === 0) {
      toast.error("Please select at least one event");
      return;
    }
    try {
      await createWebhookMutation.mutateAsync({
        url: webhookUrl.trim(),
        events: webhookEvents,
      });
      setWebhookUrl("");
      setWebhookEvents([]);
      toast.success("Webhook created successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create webhook");
    }
  };

  const handleDeleteWebhook = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this webhook?")) return;
    try {
      await deleteWebhookMutation.mutateAsync(id);
      toast.success("Webhook deleted");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete webhook");
    }
  };

  const handleTestWebhook = async (id: number) => {
    try {
      await testWebhookMutation.mutateAsync(id);
      toast.success("Test ping sent");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send test ping");
    }
  };

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
    { id: "developers", label: "Developers", icon: Code },
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
      toast.error(error.response?.data?.message || "Failed to update profile.");
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
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password updated successfully! Please login again.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update password.");
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
      toast.success(user?.two_factor_enabled ? "2FA disabled" : "2FA enabled");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update 2FA.");
    }
  };

  const handleSmtpSave = async () => {
    try {
      await updateSmtpMutation.mutateAsync(smtpForm);
      toast.success("SMTP settings saved!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save SMTP settings");
    }
  };

  const handleTestConnection = async () => {
    try {
      await testConnectionMutation.mutateAsync({
        host: smtpForm.host,
        port: smtpForm.port,
        username: smtpForm.username,
        password: smtpForm.password,
        encryption: smtpForm.encryption,
      });
      toast.success("SMTP connection successful!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "SMTP connection failed");
    }
  };

  const handleTestEmail = async () => {
    if (!testEmail) {
      toast.error("Enter an email to send test to");
      return;
    }
    try {
      await testSmtpMutation.mutateAsync({ ...smtpForm, to_email: testEmail });
      toast.success("Test email sent! Check your inbox.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send test email");
    }
  };

  const handleCreateApiKey = async () => {
    if (!newApiKeyName.trim()) {
      toast.error("Enter a name for the API key");
      return;
    }
    try {
      await createApiKeyMutation.mutateAsync({ name: newApiKeyName.trim() });
      setNewApiKeyName("");
      toast.success("API key created! Copy it now - it won't be shown again.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create API key");
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
  const passwordsMatch = passwordData.newPassword === passwordData.confirmPassword;

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <motion.div
            className="w-10 h-10 border-3 border-slate-300 rounded-full mx-auto mb-4"
            style={{ borderTopColor: brand.colors.primary }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-slate-700/80 border border-slate-200/50 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 text-slate-800 dark:text-slate-200";
  const inputStyle = { "--tw-ring-color": `${brand.colors.primary}50` } as React.CSSProperties;
  const primaryBtn = "flex items-center space-x-2 px-6 py-3 rounded-xl font-medium text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const sectionCard = "bg-white dark:bg-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-6";

  return (
    <div className="max-w-4xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Settings</h1>
        <p className="text-slate-600 dark:text-slate-400">Manage your account settings and preferences</p>
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
            style={{ backgroundColor: activeTab === tab.id ? brand.colors.primary : "transparent" }}
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
            {/* ===== PROFILE TAB ===== */}
            {activeTab === "profile" && (
              <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-6">Profile Information</h2>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">First Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input type="text" value={profileData.firstName} onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })} className={inputClass} style={inputStyle} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input type="text" value={profileData.lastName} onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })} className={inputClass} style={inputStyle} required />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input type="email" value={user.email} disabled className="w-full pl-10 pr-4 py-3 bg-slate-100/80 dark:bg-slate-700/80 border border-slate-200/50 dark:border-slate-600/50 rounded-xl text-slate-500 dark:text-slate-400 cursor-not-allowed" />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Email address cannot be changed</p>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input type="tel" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} className={inputClass} style={inputStyle} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Bio</label>
                    <textarea value={profileData.bio} onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })} rows={3} className="w-full px-4 py-3 bg-white/80 dark:bg-slate-700/80 border border-slate-200/50 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 text-slate-800 dark:text-slate-200 resize-none" style={inputStyle} placeholder="Tell us about yourself..." />
                  </div>
                  <motion.button type="submit" disabled={updateProfileMutation.isPending} className={primaryBtn} style={{ backgroundColor: brand.colors.primary }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Save className="w-5 h-5" />
                    <span>{updateProfileMutation.isPending ? "Saving..." : "Save Changes"}</span>
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* ===== SECURITY TAB ===== */}
            {activeTab === "security" && (
              <motion.div key="security" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-6">Change Password</h2>
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Current Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input type={showPasswords.current ? "text" : "password"} value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} className={inputClass} style={inputStyle} required />
                        <button type="button" onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input type={showPasswords.new ? "text" : "password"} value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} className={inputClass} style={inputStyle} required />
                        <button type="button" onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {passwordData.newPassword && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Password strength:</span>
                            <span className="text-sm font-medium" style={{ color: passwordStrength.color }}>{passwordStrength.strength}</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <motion.div className="h-2 rounded-full" style={{ backgroundColor: passwordStrength.color, width: passwordStrength.width }} initial={{ width: 0 }} animate={{ width: passwordStrength.width }} />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Confirm New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input type={showPasswords.confirm ? "text" : "password"} value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} className={inputClass} style={inputStyle} required />
                        <button type="button" onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {passwordData.confirmPassword && (
                        <div className="flex items-center space-x-2">
                          {passwordsMatch ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-red-600" />}
                          <span className="text-sm" style={{ color: passwordsMatch ? "#22c55e" : "#ef4444" }}>{passwordsMatch ? "Passwords match" : "Passwords don't match"}</span>
                        </div>
                      )}
                    </div>
                    <motion.button type="submit" disabled={changePasswordMutation.isPending || !passwordsMatch || !passwordData.currentPassword || !passwordData.newPassword} className={primaryBtn} style={{ backgroundColor: brand.colors.primary }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Lock className="w-5 h-5" />
                      <span>{changePasswordMutation.isPending ? "Updating..." : "Update Password"}</span>
                    </motion.button>
                  </form>
                </div>

                {/* 2FA */}
                <div className="pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Two-Factor Authentication</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: `${brand.colors.primary}20` }}>
                          <Smartphone className="w-5 h-5" style={{ color: brand.colors.primary }} />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800 dark:text-slate-200">Authenticator App</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{user.two_factor_enabled ? "Two-factor authentication is enabled" : "Add an extra layer of security to your account"}</p>
                        </div>
                      </div>
                      <motion.button onClick={() => setShowTwoFactorPassword(!showTwoFactorPassword)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${user.two_factor_enabled ? "bg-green-600" : "bg-slate-300 dark:bg-slate-600"}`} whileTap={{ scale: 0.95 }}>
                        <motion.span className="inline-block h-4 w-4 transform rounded-full bg-white" animate={{ x: user.two_factor_enabled ? 24 : 4 }} />
                      </motion.button>
                    </div>
                    <AnimatePresence>
                      {showTwoFactorPassword && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-4">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Enter your password to {user.two_factor_enabled ? "disable" : "enable"} 2FA</label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                              <input type="password" value={twoFactorPassword} onChange={(e) => setTwoFactorPassword(e.target.value)} className={inputClass} style={inputStyle} placeholder="Enter your current password" />
                            </div>
                          </div>
                          <div className="flex space-x-3">
                            <motion.button onClick={handleTwoFactorToggle} disabled={toggleTwoFactorMutation.isPending || !twoFactorPassword} className="px-4 py-2 rounded-lg font-medium text-white disabled:opacity-50" style={{ backgroundColor: brand.colors.primary }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              {toggleTwoFactorMutation.isPending ? "Processing..." : "Confirm"}
                            </motion.button>
                            <motion.button onClick={() => { setShowTwoFactorPassword(false); setTwoFactorPassword(""); }} className="px-4 py-2 rounded-lg font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
                              Cancel
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {user.two_factor_enabled && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="p-4 bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                        <div className="flex items-start space-x-3">
                          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Two-Factor Authentication Active</p>
                            <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">You'll need to enter a code from your authenticator app when signing in.</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ===== DEVELOPERS TAB ===== */}
            {activeTab === "developers" && (
              <motion.div key="developers" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-8">

                {/* --- SMTP Configuration --- */}
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${brand.colors.primary}20` }}>
                      <Server className="w-5 h-5" style={{ color: brand.colors.primary }} />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">SMTP Configuration</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Configure your email sending server</p>
                    </div>
                  </div>

                  <div className={sectionCard + " space-y-4"}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">SMTP Host *</label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input type="text" value={smtpForm.host} onChange={(e) => setSmtpForm({ ...smtpForm, host: e.target.value })} className={inputClass} style={inputStyle} placeholder="smtp.gmail.com" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Port *</label>
                        <div className="relative">
                          <Database className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input type="number" value={smtpForm.port} onChange={(e) => setSmtpForm({ ...smtpForm, port: Number(e.target.value) })} className={inputClass} style={inputStyle} placeholder="587" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Username *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input type="text" value={smtpForm.username} onChange={(e) => setSmtpForm({ ...smtpForm, username: e.target.value })} className={inputClass} style={inputStyle} placeholder="your@email.com" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input type={showSmtpPassword ? "text" : "password"} value={smtpForm.password} onChange={(e) => setSmtpForm({ ...smtpForm, password: e.target.value })} className={inputClass} style={inputStyle} placeholder="App-specific password" />
                        <button type="button" onClick={() => setShowSmtpPassword(!showSmtpPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {showSmtpPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">For Gmail, use an App Password (not your account password)</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Encryption</label>
                        <select value={smtpForm.encryption} onChange={(e) => setSmtpForm({ ...smtpForm, encryption: e.target.value as any })} className="w-full px-4 py-3 bg-white/80 dark:bg-slate-700/80 border border-slate-200/50 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 transition-all text-slate-800 dark:text-slate-200" style={inputStyle}>
                          <option value="tls">TLS (Recommended)</option>
                          <option value="ssl">SSL</option>
                          <option value="none">None</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">From Name</label>
                        <input type="text" value={smtpForm.from_name} onChange={(e) => setSmtpForm({ ...smtpForm, from_name: e.target.value })} className="w-full px-4 py-3 bg-white/80 dark:bg-slate-700/80 border border-slate-200/50 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 transition-all text-slate-800 dark:text-slate-200" style={inputStyle} placeholder="EchoMail" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">From Address *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input type="email" value={smtpForm.from_address} onChange={(e) => setSmtpForm({ ...smtpForm, from_address: e.target.value })} className={inputClass} style={inputStyle} placeholder="noreply@yourdomain.com" />
                      </div>
                    </div>

                    {/* SMTP Actions */}
                    <div className="flex flex-wrap gap-3 pt-2">
                      <motion.button onClick={handleSmtpSave} disabled={updateSmtpMutation.isPending} className="flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium text-white text-sm" style={{ backgroundColor: brand.colors.primary }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Save className="w-4 h-4" />
                        <span>{updateSmtpMutation.isPending ? "Saving..." : "Save SMTP Settings"}</span>
                      </motion.button>
                      <motion.button onClick={handleTestConnection} disabled={testConnectionMutation.isPending} className="flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium text-sm border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Terminal className="w-4 h-4" />
                        <span>{testConnectionMutation.isPending ? "Testing..." : "Test Connection"}</span>
                      </motion.button>
                    </div>

                    {/* Test Email */}
                    <div className="pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                      <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Send Test Email</h4>
                      <div className="flex items-center space-x-2">
                        <div className="relative flex-1">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input type="email" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} className={inputClass} style={inputStyle} placeholder="test@example.com" />
                        </div>
                        <motion.button onClick={handleTestEmail} disabled={testSmtpMutation.isPending} className="flex items-center space-x-2 px-4 py-3 rounded-xl font-medium text-white text-sm shrink-0" style={{ backgroundColor: brand.colors.primary }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Send className="w-4 h-4" />
                          <span>{testSmtpMutation.isPending ? "Sending..." : "Send Test"}</span>
                        </motion.button>
                      </div>
                    </div>

                    {/* Common SMTP Providers */}
                    <div className="pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                      <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Common SMTP Providers</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {[
                          { name: "Gmail", host: "smtp.gmail.com", port: 587, note: "Use App Password" },
                          { name: "Outlook", host: "smtp.office365.com", port: 587, note: "TLS required" },
                          { name: "SendGrid", host: "smtp.sendgrid.net", port: 587, note: "API key as password" },
                          { name: "Mailgun", host: "smtp.mailgun.org", port: 587, note: "SMTP credentials" },
                          { name: "AWS SES", host: "email-smtp.us-east-1.amazonaws.com", port: 465, note: "SSL required" },
                          { name: "Brevo", host: "smtp-relay.brevo.com", port: 587, note: "Login as password" },
                        ].map((provider) => (
                          <button
                            key={provider.name}
                            onClick={() => setSmtpForm({ ...smtpForm, host: provider.host, port: provider.port })}
                            className="p-3 rounded-lg border border-slate-200 dark:border-slate-600 text-left hover:border-blue-400 dark:hover:border-blue-500 transition-all"
                          >
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{provider.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{provider.host}:{provider.port}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{provider.note}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- API Keys --- */}
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${brand.colors.primary}20` }}>
                      <Key className="w-5 h-5" style={{ color: brand.colors.primary }} />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">API Keys</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Manage API keys for programmatic access</p>
                    </div>
                  </div>

                  <div className={sectionCard + " space-y-4"}>
                    {/* Create new key */}
                    <div className="flex items-center space-x-2">
                      <input type="text" value={newApiKeyName} onChange={(e) => setNewApiKeyName(e.target.value)} className="flex-1 px-4 py-2.5 bg-white/80 dark:bg-slate-700/80 border border-slate-200/50 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 transition-all text-sm text-slate-800 dark:text-slate-200" style={inputStyle} placeholder="API key name (e.g., Production, Development)" />
                      <motion.button onClick={handleCreateApiKey} disabled={createApiKeyMutation.isPending} className="flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-white text-sm shrink-0" style={{ backgroundColor: brand.colors.primary }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Plus className="w-4 h-4" />
                        <span>{createApiKeyMutation.isPending ? "Creating..." : "Create Key"}</span>
                      </motion.button>
                    </div>

                    {/* Keys list */}
                    {apiKeysLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <motion.div className="w-8 h-8 border-3 border-slate-300 rounded-full" style={{ borderTopColor: brand.colors.primary }} animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                      </div>
                    ) : apiKeys.length === 0 ? (
                      <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-6">No API keys yet. Create one to get started.</p>
                    ) : (
                      <div className="space-y-3">
                        {apiKeys.map((apiKey: any) => (
                          <div key={apiKey.id} className="p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl space-y-2">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${apiKey.active ? "text-green-800 dark:text-green-300 bg-green-100 dark:bg-green-900/30" : "text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-700"}`}>
                                    {apiKey.active ? "Active" : "Inactive"}
                                  </span>
                                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{apiKey.name}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <code className="text-xs font-mono px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-400">
                                    {apiKey.key.substring(0, 12)}...{apiKey.key.substring(apiKey.key.length - 4)}
                                  </code>
                                  <button onClick={() => { navigator.clipboard.writeText(apiKey.key); toast.success("Key copied to clipboard"); }} className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700" title="Copy full key">
                                    <Copy className="w-3 h-3 text-slate-500" />
                                  </button>
                                </div>
                                {apiKey.last_used_at && (
                                  <p className="text-xs text-slate-500 dark:text-slate-400">Last used: {new Date(apiKey.last_used_at).toLocaleDateString()}</p>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <motion.button onClick={() => toggleApiKeyMutation.mutate(apiKey.id)} className={`p-2 rounded-lg transition-all ${apiKey.active ? "text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/30" : "text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30"}`} title={apiKey.active ? "Deactivate" : "Activate"} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  {apiKey.active ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                </motion.button>
                                <motion.button onClick={() => { if (window.confirm("Revoke this API key? This cannot be undone.")) revokeApiKeyMutation.mutate(apiKey.id); }} className="p-2 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30" title="Revoke" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <Trash2 className="w-4 h-4" />
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* --- API Reference --- */}
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${brand.colors.primary}20` }}>
                      <ExternalLink className="w-5 h-5" style={{ color: brand.colors.primary }} />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">API Reference</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Base URL and endpoint documentation</p>
                    </div>
                  </div>

                  <div className={sectionCard + " space-y-4"}>
                    {/* Base URL */}
                    <div className="p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl">
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Base URL</p>
                      <div className="flex items-center space-x-2">
                        <code className="text-sm font-mono px-3 py-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg text-slate-800 dark:text-slate-200">
                          {brand.domain === "echomail.com" ? "https://scholarsnudge.com/echomail/api/v1" : `https://${brand.domain}/api/v1`}
                        </code>
                        <button onClick={() => { navigator.clipboard.writeText(brand.domain === "echomail.com" ? "https://scholarsnudge.com/echomail/api/v1" : `https://${brand.domain}/api/v1`); toast.success("URL copied"); }} className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700">
                          <Copy className="w-4 h-4 text-slate-500" />
                        </button>
                      </div>
                    </div>

                    {/* Auth Header */}
                    <div className="p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl">
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Authentication</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">Include your API key in the Authorization header:</p>
                      <code className="block text-xs font-mono px-3 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg text-slate-800 dark:text-slate-200">
                        Authorization: Bearer {"<your-api-key>"}
                      </code>
                    </div>

                    {/* Endpoint groups */}
                    {[
                      { group: "Campaigns", endpoints: [
                        { method: "GET", path: "/campaigns", desc: "List all campaigns" },
                        { method: "POST", path: "/campaigns", desc: "Create a campaign" },
                        { method: "GET", path: "/campaigns/{uuid}", desc: "Get campaign details" },
                        { method: "POST", path: "/campaigns/{uuid}/send", desc: "Send a campaign" },
                        { method: "POST", path: "/campaigns/{uuid}/duplicate", desc: "Duplicate a campaign" },
                      ]},
                      { group: "Contacts", endpoints: [
                        { method: "GET", path: "/contacts", desc: "List all contacts" },
                        { method: "POST", path: "/contacts", desc: "Create a contact" },
                        { method: "POST", path: "/contacts/import-csv", desc: "Import contacts from CSV" },
                        { method: "GET", path: "/contacts/groups", desc: "List contact groups" },
                      ]},
                      { group: "Automations", endpoints: [
                        { method: "GET", path: "/automations", desc: "List all automations" },
                        { method: "POST", path: "/automations", desc: "Create an automation" },
                        { method: "POST", path: "/automations/{uuid}/activate", desc: "Activate an automation" },
                        { method: "POST", path: "/automations/{uuid}/enroll", desc: "Enroll a subscriber" },
                      ]},
                      { group: "Newsletter", endpoints: [
                        { method: "POST", path: "/newsletter/subscribe", desc: "Subscribe to newsletter" },
                        { method: "GET", path: "/newsletter/subscribers", desc: "List subscribers" },
                      ]},
                    ].map((section) => (
                      <div key={section.group} className="p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl">
                        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">{section.group}</h4>
                        <div className="space-y-1.5">
                          {section.endpoints.map((ep) => (
                            <div key={ep.path + ep.method} className="flex items-center space-x-3 text-sm">
                              <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${
                                ep.method === "GET" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                                ep.method === "POST" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                                "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                              }`}>{ep.method}</span>
                              <code className="font-mono text-xs text-slate-600 dark:text-slate-400">{ep.path}</code>
                              <span className="text-xs text-slate-500 dark:text-slate-400">{ep.desc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* --- Webhooks --- */}
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${brand.colors.primary}20` }}>
                      <Webhook className="w-5 h-5" style={{ color: brand.colors.primary }} />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Webhooks</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Receive real-time notifications for events</p>
                    </div>
                  </div>

                  <div className={sectionCard + " space-y-4"}>
                    <form onSubmit={handleCreateWebhook} className="space-y-4 p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Endpoint URL</label>
                        <input type="url" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} className={inputClass} style={inputStyle} placeholder="https://your-app.com/webhook" required />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Events</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          {WEBHOOK_EVENTS.map((event) => (
                            <button key={event.value} type="button" onClick={() => toggleWebhookEvent(event.value)} className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${webhookEvents.includes(event.value) ? "text-white border-transparent" : "border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400"}`} style={{ backgroundColor: webhookEvents.includes(event.value) ? brand.colors.primary : "transparent" }}>
                              {event.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <motion.button type="submit" disabled={createWebhookMutation.isPending} className="flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium text-white text-sm" style={{ backgroundColor: brand.colors.primary }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Plus className="w-4 h-4" />
                        <span>{createWebhookMutation.isPending ? "Creating..." : "Create Webhook"}</span>
                      </motion.button>
                    </form>

                    {/* Webhook List */}
                    {webhooksLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <motion.div className="w-8 h-8 border-3 border-slate-300 rounded-full" style={{ borderTopColor: brand.colors.primary }} animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                      </div>
                    ) : webhooks.length === 0 ? (
                      <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-6">No webhooks configured yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {webhooks.map((webhook: any) => (
                          <div key={webhook.id} className="p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl space-y-3">
                            <div className="flex items-start justify-between gap-4">
                              <div className="min-w-0 space-y-1">
                                <div className="flex items-center space-x-2">
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${webhook.active ? "text-green-800 dark:text-green-300 bg-green-100 dark:bg-green-900/30" : "text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-700"}`}>{webhook.active ? "Active" : "Inactive"}</span>
                                </div>
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{webhook.url}</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {webhook.events?.map((event: string) => (
                                    <span key={event} className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: `${brand.colors.primary}15`, color: brand.colors.primary }}>{event}</span>
                                  ))}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 shrink-0">
                                <motion.button onClick={() => handleTestWebhook(webhook.id)} disabled={testWebhookMutation.isPending} className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50" title="Send test ping" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <RefreshCw className="w-4 h-4" />
                                </motion.button>
                                <motion.button onClick={() => handleDeleteWebhook(webhook.id)} disabled={deleteWebhookMutation.isPending} className="p-2 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 disabled:opacity-50" title="Delete" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <Trash2 className="w-4 h-4" />
                                </motion.button>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                              <span>Secret:</span>
                              <code className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded font-mono">{webhook.secret}</code>
                              <button onClick={() => { navigator.clipboard.writeText(webhook.secret); toast.success("Secret copied"); }} className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700" title="Copy secret">
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
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
