import { motion } from "framer-motion";
import {
  BarChart3,
  Mail,
  MousePointerClick,
  Eye,
  TrendingUp,
  Users,
  Send,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  FileText,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Link } from "@tanstack/react-router";
import { useCampaignStats } from "@/hooks/useCampaigns";
import { brand } from "@/constants/brand";

const COLORS = [brand.colors.primary, "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}

export const Analytics = () => {
  const { data, isLoading } = useCampaignStats();
  const stats = (data as any)?.data?.data?.stats || {};
  const monthlyActivity = (data as any)?.data?.data?.monthly_activity || [];
  const engagement = (data as any)?.data?.data?.engagement;
  const recentCampaigns = (data as any)?.data?.data?.recent_campaigns || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: brand.colors.primary }} />
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Campaigns",
      value: formatNumber(stats?.total_campaigns || 0),
      icon: FileText,
      color: brand.colors.primary,
      detail: `${stats?.sent_campaigns || 0} sent`,
    },
    {
      label: "Emails Sent",
      value: formatNumber(stats?.total_emails_sent || 0),
      icon: Send,
      color: "#10B981",
      detail: `${stats?.failed_campaigns || 0} failed`,
    },
    {
      label: "Avg Open Rate",
      value: `${Number(stats?.average_open_rate || 0).toFixed(1)}%`,
      icon: Eye,
      color: "#F59E0B",
      detail: `${formatNumber(stats?.total_opens || 0)} total opens`,
    },
    {
      label: "Avg Click Rate",
      value: `${Number(stats?.average_click_rate || 0).toFixed(1)}%`,
      icon: MousePointerClick,
      color: "#8B5CF6",
      detail: `${formatNumber(stats?.total_clicks || 0)} total clicks`,
    },
  ];

  const engagementData = engagement
    ? [
        { name: "Sent", value: engagement.sent, color: brand.colors.primary },
        { name: "Opened", value: engagement.opened, color: "#10B981" },
        { name: "Clicked", value: engagement.clicked, color: "#F59E0B" },
      ]
    : [];

  const statusData = [
    { name: "Sent", value: stats?.sent_campaigns || 0 },
    { name: "Draft", value: stats?.draft_campaigns || 0 },
    { name: "Failed", value: stats?.failed_campaigns || 0 },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Analytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track your campaign performance and engagement metrics
          </p>
        </div>
        <Link
          to="/create-campaigns"
          className="flex items-center space-x-2 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all hover:shadow-lg"
          style={{ backgroundColor: brand.colors.primary }}
        >
          <Mail className="w-4 h-4" />
          <span>New Campaign</span>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${card.color}15` }}
              >
                <card.icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {card.value}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {card.label}
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              {card.detail}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-6"
        >
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
            Monthly Activity
          </h3>
          {monthlyActivity.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "8px",
                    color: "#f8fafc",
                  }}
                />
                <Legend />
                <Bar dataKey="sent" fill={brand.colors.primary} radius={[4, 4, 0, 0]} />
                <Bar dataKey="opens" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="clicks" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-slate-400">
              No activity data yet
            </div>
          )}
        </motion.div>

        {/* Campaign Status Pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-6"
        >
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
            Campaign Status
          </h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-slate-400">
              No campaigns yet
            </div>
          )}
        </motion.div>
      </div>

      {/* Engagement Funnel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-6"
      >
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6">
          Engagement Funnel
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sent */}
          <div className="text-center">
            <div className="relative inline-block">
              <div
                className="w-32 h-32 rounded-full flex items-center justify-center mx-auto"
                style={{ backgroundColor: `${brand.colors.primary}15` }}
              >
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${brand.colors.primary}25` }}
                >
                  <Send className="w-8 h-8" style={{ color: brand.colors.primary }} />
                </div>
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold text-slate-800 dark:text-slate-100">
              {formatNumber(engagement?.sent || 0)}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Sent</div>
          </div>

          {/* Opened */}
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full flex items-center justify-center mx-auto bg-green-50 dark:bg-green-900/20">
                <div className="w-24 h-24 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900/30">
                  <Eye className="w-8 h-8 text-green-500" />
                </div>
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold text-slate-800 dark:text-slate-100">
              {formatNumber(engagement?.opened || 0)}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Opened ({Number(engagement?.open_rate || 0).toFixed(1)}%)
            </div>
          </div>

          {/* Clicked */}
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full flex items-center justify-center mx-auto bg-amber-50 dark:bg-amber-900/20">
                <div className="w-24 h-24 rounded-full flex items-center justify-center bg-amber-100 dark:bg-amber-900/30">
                  <MousePointerClick className="w-8 h-8 text-amber-500" />
                </div>
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold text-slate-800 dark:text-slate-100">
              {formatNumber(engagement?.clicked || 0)}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Clicked ({Number(engagement?.click_rate || 0).toFixed(1)}%)
            </div>
          </div>
        </div>

        {/* Funnel Bar */}
        <div className="mt-8 space-y-3">
          {[
            { label: "Sent", value: engagement?.sent || 0, total: engagement?.sent || 1, color: brand.colors.primary },
            { label: "Opened", value: engagement?.opened || 0, total: engagement?.sent || 1, color: "#10B981" },
            { label: "Clicked", value: engagement?.clicked || 0, total: engagement?.sent || 1, color: "#F59E0B" },
          ].map((item) => (
            <div key={item.label} className="flex items-center space-x-4">
              <span className="text-sm text-slate-600 dark:text-slate-400 w-16">{item.label}</span>
              <div className="flex-1 h-6 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.value / item.total) * 100}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 w-20 text-right">
                {formatNumber(item.value)}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Campaigns */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Recent Campaigns
          </h3>
          <Link
            to="/campaigns"
            className="text-sm font-medium flex items-center space-x-1 hover:underline"
            style={{ color: brand.colors.primary }}
          >
            <span>View All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <th className="pb-3 font-medium">Campaign</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Sent</th>
                <th className="pb-3 font-medium text-right">Opens</th>
                <th className="pb-3 font-medium text-right">Clicks</th>
                <th className="pb-3 font-medium text-right">Open Rate</th>
                <th className="pb-3 font-medium text-right">Click Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {recentCampaigns.length > 0 ? (
                recentCampaigns.map((c: any) => (
                  <tr key={c.uuid} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <td className="py-3">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{c.name}</div>
                      <div className="text-xs text-slate-400">{c.subject}</div>
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          c.status === "sent"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : c.status === "draft"
                            ? "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                            : c.status === "failed"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 text-right text-slate-600 dark:text-slate-400">
                      {formatNumber(c.total_sent || 0)}
                    </td>
                    <td className="py-3 text-right text-slate-600 dark:text-slate-400">
                      {formatNumber(c.opens || 0)}
                    </td>
                    <td className="py-3 text-right text-slate-600 dark:text-slate-400">
                      {formatNumber(c.clicks || 0)}
                    </td>
                    <td className="py-3 text-right">
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {Number(c.open_rate || 0).toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <span className="font-medium text-amber-600 dark:text-amber-400">
                        {Number(c.click_rate || 0).toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No campaigns yet. Create your first campaign to see analytics.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};
