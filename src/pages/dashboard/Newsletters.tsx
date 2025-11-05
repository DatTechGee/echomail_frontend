/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Link2,
  Copy,
  Check,
  Search,
  Download,
  Trash2,
  Calendar,
  Filter,
  UserPlus,
  Globe,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { brand } from "@/constants/brand";
import {
  useNewsletterSubscribers,
  useBulkDeleteNewsletterSubscribers,
  useDeleteNewsletterSubscriber,
  useExportNewsletterSubscribers,
} from "@/hooks/useNewsletter";
import { SOURCE_OPTIONS, STATUS_OPTIONS } from "@/constants/newsletter";
import {
  getSourceLabel,
  getStatusColor,
  getSubscriberInitials,
  formatSubscriberName,
  formatDate,
  generateShareableLink,
} from "@/utils/newsletter";
import { toast } from "react-hot-toast";
import type {
  GetSubscribersRequest,
  NewsletterSubscriber,
  NewsletterStatus,
  NewsletterSource,
} from "@/types/newsletter";

export const Newsletters = () => {
  // Filter and pagination state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | NewsletterStatus>(
    "all"
  );
  const [sourceFilter, setSourceFilter] = useState<NewsletterSource | "">("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [sortBy, setSortBy] = useState<
    "email" | "name" | "subscribed_at" | "status" | "source" | "phone"
  >("subscribed_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // UI state
  const [copySuccess, setCopySuccess] = useState(false);
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);

  // Build query parameters
  const queryParams: GetSubscribersRequest = {
    search: searchQuery || undefined,
    status: statusFilter === "all" ? undefined : statusFilter,
    source: sourceFilter || undefined,
    page: currentPage,
    per_page: perPage,
    sort_by: sortBy,
    sort_order: sortOrder,
  };

  // API hooks
  const {
    data: subscribersData,
    isLoading,
    error,
    refetch,
  } = useNewsletterSubscribers(queryParams);

  const deleteSubscriberMutation = useDeleteNewsletterSubscriber();
  const bulkDeleteMutation = useBulkDeleteNewsletterSubscribers();
  const exportMutation = useExportNewsletterSubscribers();

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sourceFilter, sortBy, sortOrder]);

  // Reset selected items when data changes
  useEffect(() => {
    setSelectedSubscribers([]);
  }, [subscribersData]);

  const subscribers = subscribersData?.data.data.subscribers || [];
  const pagination = subscribersData?.data.data.pagination;
  const stats = subscribersData?.data.data.stats;

  const shareableLink = generateShareableLink();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copy link");
    }
  };

  const handleSelectSubscriber = (uuid: string) => {
    setSelectedSubscribers((prev) =>
      prev.includes(uuid) ? prev.filter((id) => id !== uuid) : [...prev, uuid]
    );
  };

  const handleSelectAll = () => {
    if (
      selectedSubscribers.length === subscribers.length &&
      subscribers.length > 0
    ) {
      setSelectedSubscribers([]);
    } else {
      setSelectedSubscribers(subscribers.map((s) => s.uuid));
    }
  };

  const handleDeleteSubscriber = async (uuid: string) => {
    try {
      await deleteSubscriberMutation.mutateAsync(uuid);
      toast.success("Subscriber deleted successfully");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete subscriber";
      toast.error(errorMessage);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedSubscribers.length === 0) return;

    try {
      const response = await bulkDeleteMutation.mutateAsync({
        subscriber_ids: selectedSubscribers,
      });
      toast.success(
        `Successfully deleted ${response.data.data.deleted_count} subscriber(s)`
      );
      setSelectedSubscribers([]);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete subscribers";
      toast.error(errorMessage);
    }
  };

  const handleExport = async (format: "csv" | "json" = "csv") => {
    try {
      const response = await exportMutation.mutateAsync({
        status: statusFilter === "all" ? undefined : statusFilter,
        source: sourceFilter || undefined,
        format,
      });

      if (format === "csv") {
        // Handle blob response for CSV
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "newsletter-subscribers.csv");
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        // Handle JSON response
        const jsonData = JSON.stringify(
          response.data.data.subscribers,
          null,
          2
        );
        const blob = new Blob([jsonData], { type: "application/json" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "newsletter-subscribers.json");
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }

      toast.success("Export completed successfully");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to export data";
      toast.error(errorMessage);
    }
  };

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            Failed to load newsletter data
          </div>
          <motion.button
            onClick={() => refetch()}
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
            WaitList Subscribers (Newsletter)
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage your WaitList Subscribers and share your signup link
          </p>
        </div>

        {/* Stats */}
        <div className="flex space-x-4">
          <div className="text-center">
            <div
              className="text-2xl font-bold"
              style={{ color: brand.colors.primary }}
            >
              {stats?.active || 0}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Active
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              {stats?.total || 0}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Total
            </div>
          </div>
        </div>
      </div>

      {/* Share Link Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50" />

        <div className="relative p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${brand.colors.primary}20` }}
            >
              <Globe
                className="w-5 h-5"
                style={{ color: brand.colors.primary }}
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Newsletter Signup Link
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Share this link to let people subscribe to your newsletter
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-slate-50/50 dark:bg-slate-700/50 rounded-xl border border-slate-200/50 dark:border-slate-600/50">
            <Link2 className="w-5 h-5 text-slate-400" />
            <div className="flex-1 font-mono text-sm text-slate-700 dark:text-slate-300 truncate">
              {shareableLink}
            </div>
            <motion.button
              onClick={handleCopyLink}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-white transition-all duration-200"
              style={{ backgroundColor: brand.colors.primary }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {copySuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Filters and Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
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
                  placeholder="Search subscribers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-100/50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
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
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="pl-10 pr-8 py-2 bg-slate-100/50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 text-slate-800 dark:text-slate-200 appearance-none"
                  style={
                    {
                      "--tw-ring-color": `${brand.colors.primary}50`,
                    } as React.CSSProperties
                  }
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value as any)}
                  className="px-3 py-2 bg-slate-100/50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 text-slate-800 dark:text-slate-200 appearance-none"
                  style={
                    {
                      "--tw-ring-color": `${brand.colors.primary}50`,
                    } as React.CSSProperties
                  }
                >
                  {SOURCE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {selectedSubscribers.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={handleBulkDelete}
                  disabled={bulkDeleteMutation.isPending}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>
                    {bulkDeleteMutation.isPending
                      ? "Deleting..."
                      : `Delete (${selectedSubscribers.length})`}
                  </span>
                </motion.button>
              )}

              <motion.button
                onClick={() => handleExport("csv")}
                disabled={exportMutation.isPending}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="w-4 h-4" />
                <span>
                  {exportMutation.isPending ? "Exporting..." : "Export CSV"}
                </span>
              </motion.button>

              <motion.button
                onClick={() => refetch()}
                disabled={isLoading}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RefreshCw
                  className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Subscribers Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50" />

        <div className="relative overflow-hidden rounded-2xl">
          {isLoading ? (
            <div className="text-center py-12">
              <motion.div
                className="w-8 h-8 border-2 border-slate-300 border-t-blue-500 rounded-full mx-auto mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="text-slate-600 dark:text-slate-400">
                Loading subscribers...
              </p>
            </div>
          ) : subscribers.length === 0 ? (
            <div className="text-center py-12">
              <UserPlus className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">
                No subscribers found
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {searchQuery || statusFilter !== "all" || sourceFilter
                  ? "Try adjusting your search or filter criteria."
                  : "Share your newsletter link to get your first subscribers!"}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50/50 dark:bg-slate-700/50 border-b border-slate-200/50 dark:border-slate-600/50">
                    <tr>
                      <th className="px-6 py-4 text-left">
                        <input
                          type="checkbox"
                          checked={
                            selectedSubscribers.length === subscribers.length &&
                            subscribers.length > 0
                          }
                          onChange={handleSelectAll}
                          className="w-4 h-4 rounded focus:ring-2"
                          style={{ accentColor: brand.colors.primary }}
                        />
                      </th>
                      <th
                        className="px-6 py-4 text-left text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer hover:text-slate-900 dark:hover:text-slate-100"
                        onClick={() => handleSort("email")}
                      >
                        Subscriber
                        {sortBy === "email" && (
                          <span className="ml-1">
                            {sortOrder === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </th>
                      <th
                        className="px-6 py-4 text-left text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer hover:text-slate-900 dark:hover:text-slate-100"
                        onClick={() => handleSort("phone")}
                      >
                        Phone
                        {sortBy === "phone" && (
                          <span className="ml-1">
                            {sortOrder === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </th>
                      <th
                        className="px-6 py-4 text-left text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer hover:text-slate-900 dark:hover:text-slate-100"
                        onClick={() => handleSort("subscribed_at")}
                      >
                        Subscribed
                        {sortBy === "subscribed_at" && (
                          <span className="ml-1">
                            {sortOrder === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </th>
                      <th
                        className="px-6 py-4 text-left text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer hover:text-slate-900 dark:hover:text-slate-100"
                        onClick={() => handleSort("status")}
                      >
                        Status
                        {sortBy === "status" && (
                          <span className="ml-1">
                            {sortOrder === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </th>
                      <th
                        className="px-6 py-4 text-left text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer hover:text-slate-900 dark:hover:text-slate-100"
                        onClick={() => handleSort("source")}
                      >
                        Source
                        {sortBy === "source" && (
                          <span className="ml-1">
                            {sortOrder === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-medium text-slate-700 dark:text-slate-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/50 dark:divide-slate-600/50">
                    <AnimatePresence>
                      {subscribers.map(
                        (subscriber: NewsletterSubscriber, index: number) => (
                          <motion.tr
                            key={subscriber.uuid}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                checked={selectedSubscribers.includes(
                                  subscriber.uuid
                                )}
                                onChange={() =>
                                  handleSelectSubscriber(subscriber.uuid)
                                }
                                className="w-4 h-4 rounded focus:ring-2"
                                style={{ accentColor: brand.colors.primary }}
                              />
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                <div
                                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                                  style={{
                                    backgroundColor: brand.colors.primary,
                                  }}
                                >
                                  {getSubscriberInitials(subscriber)}
                                </div>
                                <div>
                                  <div className="font-medium text-slate-800 dark:text-slate-200">
                                    {formatSubscriberName(subscriber)}
                                  </div>
                                  <div className="text-sm text-slate-600 dark:text-slate-400">
                                    {subscriber.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                              {subscriber.phone || "N/A"}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {formatDate(subscriber.subscribed_at)}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscriber.status)}`}
                              >
                                {subscriber.status === "active"
                                  ? "Active"
                                  : "Unsubscribed"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                              {getSourceLabel(subscriber.source)}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <motion.button
                                onClick={() =>
                                  handleDeleteSubscriber(subscriber.uuid)
                                }
                                disabled={deleteSubscriberMutation.isPending}
                                className="p-2 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>
                            </td>
                          </motion.tr>
                        )
                      )}
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
