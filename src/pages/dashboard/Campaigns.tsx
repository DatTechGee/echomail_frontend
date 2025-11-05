/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  Eye,
  MousePointer,
  CheckCircle,
  XCircle,
  Copy,
  Edit,
  Trash2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Send,
} from "lucide-react";
import { brand } from "@/constants/brand";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-hot-toast";
import {
  useCampaigns,
  useDeleteCampaign,
  useDuplicateCampaign,
  useSendCampaign,
} from "@/hooks/useCampaigns";
import {
  CAMPAIGN_STATUS_OPTIONS,
  CAMPAIGN_SORT_OPTIONS,
} from "@/constants/campaign";
import {
  getStatusColor,
  getStatusLabel,
  formatDate,
  formatDateTime,
  formatRecipientCount,
  getCampaignPerformance,
  getOpenRateColor,
  getClickRateColor,
} from "@/utils/campaign";
import type { CampaignStatus, GetCampaignsRequest } from "@/types/campaign";

export const Campaigns = () => {
  const navigate = useNavigate();

  // Filter and pagination state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | "">("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [sortBy, setSortBy] = useState<
    "name" | "subject" | "sent_at" | "total_recipients"
  >("sent_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Build query parameters
  const queryParams: GetCampaignsRequest = {
    search: searchQuery || undefined,
    status: statusFilter || undefined,
    page: currentPage,
    per_page: perPage,
    sort_by: sortBy,
    sort_order: sortOrder,
  };

  // API hooks
  const {
    data: campaignsData,
    isLoading: campaignsLoading,
    error: campaignsError,
    refetch: refetchCampaigns,
  } = useCampaigns(queryParams);

  const deleteContractMutation = useDeleteCampaign();
  const duplicateCampaignMutation = useDuplicateCampaign();
  const sendCampaignMutation = useSendCampaign();

  const campaigns = campaignsData?.data.data.campaigns || [];
  const pagination = campaignsData?.data.data.pagination;
  const stats = campaignsData?.data.data.stats;

  const filteredCampaigns = campaigns;

  const getStatusIcon = (status: CampaignStatus) => {
    switch (status) {
      case "sent":
        return <CheckCircle className="w-4 h-4" />;
      case "draft":
        return <Edit className="w-4 h-4" />;
      case "failed":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  const handleCreateCampaign = () => {
    navigate({ to: "/create-campaigns" });
  };

  const handleDuplicateCampaign = async (uuid: string) => {
    try {
      const response = await duplicateCampaignMutation.mutateAsync(uuid);
      if (response.data.status === 1) {
        toast.success("Campaign duplicated successfully!");
        navigate({
          to: `/create-campaigns?duplicate=${response.data.data.campaign.uuid}`,
        });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to duplicate campaign";
      toast.error(errorMessage);
    }
  };

  const handleSendCampaign = async (uuid: string) => {
    try {
      const response = await sendCampaignMutation.mutateAsync(uuid);
      if (response.data.status === 1) {
        toast.success("Campaign sent successfully!");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to send campaign";
      toast.error(errorMessage);
    }
  };

  const handleDeleteCampaign = async (uuid: string, name: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await deleteContractMutation.mutateAsync(uuid);
      if (response.data.status === 1) {
        toast.success("Campaign deleted successfully!");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete campaign";
      toast.error(errorMessage);
    }
  };

  if (campaignsError) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">Failed to load campaigns</div>
          <motion.button
            onClick={() => refetchCampaigns()}
            className="flex items-center space-x-2 mx-auto px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry</span>
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            Campaigns
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage and track your email campaigns
          </p>
        </div>

        {/* Stats */}
        <div className="flex space-x-6">
          <div className="text-center">
            <div
              className="text-2xl font-bold"
              style={{ color: brand.colors.primary }}
            >
              {stats?.sent_campaigns || 0}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Sent
            </div>
          </div>
          <div className="text-center">
            <div
              className="text-2xl font-bold"
              style={{ color: brand.colors.accent }}
            >
              {formatRecipientCount(stats?.total_emails_sent || 0)}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Delivered
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50" />

        <div className="relative p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 pr-4 py-2 bg-slate-100/50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
                  style={
                    {
                      "--tw-ring-color": `${brand.colors.primary}50`,
                    } as React.CSSProperties
                  }
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="pl-10 pr-8 py-2 bg-slate-100/50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 appearance-none"
                  style={
                    {
                      "--tw-ring-color": `${brand.colors.primary}50`,
                    } as React.CSSProperties
                  }
                >
                  {CAMPAIGN_STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [newSortBy, newSortOrder] = e.target.value.split("-");
                    setSortBy(newSortBy as any);
                    setSortOrder(newSortOrder as any);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 bg-slate-100/50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 appearance-none"
                  style={
                    {
                      "--tw-ring-color": `${brand.colors.primary}50`,
                    } as React.CSSProperties
                  }
                >
                  {CAMPAIGN_SORT_OPTIONS.map((option) => (
                    <option
                      key={`${option.value}-desc`}
                      value={`${option.value}-desc`}
                    >
                      {option.label} (Newest)
                    </option>
                  ))}
                  {CAMPAIGN_SORT_OPTIONS.map((option) => (
                    <option
                      key={`${option.value}-asc`}
                      value={`${option.value}-asc`}
                    >
                      {option.label} (Oldest)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <motion.button
                onClick={() => refetchCampaigns()}
                disabled={campaignsLoading}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RefreshCw
                  className={`w-4 h-4 ${campaignsLoading ? "animate-spin" : ""}`}
                />
              </motion.button>

              {/* Create Campaign Button */}
              <motion.button
                onClick={handleCreateCampaign}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  background: `linear-gradient(135deg, ${brand.colors.primary}, ${brand.colors.primary}dd)`,
                  boxShadow: `0 4px 12px ${brand.colors.primary}25`,
                }}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="w-5 h-5" />
                <span>Create Campaign</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Campaigns List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50" />

        <div className="relative overflow-hidden rounded-2xl">
          {campaignsLoading ? (
            <div className="text-center py-12">
              <motion.div
                className="w-8 h-8 border-2 border-slate-300 border-t-blue-500 rounded-full mx-auto mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="text-slate-600 dark:text-slate-400">
                Loading campaigns...
              </p>
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">
                No campaigns found
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {searchQuery || statusFilter
                  ? "Try adjusting your search or filter criteria."
                  : "Create your first campaign to get started!"}
              </p>
              {!searchQuery && !statusFilter && (
                <motion.button
                  onClick={handleCreateCampaign}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-white transition-all duration-200"
                  style={{ backgroundColor: brand.colors.primary }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="w-4 h-4" />
                  <span>Create First Campaign</span>
                </motion.button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50/50 dark:bg-slate-700/50 border-b border-slate-200/50 dark:border-slate-600/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-700 dark:text-slate-300">
                        Campaign
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-700 dark:text-slate-300">
                        Recipients
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-700 dark:text-slate-300">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-700 dark:text-slate-300">
                        Performance
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-slate-700 dark:text-slate-300">
                        Date
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-medium text-slate-700 dark:text-slate-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/50 dark:divide-slate-600/50">
                    <AnimatePresence>
                      {filteredCampaigns.map((campaign, index) => {
                        const performance = getCampaignPerformance(campaign);
                        return (
                          <motion.tr
                            key={campaign.uuid}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="space-y-1">
                                <div className="font-semibold text-slate-800 dark:text-slate-200">
                                  {campaign.name}
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                  {campaign.subject}
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <Users className="w-4 h-4 text-slate-500" />
                                  <span className="font-medium text-slate-800 dark:text-slate-200">
                                    {formatRecipientCount(
                                      campaign.total_recipients
                                    )}
                                  </span>
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                                  {campaign.recipient_config?.type || "unknown"}
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}
                              >
                                {getStatusIcon(campaign.status)}
                                <span className="capitalize">
                                  {getStatusLabel(campaign.status)}
                                </span>
                              </span>
                            </td>

                            <td className="px-6 py-4">
                              {campaign.status === "sent" ? (
                                <div className="space-y-1">
                                  <div className="text-xs text-slate-500 dark:text-slate-400">
                                    {formatRecipientCount(
                                      performance.total_sent
                                    )}{" "}
                                    delivered
                                  </div>
                                </div>
                              ) : (
                                <span className="text-sm text-slate-400">
                                  -
                                </span>
                              )}
                            </td>

                            <td className="px-6 py-4">
                              <div className="space-y-1">
                                <div className="flex items-center space-x-1 text-sm text-slate-800 dark:text-slate-200">
                                  <Calendar className="w-4 h-4 text-slate-500" />
                                  <span>
                                    {campaign.sent_at
                                      ? formatDate(campaign.sent_at)
                                      : formatDate(campaign.created_at)}
                                  </span>
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                  {campaign.sent_at
                                    ? `Sent ${formatDateTime(campaign.sent_at)}`
                                    : campaign.status === "draft"
                                      ? "Draft"
                                      : "Failed"}
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                {campaign.status === "draft" && (
                                  <motion.button
                                    onClick={() =>
                                      handleSendCampaign(campaign.uuid)
                                    }
                                    disabled={sendCampaignMutation.isPending}
                                    className="p-2 rounded-lg text-slate-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    title="Send Campaign"
                                  >
                                    <Send className="w-4 h-4" />
                                  </motion.button>
                                )}

                                {campaign.status !== "sent" && (
                                  <motion.button
                                    onClick={() =>
                                      handleDeleteCampaign(
                                        campaign.uuid,
                                        campaign.name
                                      )
                                    }
                                    disabled={deleteContractMutation.isPending}
                                    className="p-2 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    title="Delete Campaign"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </motion.button>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination && pagination.last_page > 1 && (
                <div className="px-6 py-4 border-t border-slate-200/50 dark:border-slate-600/50">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Showing {pagination.from || 0} to {pagination.to || 0} of{" "}
                      {pagination.total} results
                    </div>

                    <div className="flex items-center space-x-2">
                      <motion.button
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage <= 1}
                        className="p-2 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </motion.button>

                      <span className="px-3 py-2 text-sm text-slate-600 dark:text-slate-400">
                        Page {currentPage} of {pagination.last_page}
                      </span>

                      <motion.button
                        onClick={() =>
                          setCurrentPage(
                            Math.min(pagination.last_page, currentPage + 1)
                          )
                        }
                        disabled={currentPage >= pagination.last_page}
                        className="p-2 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
