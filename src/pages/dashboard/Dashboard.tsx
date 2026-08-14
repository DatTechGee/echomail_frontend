/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Users,
  Send,
  Plus,
  BarChart3,
  ArrowRight,
  Target,
  Globe,
  Loader2,
  RefreshCw,
  Calendar,
} from "lucide-react";
import { brand } from "@/constants/brand";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-hot-toast";
import { useCampaigns, useCampaignStats } from "@/hooks/useCampaigns";
import { useContacts } from "@/hooks/useContacts";
import { useNewsletterSubscribers } from "@/hooks/useNewsletter";
import {
  formatRecipientCount,
  formatDate,
  getCampaignPerformance,
} from "@/utils/campaign";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  isLoading?: boolean;
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  href: string;
  onClick: () => void;
}

export const Dashboard = () => {
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d">("30d");

  // API hooks for real data
  const { data: campaignStats } = useCampaignStats();
  const { data: recentCampaignsData, isLoading: campaignsLoading } =
    useCampaigns({
      per_page: 5,
      sort_by: "sent_at",
      sort_order: "desc",
    });
  const { data: contactsData } = useContacts({
    per_page: 1, // We only need stats
  });
  const { data: newsletterData } = useNewsletterSubscribers({
    per_page: 1, // We only need stats
  });

  // Extract data from API responses
  const campaigns = recentCampaignsData?.data.data.campaigns || [];
  const campaignStatsData = campaignStats?.data.data.stats;
  const contactStatsData = contactsData?.data.data.stats;
  const newsletterStatsData = newsletterData?.data.data.stats;

  // Calculate stats with real data
  const stats: StatCard[] = [
    {
      title: "Total Campaigns",
      value: campaignStatsData?.total_campaigns || 0,
      icon: Mail,
      color: brand.colors.primary,
      isLoading: !campaignStatsData,
    },
    {
      title: "WaitList Subscribers",
      value: formatRecipientCount(newsletterStatsData?.active || 0),
      icon: Users,
      color: brand.colors.accent,
      isLoading: !newsletterStatsData,
    },
    {
      title: "Total Contacts",
      value: formatRecipientCount(contactStatsData?.total || 0),
      icon: Target,
      color: brand.colors.secondary,
      isLoading: !contactStatsData,
    },
  ];

  const quickActions: QuickAction[] = [
    {
      title: "Create Campaign",
      description: "Start a new email campaign",
      icon: Plus,
      color: brand.colors.primary,
      href: "/create-campaigns",
      onClick: () => navigate({ to: "/create-campaigns" }),
    },
    {
      title: "View Campaigns",
      description: "Manage your campaigns",
      icon: BarChart3,
      color: brand.colors.accent,
      href: "/campaigns",
      onClick: () => navigate({ to: "/campaigns" }),
    },
    {
      title: "Manage Contacts",
      description: "Add or organize contacts",
      icon: Users,
      color: brand.colors.secondary,
      href: "/contacts",
      onClick: () => navigate({ to: "/contacts" }),
    },
    {
      title: "Newsletter Settings",
      description: "Configure newsletter signup",
      icon: Globe,
      color: brand.colors.accent,
      href: "/newsletters",
      onClick: () => navigate({ to: "/newsletters" }),
    },
  ];

  // Generate recent activity from real data
  const recentActivity = [
    ...campaigns.slice(0, 3).map((campaign) => {
      const performance = getCampaignPerformance(campaign);
      return {
        id: campaign.uuid,
        type: "campaign_sent" as const,
        message: `${campaign.name} ${campaign.status === "sent" ? "sent" : "created"} - ${formatRecipientCount(performance.total_recipients)} recipients`,
        time: formatDate(campaign.sent_at || campaign.created_at),
        icon: campaign.status === "sent" ? Send : Mail,
        campaign,
      };
    }),
    // Add more activity types as needed
  ];

  const handleRefreshData = () => {
    // Trigger refetch of all data
    toast.success("Refreshing dashboard data...");
  };

  const handleViewAllCampaigns = () => {
    navigate({ to: "/campaigns" });
  };

  const handleCampaignClick = (campaignUuid: string) => {
    console.log(campaignUuid);

    navigate({ to: "/campaigns" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Welcome back! Here's what's happening with your email campaigns.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <motion.button
            onClick={handleRefreshData}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw className="w-4 h-4" />
          </motion.button>

          <div className="flex bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-lg">
            {[
              { value: "7d", label: "7 Days" },
              { value: "30d", label: "30 Days" },
              { value: "90d", label: "90 Days" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setTimeframe(option.value as any)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                  timeframe === option.value
                    ? "text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
                style={{
                  backgroundColor:
                    timeframe === option.value
                      ? brand.colors.primary
                      : "transparent",
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50" />

            <div className="relative p-6">
              {stat.isLoading ? (
                <div className="flex items-center justify-center h-24">
                  <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: `${stat.color}20` }}
                    >
                      <stat.icon
                        className="w-6 h-6"
                        style={{ color: stat.color }}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                      {stat.value}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {stat.title}
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50" />

          <div className="relative p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                Monthly Activity
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Last 6 months
              </span>
            </div>

            {campaignStats?.data.data.monthly_activity?.length ? (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={campaignStats.data.data.monthly_activity}
                    margin={{ top: 5, right: 10, left: -15, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#cbd5e1"
                      strokeOpacity={0.4}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      cursor={{ fill: "#94a3b8", opacity: 0.1 }}
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid #e2e8f0",
                        fontSize: 13,
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 13 }} />
                    <Bar
                      dataKey="sent"
                      name="Sent"
                      fill={brand.colors.primary}
                      radius={[6, 6, 0, 0]}
                      maxBarSize={28}
                    />
                    <Bar
                      dataKey="opens"
                      name="Opens"
                      fill={brand.colors.accent}
                      radius={[6, 6, 0, 0]}
                      maxBarSize={28}
                    />
                    <Bar
                      dataKey="clicks"
                      name="Clicks"
                      fill={brand.colors.secondary}
                      radius={[6, 6, 0, 0]}
                      maxBarSize={28}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-16">
                <BarChart3 className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  No activity to display yet.
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Engagement Funnel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50" />

          <div className="relative p-6">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-6">
              Engagement Overview
            </h2>

            {campaignStats?.data.data.engagement ? (
              <>
                <div className="h-56 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={[
                        {
                          stage: "Sent",
                          count:
                            campaignStats.data.data.engagement.sent || 0,
                        },
                        {
                          stage: "Opened",
                          count:
                            campaignStats.data.data.engagement.opened || 0,
                        },
                        {
                          stage: "Clicked",
                          count:
                            campaignStats.data.data.engagement.clicked || 0,
                        },
                      ]}
                      margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#cbd5e1"
                        strokeOpacity={0.4}
                        horizontal={false}
                      />
                      <XAxis
                        type="number"
                        tick={{ fill: "#94a3b8", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                      />
                      <YAxis
                        type="category"
                        dataKey="stage"
                        tick={{ fill: "#64748b", fontSize: 13 }}
                        axisLine={false}
                        tickLine={false}
                        width={70}
                      />
                      <Tooltip
                        cursor={{ fill: "#94a3b8", opacity: 0.1 }}
                        contentStyle={{
                          borderRadius: 12,
                          border: "1px solid #e2e8f0",
                          fontSize: 13,
                        }}
                      />
                      <Bar
                        dataKey="count"
                        name="Recipients"
                        fill={brand.colors.primary}
                        radius={[0, 6, 6, 0]}
                        maxBarSize={26}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      label: "Open Rate",
                      value: `${campaignStats.data.data.engagement.open_rate || 0}%`,
                      color: brand.colors.accent,
                    },
                    {
                      label: "Click Rate",
                      value: `${campaignStats.data.data.engagement.click_rate || 0}%`,
                      color: brand.colors.secondary,
                    },
                    {
                      label: "Total Sent",
                      value: formatRecipientCount(
                        campaignStats.data.data.engagement.sent || 0
                      ),
                      color: brand.colors.primary,
                    },
                  ].map((m) => (
                    <div
                      key={m.label}
                      className="text-center p-3 rounded-xl bg-slate-50/60 dark:bg-slate-700/30"
                    >
                      <div
                        className="text-xl font-bold"
                        style={{ color: m.color }}
                      >
                        {m.value}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <BarChart3 className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  No engagement data yet.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Campaigns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 relative"
        >
          <div className="absolute inset-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50" />

          <div className="relative p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                Recent Campaigns
              </h2>
              <motion.button
                onClick={handleViewAllCampaigns}
                className="text-sm font-medium transition-colors duration-200 flex items-center space-x-1 hover:opacity-80"
                style={{ color: brand.colors.primary }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>

            {campaignsLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                <span className="ml-2 text-slate-600 dark:text-slate-400">
                  Loading campaigns...
                </span>
              </div>
            ) : campaigns.length === 0 ? (
              <div className="text-center py-8">
                <Mail className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">
                  No campaigns yet
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Create your first email campaign to get started!
                </p>
                <motion.button
                  onClick={() => navigate({ to: "/create-campaigns" })}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-white transition-all duration-200"
                  style={{ backgroundColor: brand.colors.primary }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Campaign</span>
                </motion.button>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {campaigns.map((campaign, index) => {
                    const performance = getCampaignPerformance(campaign);
                    return (
                      <motion.div
                        key={campaign.uuid}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-600/50 transition-colors cursor-pointer"
                        onClick={() => handleCampaignClick(campaign.uuid)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{
                              backgroundColor: `${brand.colors.primary}20`,
                            }}
                          >
                            <Mail
                              className="w-5 h-5"
                              style={{ color: brand.colors.primary }}
                            />
                          </div>
                          <div>
                            <h3 className="font-medium text-slate-800 dark:text-slate-200 line-clamp-1">
                              {campaign.name}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                              <span>
                                {formatRecipientCount(
                                  performance.total_recipients
                                )}{" "}
                                recipients
                              </span>
                              <span>•</span>
                              <span>
                                {formatDate(
                                  campaign.sent_at || campaign.created_at
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50" />

          <div className="relative p-6">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-6">
              Quick Actions
            </h2>

            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  onClick={action.onClick}
                  className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors text-left"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: `${action.color}20` }}
                  >
                    <action.icon
                      className="w-5 h-5"
                      style={{ color: action.color } as any}
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-slate-800 dark:text-slate-200">
                      {action.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {action.description}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50" />

          <div className="relative p-6">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-6">
              Performance Overview
            </h2>

            <div className="space-y-6">
              {/* Performance metrics */}
              {([
                {
                  label: "Emails Sent",
                  value: formatRecipientCount(
                    campaignStatsData?.total_emails_sent || 0
                  ),
                  color: brand.colors.primary,
                },
                {
                  label: "Open Rate",
                  value: `${Math.round(
                    campaignStatsData?.average_open_rate || 0
                  )}%`,
                  pct: Math.round(campaignStatsData?.average_open_rate || 0),
                  color: brand.colors.accent,
                },
                {
                  label: "Click Rate",
                  value: `${Math.round(
                    campaignStatsData?.average_click_rate || 0
                  )}%`,
                  pct: Math.round(
                    campaignStatsData?.average_click_rate || 0
                  ),
                  color: brand.colors.secondary,
                },
              ] as Array<{
                label: string;
                value: string;
                pct?: number;
                color: string;
              }>).map((metric, index) => (
                <div key={metric.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {metric.label}
                    </span>
                    <span className="text-lg font-bold text-slate-800 dark:text-slate-200">
                      {metric.value}
                    </span>
                  </div>
                  {typeof metric.pct === "number" && (
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <motion.div
                        className="h-2 rounded-full"
                        style={{ backgroundColor: metric.color }}
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.max(
                            2,
                            Math.min(100, metric.pct)
                          )}%`,
                        }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center flex-wrap gap-x-6 gap-y-2 mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-600/50">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: brand.colors.primary }}
                ></div>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Sent: {formatRecipientCount(campaignStatsData?.total_emails_sent || 0)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: brand.colors.accent }}
                ></div>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Opens: {formatRecipientCount(campaignStatsData?.total_opens || 0)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: brand.colors.secondary }}
                ></div>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Clicks: {formatRecipientCount(campaignStatsData?.total_clicks || 0)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50" />

          <div className="relative p-6">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-6">
              Recent Activity
            </h2>

            {recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  No recent activity
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <div
                      className="p-2 rounded-lg mt-1 flex-shrink-0"
                      style={{ backgroundColor: `${brand.colors.primary}20` }}
                    >
                      <activity.icon
                        className="w-4 h-4"
                        style={{ color: brand.colors.primary }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-800 dark:text-slate-200">
                        {activity.message}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
