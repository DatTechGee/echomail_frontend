/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Plus,
  Search,
  Loader2,
  Edit,
  Trash2,
  Copy,
  X,
  Calendar,
  Save,
  Wand2,
} from "lucide-react";
import { brand } from "@/constants/brand";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-hot-toast";
import {
  useTemplates,
  useCreateTemplate,
  useUpdateTemplate,
  useDeleteTemplate,
} from "@/hooks/useTemplates";
import { formatDate } from "@/utils/campaign";
import type { CampaignTemplate } from "@/types/template";

const Editor = lazy(() => import("@/components/Editor"));

const EditorLoading = () => (
  <div className="min-h-[320px] rounded-2xl border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-center bg-white/50 dark:bg-slate-800/50">
    <div className="flex items-center gap-2 text-slate-500">
      <Loader2 className="w-5 h-5 animate-spin" />
      <span>Loading editor...</span>
    </div>
  </div>
);

export const Templates = () => {
  const navigate = useNavigate();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] =
    useState<CampaignTemplate | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  // API hooks
  const { data: templatesData, isLoading } = useTemplates();
  const createMutation = useCreateTemplate();
  const updateMutation = useUpdateTemplate();
  const deleteMutation = useDeleteTemplate();

  const templates = templatesData?.data.data.templates || [];

  const filteredTemplates = templates.filter(
    (t) =>
      !searchQuery ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openCreateModal = () => {
    setEditingTemplate(null);
    setName("");
    setSubject("");
    setContent("");
    setModalOpen(true);
  };

  const openEditModal = (template: CampaignTemplate) => {
    setEditingTemplate(template);
    setName(template.name);
    setSubject(template.subject);
    setContent(template.content || "");
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim() || name.trim().length < 3) {
      toast.error("Template name must be at least 3 characters");
      return;
    }
    if (!subject.trim() || subject.trim().length < 3) {
      toast.error("Subject must be at least 3 characters");
      return;
    }
    if (!content.trim() || content.trim().length < 10) {
      toast.error("Template content is required");
      return;
    }

    setSaving(true);
    try {
      if (editingTemplate) {
        const response = await updateMutation.mutateAsync({
          uuid: editingTemplate.uuid,
          data: { name, subject, content },
        });
        if (response.data.status === 1) {
          toast.success("Template updated successfully!");
          setModalOpen(false);
        }
      } else {
        const response = await createMutation.mutateAsync({
          name,
          subject,
          content,
        });
        if (response.data.status === 1) {
          toast.success("Template created successfully!");
          setModalOpen(false);
        }
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to save template"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (template: CampaignTemplate) => {
    if (!confirm(`Delete template "${template.name}"? This cannot be undone.`)) {
      return;
    }
    try {
      const response = await deleteMutation.mutateAsync(template.uuid);
      if (response.data.status === 1) {
        toast.success("Template deleted successfully!");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to delete template"
      );
    }
  };

  const handleUseTemplate = (template: CampaignTemplate) => {
    navigate({
      to: `/create-campaigns?template=${template.uuid}`,
    });
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
            Templates
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Reusable email templates for your campaigns
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-100/50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
              style={
                {
                  "--tw-ring-color": `${brand.colors.primary}50`,
                } as React.CSSProperties
              }
            />
          </div>

          <motion.button
            onClick={openCreateModal}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              background: `linear-gradient(135deg, ${brand.colors.primary}, ${brand.colors.primary}dd)`,
              boxShadow: `0 4px 12px ${brand.colors.primary}25`,
            }}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-5 h-5" />
            <span>New Template</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Personalization Guide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden"
      >
        <div
          className="h-1.5"
          style={{
            background: `linear-gradient(90deg, ${brand.colors.primary}, ${brand.colors.accent})`,
          }}
        />
        <div className="p-6">
          <div className="flex items-center gap-3 mb-1">
            <div
              className="p-2.5 rounded-xl"
              style={{
                backgroundColor: `${brand.colors.primary}10`,
                color: brand.colors.primary,
              }}
            >
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Personalize your emails
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Type a code anywhere in the subject or body and it will be
                replaced with each recipient's data when the email is sent.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
            {[
              {
                code: "{{first_name}}",
                example: "Sarah",
                description: "The recipient's first name",
              },
              {
                code: "{{last_name}}",
                example: "Johnson",
                description: "The recipient's last name",
              },
              {
                code: "{{full_name}}",
                example: "Sarah Johnson",
                description: "The recipient's full name",
              },
              {
                code: "{{email}}",
                example: "sarah@example.com",
                description: "The recipient's email address",
              },
            ].map((item) => (
              <div
                key={item.code}
                className="rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-700/40 p-4"
              >
                <code
                  className="text-xs font-semibold px-2 py-1 rounded-md"
                  style={{
                    backgroundColor: `${brand.colors.primary}10`,
                    color: brand.colors.primary,
                  }}
                >
                  {item.code}
                </code>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-3">
                  {item.description}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  e.g. <span className="text-slate-600 dark:text-slate-300">{item.example}</span>
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-dashed border-slate-300/70 dark:border-slate-600/70 bg-slate-50/40 dark:bg-slate-700/30 px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
            Tip: You can combine codes, like{" "}
            <code className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-xs">
              {"Hi {{first_name}}, thanks for subscribing!"}
            </code>{" "}
            which sends as{" "}
            <span className="font-medium text-slate-800 dark:text-slate-100">
              {"Hi Sarah, thanks for subscribing!"}
            </span>{" "}
            to each recipient.
          </div>
        </div>
      </motion.div>

      {/* Template Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {isLoading ? (
          <div className="text-center py-12">
            <motion.div
              className="w-8 h-8 border-2 border-slate-300 rounded-full mx-auto mb-4"
              style={{ borderTopColor: brand.colors.primary }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-slate-600 dark:text-slate-400">
              Loading templates...
            </p>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 text-center py-12">
            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">
              No templates found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {searchQuery
                ? "Try adjusting your search criteria."
                : "Create your first template to reuse across campaigns!"}
            </p>
            {!searchQuery && (
              <motion.button
                onClick={openCreateModal}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-white transition-all duration-200"
                style={{ backgroundColor: brand.colors.primary }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="w-4 h-4" />
                <span>Create First Template</span>
              </motion.button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredTemplates.map((template, index) => (
                <motion.div
                  key={template.uuid}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden group hover:shadow-xl transition-shadow"
                >
                  <div
                    className="h-1.5"
                    style={{
                      background: `linear-gradient(90deg, ${brand.colors.primary}, ${brand.colors.accent})`,
                    }}
                  />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="p-2.5 rounded-xl"
                        style={{
                          backgroundColor: `${brand.colors.primary}10`,
                          color: brand.colors.primary,
                        }}
                      >
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex items-center space-x-1">
                        <motion.button
                          onClick={() => openEditModal(template)}
                          className="p-2 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title="Edit Template"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDelete(template)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title="Delete Template"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>

                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1 truncate">
                      {template.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 truncate">
                      {template.subject}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                      <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(template.created_at)}</span>
                      </div>

                      <motion.button
                        onClick={() => handleUseTemplate(template)}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200"
                        style={{
                          background: `linear-gradient(135deg, ${brand.colors.primary}, ${brand.colors.primary}dd)`,
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Copy className="w-4 h-4" />
                        <span>Use Template</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-2xl pointer-events-auto">
                <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 bg-white dark:bg-slate-800 z-10">
                  <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                    {editingTemplate ? "Edit Template" : "Create Template"}
                  </h2>
                  <motion.button
                    onClick={() => setModalOpen(false)}
                    className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                <div className="p-6 space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Template Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Weekly Newsletter Template"
                      className="w-full px-4 py-3 bg-white/80 dark:bg-slate-700/80 border border-slate-200/50 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
                      style={
                        {
                          "--tw-ring-color": `${brand.colors.primary}50`,
                        } as React.CSSProperties
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Email Subject *
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Enter the subject line"
                      className="w-full px-4 py-3 bg-white/80 dark:bg-slate-700/80 border border-slate-200/50 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
                      style={
                        {
                          "--tw-ring-color": `${brand.colors.primary}50`,
                        } as React.CSSProperties
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Content *
                    </label>
                    <Suspense fallback={<EditorLoading />}>
                      <div className="min-h-[320px] rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-800">
                        <Editor
                          initialContent={content}
                          onChange={setContent}
                          onEditorReady={() => {}}
                        />
                      </div>
                    </Suspense>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 p-6 border-t border-slate-200/50 dark:border-slate-700/50">
                  <motion.button
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl font-medium border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center space-x-2 px-6 py-2 rounded-xl font-bold text-white transition-all duration-200 disabled:opacity-50"
                    style={{
                      background: `linear-gradient(135deg, ${brand.colors.primary}, ${brand.colors.primary}dd)`,
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>
                      {saving ? "Saving..." : "Save Template"}
                    </span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
