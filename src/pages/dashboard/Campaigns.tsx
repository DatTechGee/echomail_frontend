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
  RotateCcw,
  Clock,
  Loader,
  Download,
  X,
  ExternalLink,
} from "lucide-react";
import { brand } from "@/constants/brand";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-hot-toast";
import {
  useCampaigns,
  useDeleteCampaign,
  useDuplicateCampaign,
  useSendCampaign,
  useRetryCampaign,
  usePreviewCampaign,
  useTestSendCampaign,
  useMarkBounced,
  useCampaignRecipients,
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
import type {
  Campaign,
  CampaignStatus,
  GetCampaignsRequest,
  CampaignRecipient,
} from "@/types/campaign";
import { campaignService } from "@/services/api/campaign.services";

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

  // Preview modal state
  const [previewCampaign, setPreviewCampaign] = useState<{
    campaign: Campaign;
    subject: string;
    html: string;
  } | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  // Recipients modal state
  const [recipientsCampaign, setRecipientsCampaign] = useState<Campaign | null>(
    null
  );
  const [recipientFilter, setRecipientFilter] = useState<
    "" | "pending" | "sent" | "failed" | "bounced"
  >("");
  const [recipientSearch, setRecipientSearch] = useState("");
  const [recipientPage, setRecipientPage] = useState(1);
  const [testEmail, setTestEmail] = useState("");

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
  const retryCampaignMutation = useRetryCampaign();
  const previewMutation = usePreviewCampaign();
  const testSendMutation = useTestSendCampaign();
  const markBouncedMutation = useMarkBounced();

  // Recipients drill-down query (only when modal is open)
  const {
    data: recipientsData,
    isLoading: recipientsLoading,
    refetch: refetchRecipients,
  } = useCampaignRecipients(recipientsCampaign?.uuid || "", {
    status: recipientFilter || undefined,
    search: recipientSearch || undefined,
    page: recipientPage,
    per_page: 15,
  });

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
      case "scheduled":
        return <Clock className="w-4 h-4" />;
      case "sending":
        return <Loader className="w-4 h-4" />;
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
        toast.success("Campaign is being sent!");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to send campaign";
      toast.error(errorMessage);
    }
  };

  const handleRetryCampaign = async (uuid: string) => {
    try {
      const response = await retryCampaignMutation.mutateAsync(uuid);
      if (response.data.status === 1) {
        toast.success("Failed recipients are being retried!");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to retry campaign";
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

  const handlePreview = async (campaign: Campaign) => {
    setPreviewLoading(true);
    try {
      const response = await previewMutation.mutateAsync(campaign.uuid);
      if (response.data.status === 1) {
        setPreviewCampaign({
          campaign,
          subject: response.data.data.subject,
          html: response.data.data.html,
        });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to generate preview";
      toast.error(errorMessage);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleExport = async (campaign: Campaign) => {
    try {
      const response = await campaignService.exportRecipients(campaign.uuid);
      const url = window.URL.createObjectURL(response.data as Blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `campaign-${campaign.uuid}-recipients.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Recipients exported!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to export recipients";
      toast.error(errorMessage);
    }
  };

  const handleTestSend = async (campaign: Campaign) => {
    if (!testEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      const response = await testSendMutation.mutateAsync({
        uuid: campaign.uuid,
        email: testEmail,
      });
      if (response.data.status === 1) {
        toast.success("Test email sent!");
        setTestEmail("");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to send test email";
      toast.error(errorMessage);
    }
  };

  const getRecipientStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400";
      case "failed":
        return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400";
      case "bounced":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-700/40 dark:text-slate-300";
    }
  };

  if (campaignsError) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">Failed to load campaigns</div>
          <motion.button
            onClick={() => refetchCampaigns()}
            className="flex items-center space-x-2 mx-auto px-4 py-2 rounded-lg text-white transition-colors"
            style={{
              backgroundColor: brand.colors.primary,
              boxShadow: `0 4px 12px ${brand.colors.primary}25`,
            }}
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
                className="w-8 h-8 border-2 border-slate-300 rounded-full mx-auto mb-4"
                style={{ borderTopColor: brand.colors.primary }}
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
                                  <div className="flex items-center space-x-2">
                                    <Users className="w-4 h-4 text-slate-500" />
                                    <span className="text-xs text-slate-600 dark:text-slate-400">
                                      {formatRecipientCount(
                                        performance.total_sent
                                      )}{" "}
                                      delivered
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-3 text-xs">
                                    <span className="flex items-center space-x-1 text-slate-600 dark:text-slate-400">
                                      <Eye className="w-3.5 h-3.5" />
                                      <span>
                                        {formatRecipientCount(campaign.opens)} (
                                        {campaign.open_rate}%)
                                      </span>
                                    </span>
                                    <span className="flex items-center space-x-1 text-slate-600 dark:text-slate-400">
                                      <MousePointer className="w-3.5 h-3.5" />
                                      <span>
                                        {formatRecipientCount(campaign.clicks)}{" "}
                                        ({campaign.click_rate}%)
                                      </span>
                                    </span>
                                  </div>
                                </div>
                              ) : campaign.status === "failed" ? (
                                <div className="space-y-1">
                                  <div className="flex items-center space-x-2">
                                    <XCircle className="w-4 h-4 text-red-500" />
                                    <span className="text-xs text-red-600 dark:text-red-400">
                                      {formatRecipientCount(
                                        campaign.total_failed
                                      )}{" "}
                                      failed
                                    </span>
                                  </div>
                                  {campaign.total_sent > 0 && (
                                    <div className="text-xs text-slate-600 dark:text-slate-400">
                                      {formatRecipientCount(
                                        campaign.total_sent
                                      )}{" "}
                                      delivered
                                    </div>
                                  )}
                                </div>
                              ) : campaign.status === "sending" ? (
                                <div className="flex items-center space-x-2 text-xs text-amber-600 dark:text-amber-400">
                                  <Loader className="w-3.5 h-3.5 animate-spin" />
                                  <span>
                                    {formatRecipientCount(
                                      campaign.total_sent
                                    )}{" "}
                                    / {formatRecipientCount(
                                      campaign.total_recipients
                                    )}{" "}
                                    delivered
                                  </span>
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
                                    {campaign.status === "scheduled" &&
                                    campaign.scheduled_at
                                      ? formatDate(campaign.scheduled_at)
                                      : campaign.sent_at
                                        ? formatDate(campaign.sent_at)
                                        : formatDate(campaign.created_at)}
                                  </span>
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                  {campaign.status === "scheduled" ? (
                                    <span>
                                      {campaign.frequency &&
                                      campaign.frequency !== "once" ? (
                                        <>
                                          <span className="capitalize">
                                            {campaign.frequency}
                                          </span>{" "}
                                          · Next{" "}
                                          {campaign.next_run_at
                                            ? formatDateTime(
                                                campaign.next_run_at
                                              )
                                            : "soon"}
                                        </>
                                      ) : (
                                        `Scheduled ${formatDateTime(
                                          campaign.scheduled_at
                                        )}`
                                      )}
                                    </span>
                                  ) : campaign.status === "sending" ? (
                                    "Sending..."
                                  ) : campaign.sent_at ? (
                                    `Sent ${formatDateTime(campaign.sent_at)}`
                                  ) : campaign.status === "draft" ? (
                                    "Draft"
                                  ) : (
                                    "Failed"
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                {campaign.status !== "draft" && (
                                  <motion.button
                                    onClick={() =>
                                      setRecipientsCampaign(campaign)
                                    }
                                    className="p-2 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    title="View Recipients"
                                  >
                                    <Users className="w-4 h-4" />
                                  </motion.button>
                                )}

                                <motion.button
                                  onClick={() => handlePreview(campaign)}
                                  disabled={previewLoading}
                                  className="p-2 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  title="Preview Email"
                                >
                                  <Eye className="w-4 h-4" />
                                </motion.button>

                                {campaign.status === "draft" && (
                                  <motion.button
                                    onClick={() =>
                                      handleSendCampaign(campaign.uuid)
                                    }
                                    disabled={sendCampaignMutation.isPending}
                                    className="p-2 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    title="Send Campaign"
                                  >
                                    <Send className="w-4 h-4" />
                                  </motion.button>
                                )}

                                {campaign.status === "failed" &&
                                  campaign.total_failed > 0 && (
                                    <motion.button
                                      onClick={() =>
                                        handleRetryCampaign(campaign.uuid)
                                      }
                                      disabled={
                                        retryCampaignMutation.isPending
                                      }
                                      className="p-2 rounded-lg text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      title="Retry Failed Recipients"
                                    >
                                      <RotateCcw className="w-4 h-4" />
                                    </motion.button>
                                  )}

                                <motion.button
                                  onClick={() => handleExport(campaign)}
                                  className="p-2 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  title="Export Recipients"
                                >
                                  <Download className="w-4 h-4" />
                                </motion.button>

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

      {/* Preview Modal */}
      <AnimatePresence>
        {previewCampaign && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setPreviewCampaign(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                    Email Preview
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {previewCampaign.campaign.name} ·{" "}
                    {previewCampaign.subject}
                  </p>
                </div>
                <button
                  onClick={() => setPreviewCampaign(null)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-auto bg-slate-100 dark:bg-slate-900">
                <iframe
                  title="Email preview"
                  srcDoc={previewCampaign.html}
                  className="w-full h-[70vh] bg-white"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recipients Drill-down Modal */}
      <AnimatePresence>
        {recipientsCampaign && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setRecipientsCampaign(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                    Recipients
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {recipientsCampaign.name}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      handleExport(recipientsCampaign);
                      setRecipientsCampaign(null);
                    }}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white transition-colors"
                    style={{ backgroundColor: brand.colors.primary }}
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                  <button
                    onClick={() => setRecipientsCampaign(null)}
                    className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 space-y-4">
                {/* Summary */}
                <div className="flex flex-wrap gap-3">
                  {[
                    { label: "Sent", value: recipientsData?.data.data.summary.sent ?? 0, color: brand.colors.primary },
                    { label: "Opened", value: recipientsData?.data.data.summary.opened ?? 0, color: brand.colors.accent },
                    { label: "Clicked", value: recipientsData?.data.data.summary.clicked ?? 0, color: brand.colors.accent },
                    { label: "Failed", value: recipientsData?.data.data.summary.failed ?? 0, color: "#ef4444" },
                    { label: "Bounced", value: recipientsData?.data.data.summary.bounced ?? 0, color: "#f97316" },
                    { label: "Pending", value: recipientsData?.data.data.summary.pending ?? 0, color: "#64748b" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-100/70 dark:bg-slate-700/40"
                    >
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {s.label}
                      </span>
                      <span
                        className="text-sm font-bold"
                        style={{ color: s.color }}
                      >
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Test send + filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex items-center space-x-2 flex-1">
                    <input
                      type="email"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="test@example.com"
                      className="flex-1 px-3 py-2 bg-slate-100/50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 text-sm"
                    />
                    <motion.button
                      onClick={() => handleTestSend(recipientsCampaign)}
                      disabled={testSendMutation.isPending}
                      className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50"
                      style={{ backgroundColor: brand.colors.primary }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Test Send</span>
                    </motion.button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      value={recipientFilter}
                      onChange={(e) => {
                        setRecipientFilter(e.target.value as any);
                        setRecipientPage(1);
                      }}
                      className="px-3 py-2 bg-slate-100/50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg focus:outline-none text-sm"
                    >
                      <option value="">All statuses</option>
                      <option value="sent">Sent</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                      <option value="bounced">Bounced</option>
                    </select>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={recipientSearch}
                        onChange={(e) => {
                          setRecipientSearch(e.target.value);
                          setRecipientPage(1);
                        }}
                        placeholder="Search email..."
                        className="pl-9 pr-3 py-2 bg-slate-100/50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg focus:outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-auto">
                {recipientsLoading ? (
                  <div className="text-center py-12">
                    <motion.div
                      className="w-8 h-8 border-2 border-slate-300 rounded-full mx-auto mb-4"
                      style={{ borderTopColor: brand.colors.primary }}
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Loading recipients...
                    </p>
                  </div>
                ) : (recipientsData?.data.data.recipients || []).length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      No recipients found.
                    </p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-slate-50/50 dark:bg-slate-700/50 border-b border-slate-200/50 dark:border-slate-600/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300">
                          Opened
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300">
                          Clicked
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 dark:text-slate-300">
                          Error
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/50 dark:divide-slate-600/50">
                      {(recipientsData?.data.data.recipients || []).map(
                        (r: CampaignRecipient) => (
                          <tr
                            key={r.id}
                            className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors"
                          >
                            <td className="px-6 py-3 text-sm font-medium text-slate-800 dark:text-slate-200">
                              {r.email}
                            </td>
                            <td className="px-6 py-3">
                              <span
                                className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getRecipientStatusColor(r.status)}`}
                              >
                                {r.status}
                              </span>
                            </td>
                            <td className="px-6 py-3 text-sm text-slate-600 dark:text-slate-400">
                              {r.opened_at
                                ? formatDateTime(r.opened_at)
                                : "—"}
                            </td>
                            <td className="px-6 py-3 text-sm text-slate-600 dark:text-slate-400">
                              {r.clicked_at
                                ? formatDateTime(r.clicked_at)
                                : "—"}
                            </td>
                            <td className="px-6 py-3 text-sm text-slate-600 dark:text-slate-400 max-w-[180px] truncate">
                              {r.error_message || "—"}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                )}
              </div>

              {recipientsData?.data.data.pagination &&
                recipientsData.data.data.pagination.last_page > 1 && (
                  <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Page {recipientPage} of{" "}
                      {recipientsData.data.data.pagination.last_page}
                    </span>
                    <div className="flex items-center space-x-2">
                      <motion.button
                        onClick={() =>
                          setRecipientPage(Math.max(1, recipientPage - 1))
                        }
                        disabled={recipientPage <= 1}
                        className="p-2 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        onClick={() =>
                          setRecipientPage(
                            Math.min(
                              recipientsData.data.data.pagination.last_page,
                              recipientPage + 1
                            )
                          )
                        }
                        disabled={
                          recipientPage >=
                          recipientsData.data.data.pagination.last_page
                        }
                        className="p-2 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
