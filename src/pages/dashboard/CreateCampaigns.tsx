/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, Suspense, lazy, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Send,
  Plus,
  X,
  Save,
  Loader2,
  ArrowLeft,
  Tag,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Calendar,
  Clock,
  LayoutTemplate,
} from "lucide-react";
import { BlockNoteEditor } from "@blocknote/core";
import { brand } from "@/constants/brand";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { toast } from "react-hot-toast";
import { useCreateCampaign, useCampaign } from "@/hooks/useCampaigns";
import { useTemplate, useTemplates } from "@/hooks/useTemplates";
import { useContactGroups } from "@/hooks/useContacts";
import { campaignService } from "@/services/api/campaign.services";
import {
  RECIPIENT_MODE_OPTIONS,
  CAMPAIGN_TABS,
  FREQUENCY_OPTIONS,
} from "@/constants/campaign";
import {
  validateCampaignName,
  validateCampaignSubject,
  validateCampaignContent,
  validateEmailList,
  calculateEstimatedSendTime,
  formatRecipientCount,
} from "@/utils/campaign";
import type {
  RecipientType,
  RecipientConfig,
  CampaignFrequency,
} from "@/types/campaign";
import { EmailPreview } from "@/components/EmailPreview";

// Lazy load the Editor component
const Editor = lazy(() => import("@/components/Editor"));

interface Recipient {
  id: string;
  email: string;
  name?: string;
  source: "manual" | "newsletter" | "contacts";
}

const EditorLoading = () => (
  <div className="min-h-[400px] rounded-2xl border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-center bg-white/50 dark:bg-slate-800/50">
    <div className="flex items-center gap-2 text-slate-500">
      <Loader2 className="w-5 h-5 animate-spin" />
      <span>Loading editor...</span>
    </div>
  </div>
);

export const CreateCampaigns = () => {
  const [editorRef, setEditorRef] = useState<BlockNoteEditor | null>(null);
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false });
  const duplicateUuid = searchParams?.duplicate as string;
  const templateUuid = searchParams?.template as string;

  // Form state
  const [campaignName, setCampaignName] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Scheduling state
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");
  const [frequency, setFrequency] = useState<CampaignFrequency>("once");
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);

  // Recipient targeting
  const [recipientMode, setRecipientMode] = useState<RecipientType>("all");
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [manualRecipients, setManualRecipients] = useState<Recipient[]>([]);
  const [currentEmail, setCurrentEmail] = useState("");

  // UI state
  const [activeTab, setActiveTab] = useState<"compose" | "recipients">(
    "compose"
  );

  // Recipient preview state
  const [recipientCount, setRecipientCount] = useState(0);
  const [previewEmails, setPreviewEmails] = useState<string[]>([]);
  const [previewLoading, setPreviewLoading] = useState(false);

  // Form validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // API hooks
  const createCampaignMutation = useCreateCampaign();
  const { data: groupsData } = useContactGroups();
  const { data: duplicateCampaignData } = useCampaign(duplicateUuid!, {
    enabled: !!duplicateUuid,
  });
  const { data: templateData } = useTemplate(templateUuid, {
    enabled: !!templateUuid,
  });
  const { data: templatesData } = useTemplates();

  const availableGroups = groupsData?.data.data.groups || [];
  const availableTemplates = templatesData?.data.data.templates || [];

  // Load template data
  useEffect(() => {
    if (templateUuid && templateData?.data.data.template) {
      const template = templateData.data.data.template;
      setCampaignName(template.name);
      setSubject(template.subject);
      setContent(template.content || "");
      toast.success("Template loaded!");
    }
  }, [templateUuid, templateData]);

  // Load duplicate campaign data
  useEffect(() => {
    if (duplicateCampaignData?.data.data.campaign) {
      const campaign = duplicateCampaignData.data.data.campaign;
      setCampaignName(campaign.name + " (Copy)");
      setSubject(campaign.subject);
      setContent(campaign.content || "");

      if (campaign.recipient_config) {
        setRecipientMode(campaign.recipient_config.type);
        setSelectedGroups(campaign.recipient_config.groups || []);

        if (campaign.recipient_config.manual_emails) {
          const recipients = campaign.recipient_config.manual_emails.map(
            (email, index) => ({
              id: `manual-${index}`,
              email,
              source: "manual" as const,
            })
          );
          setManualRecipients(recipients);
        }
      }
    }
  }, [duplicateCampaignData]);

  // Debounced recipient preview function
  const getRecipientPreview = useCallback(async (config: RecipientConfig) => {
    setPreviewLoading(true);
    try {
      const response = await campaignService.getRecipientPreview({
        recipient_config: config,
      });

      if (response.data.status === 1) {
        setRecipientCount(response.data.data.total_count);
        setPreviewEmails(response.data.data.recipients.slice(0, 10));
      }
    } catch (error) {
      // Silently fail for preview
      setRecipientCount(0);
      setPreviewEmails([]);
    } finally {
      setPreviewLoading(false);
    }
  }, []);

  // Get recipient preview with debouncing
  useEffect(() => {
    const config: RecipientConfig = {
      type: recipientMode,
      groups: recipientMode === "groups" ? selectedGroups : undefined,
      manual_emails:
        recipientMode === "manual"
          ? manualRecipients.map((r) => r.email)
          : undefined,
    };

    // Don't call API if no meaningful configuration
    if (recipientMode === "groups" && selectedGroups.length === 0) {
      setRecipientCount(0);
      setPreviewEmails([]);
      return;
    }

    if (recipientMode === "manual" && manualRecipients.length === 0) {
      setRecipientCount(0);
      setPreviewEmails([]);
      return;
    }

    // Debounce the API call
    const timeoutId = setTimeout(() => {
      getRecipientPreview(config);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [recipientMode, selectedGroups, manualRecipients, getRecipientPreview]);

  const handleEditorReady = useCallback((editor: BlockNoteEditor) => {
    setEditorRef(editor);
  }, []);

  const handleContentChange = useCallback(
    (newContent: string) => {
      setContent(newContent);
      if (errors.content) {
        setErrors((prev) => ({ ...prev, content: "" }));
      }
    },
    [errors.content]
  );

  const handleFileUpload = async (file: File): Promise<string> => {
    // In a real implementation, upload to your server/storage
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(URL.createObjectURL(file));
      }, 1000);
    });
  };

  const addManualRecipient = () => {
    if (!currentEmail.trim()) return;

    const { valid, invalid } = validateEmailList([currentEmail.trim()]);

    if (invalid.length > 0) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (manualRecipients.find((r) => r.email === valid[0])) {
      toast.error("Email already added");
      return;
    }

    const newRecipient: Recipient = {
      id: Date.now().toString(),
      email: valid[0],
      source: "manual",
    };
    setManualRecipients([...manualRecipients, newRecipient]);
    setCurrentEmail("");
  };

  const removeManualRecipient = (id: string) => {
    setManualRecipients(manualRecipients.filter((r) => r.id !== id));
  };

  const toggleGroup = (group: string) => {
    setSelectedGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validateCampaignName(campaignName)) {
      newErrors.name = "Campaign name must be between 3 and 255 characters";
    }

    if (!validateCampaignSubject(subject)) {
      newErrors.subject = "Email subject must be between 3 and 255 characters";
    }

    if (!validateCampaignContent(content)) {
      newErrors.content = "Email content is required (minimum 10 characters)";
    }

    if (recipientCount === 0) {
      newErrors.recipients = "Please select at least one recipient";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSend = async (sendImmediately = true) => {
    if (!validateForm()) {
      toast.error("Please fix the errors before sending");
      return;
    }

    if (scheduleEnabled && !scheduledAt) {
      toast.error("Please choose a date and time to schedule the campaign");
      return;
    }

    setIsLoading(true);

    try {
      const recipientConfig: RecipientConfig = {
        type: recipientMode,
        groups: recipientMode === "groups" ? selectedGroups : undefined,
        manual_emails:
          recipientMode === "manual"
            ? manualRecipients.map((r) => r.email)
            : undefined,
      };

      const payload: any = {
        name: campaignName,
        subject: subject,
        content: content,
        recipient_config: recipientConfig,
        send_immediately: sendImmediately && !scheduleEnabled,
      };

      if (scheduleEnabled) {
        payload.scheduled_at = new Date(scheduledAt).toISOString();
        payload.frequency = frequency;
      }

      const response = await createCampaignMutation.mutateAsync(payload);

      if (response.data.status === 1) {
        if (scheduleEnabled) {
          toast.success(
            frequency && frequency !== "once"
              ? `Campaign scheduled to repeat ${frequency}!`
              : "Campaign scheduled successfully!"
          );
        } else {
          toast.success(
            sendImmediately
              ? "Campaign created and queued for sending!"
              : "Campaign saved as draft successfully!"
          );
        }
        navigate({ to: "/campaigns" });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create campaign";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate({ to: "/campaigns" });
  };

  const loadTemplate = (template: any) => {
    setCampaignName(template.name);
    setSubject(template.subject);
    setContent(template.content || "");
    setTemplatePickerOpen(false);
    setActiveTab("compose");
    toast.success("Template loaded!");
  };

  const refreshPreview = () => {
    const config: RecipientConfig = {
      type: recipientMode,
      groups: recipientMode === "groups" ? selectedGroups : undefined,
      manual_emails:
        recipientMode === "manual"
          ? manualRecipients.map((r) => r.email)
          : undefined,
    };
    getRecipientPreview(config);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoBack}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </motion.button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              Create Campaign
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Create and send email campaigns to your audience
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSend(false)}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl font-medium border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>Save Draft</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSend(true)}
            disabled={
              isLoading || !campaignName || !subject || recipientCount === 0
            }
            className="flex items-center space-x-2 px-6 py-2 rounded-xl font-bold text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: `linear-gradient(135deg, ${brand.colors.primary}, ${brand.colors.primary}dd)`,
              boxShadow: `0 4px 12px ${brand.colors.primary}25`,
            }}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : scheduleEnabled ? (
              <Calendar className="w-4 h-4" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>
              {isLoading
                ? "Sending..."
                : scheduleEnabled
                  ? "Schedule Campaign"
                  : "Send Campaign"}
            </span>
          </motion.button>
        </div>
      </motion.div>

      {/* Estimated Send Time */}
      {recipientCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center space-x-2 p-3 bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl"
        >
          <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm text-blue-800 dark:text-blue-300">
            Estimated send time: {calculateEstimatedSendTime(recipientCount)}{" "}
            for {formatRecipientCount(recipientCount)} recipients
          </span>
        </motion.div>
      )}

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex space-x-1 bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-xl"
      >
        {CAMPAIGN_TABS.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
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
            <span>
              {tab.label}
              {tab.id === "recipients" &&
                ` (${formatRecipientCount(recipientCount)})`}
            </span>
          </motion.button>
        ))}
      </motion.div>

      {/* Content */}
      <div className="relative">
        <div className="absolute inset-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50" />

        <div className="relative p-6">
          <AnimatePresence mode="wait">
            {activeTab === "compose" && (
              <motion.div
                key="compose"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Campaign Details */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                      Campaign Details
                    </h2>
                    <motion.button
                      onClick={() => setTemplatePickerOpen(true)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                      style={{
                        backgroundColor: `${brand.colors.primary}10`,
                        color: brand.colors.primary,
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <LayoutTemplate className="w-4 h-4" />
                      <span>Load Template</span>
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Campaign Name *
                      </label>
                      <input
                        type="text"
                        value={campaignName}
                        onChange={(e) => {
                          setCampaignName(e.target.value);
                          if (errors.name) {
                            setErrors((prev) => ({ ...prev, name: "" }));
                          }
                        }}
                        placeholder="e.g., Weekly Newsletter #1"
                        className={`w-full px-4 py-3 bg-white/80 dark:bg-slate-700/80 border rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 ${
                          errors.name
                            ? "border-red-300 dark:border-red-600"
                            : "border-slate-200/50 dark:border-slate-600/50"
                        }`}
                        style={
                          {
                            "--tw-ring-color": `${brand.colors.primary}50`,
                          } as React.CSSProperties
                        }
                      />
                      {errors.name && (
                        <p className="text-sm text-red-600 dark:text-red-400">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Email Subject *
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => {
                          setSubject(e.target.value);
                          if (errors.subject) {
                            setErrors((prev) => ({ ...prev, subject: "" }));
                          }
                        }}
                        placeholder="Enter your email subject line"
                        className={`w-full px-4 py-3 bg-white/80 dark:bg-slate-700/80 border rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 ${
                          errors.subject
                            ? "border-red-300 dark:border-red-600"
                            : "border-slate-200/50 dark:border-slate-600/50"
                        }`}
                        style={
                          {
                            "--tw-ring-color": `${brand.colors.primary}50`,
                          } as React.CSSProperties
                        }
                      />
                      {errors.subject && (
                        <p className="text-sm text-red-600 dark:text-red-400">
                          {errors.subject}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Email Content */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                    Email Content *
                  </h2>

                  <Suspense fallback={<EditorLoading />}>
                    <div
                      className={`min-h-[400px] rounded-2xl overflow-hidden border bg-white dark:bg-slate-800 ${
                        errors.content
                          ? "border-red-300 dark:border-red-600"
                          : "border-slate-200/50 dark:border-slate-700/50"
                      }`}
                    >
                      <Editor
                        initialContent={content}
                        onChange={handleContentChange}
                        uploadFile={handleFileUpload}
                        onEditorReady={handleEditorReady}
                      />
                    </div>
                  </Suspense>
                  {errors.content && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {errors.content}
                    </p>
                  )}
                </div>

                {/* Email Preview */}
                <EmailPreview
                  subject={subject}
                  content={content}
                />

                {/* Scheduling */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                    Scheduling
                  </h2>

                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={() => setScheduleEnabled(false)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 border-2 ${
                        !scheduleEnabled
                          ? "border-opacity-100"
                          : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                      }`}
                      style={{
                        borderColor: !scheduleEnabled
                          ? brand.colors.primary
                          : undefined,
                        color: !scheduleEnabled
                          ? brand.colors.primary
                          : undefined,
                        backgroundColor: !scheduleEnabled
                          ? `${brand.colors.primary}10`
                          : "transparent",
                      }}
                    >
                      <Send className="w-4 h-4" />
                      <span>Send Immediately</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setScheduleEnabled(true)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 border-2 ${
                        scheduleEnabled
                          ? "border-opacity-100"
                          : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                      }`}
                      style={{
                        borderColor: scheduleEnabled
                          ? brand.colors.primary
                          : undefined,
                        color: scheduleEnabled
                          ? brand.colors.primary
                          : undefined,
                        backgroundColor: scheduleEnabled
                          ? `${brand.colors.primary}10`
                          : "transparent",
                      }}
                    >
                      <Clock className="w-4 h-4" />
                      <span>Schedule for Later</span>
                    </button>
                  </div>

                  {/* Action buttons for scheduling section */}
                  <div className="flex items-center space-x-3 pt-2">
                    {!scheduleEnabled ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSend(true)}
                        disabled={
                          isLoading || !campaignName || !subject || recipientCount === 0
                        }
                        className="flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          background: `linear-gradient(135deg, ${brand.colors.primary}, ${brand.colors.primary}dd)`,
                          boxShadow: `0 4px 12px ${brand.colors.primary}25`,
                        }}
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        <span>{isLoading ? "Sending..." : "Send Now"}</span>
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSend(true)}
                        disabled={
                          isLoading || !campaignName || !subject || recipientCount === 0 || !scheduledAt
                        }
                        className="flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          background: `linear-gradient(135deg, ${brand.colors.primary}, ${brand.colors.primary}dd)`,
                          boxShadow: `0 4px 12px ${brand.colors.primary}25`,
                        }}
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Calendar className="w-4 h-4" />
                        )}
                        <span>{isLoading ? "Scheduling..." : "Schedule Campaign"}</span>
                      </motion.button>
                    )}
                  </div>

                  {scheduleEnabled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                          Send Date &amp; Time *
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="datetime-local"
                            value={scheduledAt}
                            onChange={(e) => setScheduledAt(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-slate-700/80 border border-slate-200/50 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
                            style={
                              {
                                "--tw-ring-color": `${brand.colors.primary}50`,
                              } as React.CSSProperties
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                          Repeat
                        </label>
                        <select
                          value={frequency}
                          onChange={(e) =>
                            setFrequency(e.target.value as CampaignFrequency)
                          }
                          className="w-full px-4 py-3 bg-white/80 dark:bg-slate-700/80 border border-slate-200/50 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 appearance-none"
                          style={
                            {
                              "--tw-ring-color": `${brand.colors.primary}50`,
                            } as React.CSSProperties
                          }
                        >
                          {FREQUENCY_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        {frequency !== "once" && (
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Repeats {frequency} starting from the selected time.
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "recipients" && (
              <motion.div
                key="recipients"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                    Select Recipients
                  </h2>
                  <motion.button
                    onClick={refreshPreview}
                    disabled={previewLoading}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${previewLoading ? "animate-spin" : ""}`}
                    />
                    <span className="text-sm">Refresh</span>
                  </motion.button>
                </div>

                {/* Recipient Mode Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {RECIPIENT_MODE_OPTIONS.map((mode) => (
                    <motion.button
                      key={mode.id}
                      onClick={() => setRecipientMode(mode.id)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        recipientMode === mode.id
                          ? "border-opacity-100 shadow-lg"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                      }`}
                      style={{
                        borderColor:
                          recipientMode === mode.id
                            ? brand.colors.primary
                            : undefined,
                        backgroundColor:
                          recipientMode === mode.id
                            ? `${brand.colors.primary}10`
                            : "transparent",
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div
                          className="p-2 rounded-lg"
                          style={{
                            backgroundColor:
                              recipientMode === mode.id
                                ? `${brand.colors.primary}20`
                                : "#f1f5f9",
                            color:
                              recipientMode === mode.id
                                ? brand.colors.primary
                                : "#64748b",
                          }}
                        >
                          <mode.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                            {mode.title}
                          </h3>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {recipientMode === mode.id
                              ? previewLoading
                                ? "Loading..."
                                : `${formatRecipientCount(recipientCount)} recipients`
                              : "Click to select"}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {mode.description}
                      </p>
                    </motion.button>
                  ))}
                </div>

                {/* Group Selection */}
                {recipientMode === "groups" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">
                      Select Groups
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                      {availableGroups.map((group) => (
                        <motion.button
                          key={group.name}
                          onClick={() => toggleGroup(group.name)}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            selectedGroups.includes(group.name)
                              ? "text-white shadow-lg"
                              : "text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                          }`}
                          style={{
                            backgroundColor: selectedGroups.includes(group.name)
                              ? brand.colors.primary
                              : "transparent",
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Tag className="w-4 h-4" />
                          <span>{group.name}</span>
                          <span className="text-xs">
                            ({group.contacts_count})
                          </span>
                          {selectedGroups.includes(group.name) && (
                            <CheckCircle className="w-4 h-4" />
                          )}
                        </motion.button>
                      ))}
                    </div>

                    {selectedGroups.length > 0 && previewEmails.length > 0 && (
                      <div className="mt-4 p-4 bg-slate-50/50 dark:bg-slate-700/50 rounded-xl">
                        <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">
                          Preview Recipients (
                          {formatRecipientCount(recipientCount)} total)
                        </h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {previewEmails.map((email, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-3 text-sm"
                            >
                              <div
                                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                                style={{
                                  backgroundColor: brand.colors.primary,
                                }}
                              >
                                {email[0].toUpperCase()}
                              </div>
                              <span className="text-slate-800 dark:text-slate-200">
                                {email}
                              </span>
                            </div>
                          ))}
                          {recipientCount > 10 && (
                            <div className="text-xs text-slate-500 dark:text-slate-400 pt-2">
                              And {formatRecipientCount(recipientCount - 10)}{" "}
                              more recipients...
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Manual Recipients */}
                {recipientMode === "manual" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-4"
                  >
                    <div>
                      <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-4">
                        Add Recipients Manually
                      </h3>
                      <div className="flex space-x-3">
                        <input
                          type="email"
                          value={currentEmail}
                          onChange={(e) => setCurrentEmail(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" && addManualRecipient()
                          }
                          placeholder="Enter email address"
                          className="flex-1 px-4 py-3 bg-white/80 dark:bg-slate-700/80 border border-slate-200/50 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
                          style={
                            {
                              "--tw-ring-color": `${brand.colors.primary}50`,
                            } as React.CSSProperties
                          }
                        />
                        <motion.button
                          onClick={addManualRecipient}
                          disabled={!currentEmail.trim()}
                          className="px-4 py-3 rounded-xl font-medium text-white transition-all duration-200 disabled:opacity-50"
                          style={{ backgroundColor: brand.colors.primary }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Plus className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>

                    {manualRecipients.length > 0 && (
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        <h4 className="font-medium text-slate-800 dark:text-slate-200">
                          Recipients ({manualRecipients.length})
                        </h4>
                        {manualRecipients.map((recipient) => (
                          <div
                            key={recipient.id}
                            className="flex items-center justify-between p-3 bg-slate-50/50 dark:bg-slate-700/50 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <Mail className="w-4 h-4 text-slate-400" />
                              <span className="text-slate-800 dark:text-slate-200">
                                {recipient.email}
                              </span>
                            </div>
                            <motion.button
                              onClick={() =>
                                removeManualRecipient(recipient.id)
                              }
                              className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <X className="w-4 h-4" />
                            </motion.button>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Recipient Count Display */}
                {recipientCount > 0 && (
                  <div className="mt-6 p-4 bg-green-50/50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="font-medium text-green-800 dark:text-green-300">
                        Ready to send to {formatRecipientCount(recipientCount)}{" "}
                        recipients
                      </span>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                      Estimated delivery time:{" "}
                      {calculateEstimatedSendTime(recipientCount)}
                    </p>
                  </div>
                )}

                {errors.recipients && (
                  <div className="mt-4 p-4 bg-red-50/50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                    <p className="text-sm text-red-800 dark:text-red-300">
                      {errors.recipients}
                    </p>
                  </div>
                )}

                {previewLoading && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                    <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
                      Loading recipients...
                    </span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Template Picker Modal */}
      <AnimatePresence>
        {templatePickerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setTemplatePickerOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-2xl pointer-events-auto">
                <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 bg-white dark:bg-slate-800 z-10">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                      Choose a Template
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Select a template to load into this campaign
                    </p>
                  </div>
                  <motion.button
                    onClick={() => setTemplatePickerOpen(false)}
                    className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                <div className="p-6">
                  {availableTemplates.length === 0 ? (
                    <div className="text-center py-8">
                      <LayoutTemplate className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-600 dark:text-slate-400">
                        No templates yet. Create one in the Templates page.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {availableTemplates.map((template) => (
                        <motion.button
                          key={template.uuid}
                          onClick={() => loadTemplate(template)}
                          className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-all duration-200 text-left"
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className="p-2 rounded-lg"
                              style={{
                                backgroundColor: `${brand.colors.primary}10`,
                                color: brand.colors.primary,
                              }}
                            >
                              <LayoutTemplate className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-medium text-slate-800 dark:text-slate-200">
                                {template.name}
                              </div>
                              <div className="text-sm text-slate-600 dark:text-slate-400">
                                {template.subject}
                              </div>
                            </div>
                          </div>
                          <span
                            className="text-sm font-medium flex-shrink-0"
                            style={{ color: brand.colors.primary }}
                          >
                            Load
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
