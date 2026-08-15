import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Plus,
  Play,
  Pause,
  Trash2,
  Users,
  CheckCircle,
  Clock,
  Mail,
  ArrowRight,
  Loader2,
  Settings,
  MoreVertical,
} from "lucide-react";
import { brand } from "@/constants/brand";
import {
  useAutomations,
  useAutomationStats,
  useCreateAutomation,
  useActivateAutomation,
  usePauseAutomation,
  useDeleteAutomation,
} from "@/hooks/useAutomations";
import { toast } from "react-hot-toast";

const TRIGGER_TYPES = [
  { value: "subscriber_joins", label: "Subscriber Joins", icon: Users, desc: "When a new subscriber joins" },
  { value: "manual", label: "Manual Enroll", icon: Mail, desc: "Manually add subscribers" },
  { value: "date_based", label: "Date Based", icon: Clock, desc: "On a specific date" },
];

const STEP_TYPES = [
  { value: "wait", label: "Wait", desc: "Wait for a period" },
  { value: "send_email", label: "Send Email", desc: "Send an email campaign" },
  { value: "tag", label: "Add Tag", desc: "Add a tag to subscriber" },
  { value: "end", label: "End", desc: "End the automation" },
];

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400",
  active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  paused: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  completed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

export const Automations = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newTrigger, setNewTrigger] = useState("subscriber_joins");
  const [newSteps, setNewSteps] = useState<{ step_type: string; step_config: Record<string, any> }[]>([
    { step_type: "wait", step_config: { duration: 1, unit: "days" } },
    { step_type: "send_email", step_config: { subject: "", campaign_id: null } },
    { step_type: "end", step_config: {} },
  ]);

  const { data: automationsData, isLoading } = useAutomations();
  const { data: statsData } = useAutomationStats();
  const createMutation = useCreateAutomation();
  const activateMutation = useActivateAutomation();
  const pauseMutation = usePauseAutomation();
  const deleteMutation = useDeleteAutomation();

  const automations = (automationsData as any)?.data?.data?.automations?.data || [];
  const stats = (statsData as any)?.data?.data?.stats || {};

  const handleCreate = async () => {
    if (!newName.trim()) {
      toast.error("Please enter a name");
      return;
    }
    try {
      await createMutation.mutateAsync({
        name: newName,
        description: newDesc,
        trigger_type: newTrigger as any,
        steps: newSteps,
      });
      toast.success("Automation created!");
      setShowCreate(false);
      setNewName("");
      setNewDesc("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create");
    }
  };

  const handleToggle = async (automation: any) => {
    try {
      if (automation.status === "active") {
        await pauseMutation.mutateAsync(automation.uuid);
        toast.success("Automation paused");
      } else {
        await activateMutation.mutateAsync(automation.uuid);
        toast.success("Automation activated!");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update");
    }
  };

  const handleDelete = async (uuid: string) => {
    if (!confirm("Delete this automation?")) return;
    try {
      await deleteMutation.mutateAsync(uuid);
      toast.success("Automation deleted");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: brand.colors.primary }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Automations
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Create automated email sequences and drip campaigns
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all hover:shadow-lg"
          style={{ backgroundColor: brand.colors.primary }}
        >
          <Plus className="w-4 h-4" />
          <span>New Automation</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total_automations || 0, icon: Zap, color: brand.colors.primary },
          { label: "Active", value: stats.active_automations || 0, icon: Play, color: "#10B981" },
          { label: "Enrolled", value: stats.total_enrolled || 0, icon: Users, color: "#F59E0B" },
          { label: "Completed", value: stats.total_completed || 0, icon: CheckCircle, color: "#8B5CF6" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-4"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-800 dark:text-slate-100">{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Automations List */}
      <div className="space-y-3">
        {automations.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-12 text-center">
            <Zap className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
              No automations yet
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-500 mb-4">
              Create your first automation to start sending drip campaigns
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-white text-sm font-semibold"
              style={{ backgroundColor: brand.colors.primary }}
            >
              <Plus className="w-4 h-4" />
              <span>Create Automation</span>
            </button>
          </div>
        ) : (
          automations.map((automation: any, i: number) => (
            <motion.div
              key={automation.uuid}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-700/50 p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${brand.colors.primary}15` }}
                  >
                    <Zap className="w-6 h-6" style={{ color: brand.colors.primary }} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                        {automation.name}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[automation.status] || STATUS_COLORS.draft}`}>
                        {automation.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                      {automation.description || "No description"} &middot;{" "}
                      {automation.steps_count || 0} steps &middot;{" "}
                      {automation.active_enrollments_count || 0} active
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggle(automation)}
                    disabled={automation.status === "completed"}
                    className={`p-2 rounded-lg transition-all ${
                      automation.status === "active"
                        ? "text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                        : "text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                    } disabled:opacity-50`}
                    title={automation.status === "active" ? "Pause" : "Activate"}
                  >
                    {automation.status === "active" ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => handleDelete(automation.uuid)}
                    disabled={automation.status === "active"}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCreate(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  New Automation
                </h2>
              </div>

              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2"
                    style={{ focusRingColor: brand.colors.primary }}
                    placeholder="Welcome Series"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 h-20 resize-none"
                    placeholder="Automated welcome sequence for new subscribers"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Trigger
                  </label>
                  <div className="space-y-2">
                    {TRIGGER_TYPES.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setNewTrigger(type.value)}
                        className={`w-full flex items-center space-x-3 p-3 rounded-xl border-2 text-left transition-all ${
                          newTrigger === type.value
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <type.icon className="w-5 h-5 text-slate-500" />
                        <div>
                          <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{type.label}</div>
                          <div className="text-xs text-slate-500">{type.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Steps
                  </label>
                  <div className="space-y-2">
                    {newSteps.map((step, i) => (
                      <div key={i} className="flex items-center space-x-2 p-2 bg-slate-50 dark:bg-slate-750 rounded-lg">
                        <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                          {i + 1}
                        </span>
                        <select
                          value={step.step_type}
                          onChange={(e) => {
                            const updated = [...newSteps];
                            updated[i].step_type = e.target.value;
                            setNewSteps(updated);
                          }}
                          className="flex-1 px-2 py-1 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                        >
                          {STEP_TYPES.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                        {step.step_type === "wait" && (
                          <div className="flex items-center space-x-1">
                            <input
                              type="number"
                              min={1}
                              value={step.step_config.duration || 1}
                              onChange={(e) => {
                                const updated = [...newSteps];
                                updated[i].step_config.duration = Number(e.target.value);
                                setNewSteps(updated);
                              }}
                              className="w-16 px-2 py-1 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                            />
                            <select
                              value={step.step_config.unit || "days"}
                              onChange={(e) => {
                                const updated = [...newSteps];
                                updated[i].step_config.unit = e.target.value;
                                setNewSteps(updated);
                              }}
                              className="px-2 py-1 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                            >
                              <option value="minutes">min</option>
                              <option value="hours">hrs</option>
                              <option value="days">days</option>
                            </select>
                          </div>
                        )}
                        {i > 0 && (
                          <button
                            onClick={() => setNewSteps(newSteps.filter((_, j) => j !== i))}
                            className="p-1 text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => setNewSteps([...newSteps, { step_type: "wait", step_config: { duration: 1, unit: "days" } }])}
                      className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Step</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 p-6 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setShowCreate(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={createMutation.isPending}
                  className="flex items-center space-x-2 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50"
                  style={{ backgroundColor: brand.colors.primary }}
                >
                  {createMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4" />
                  )}
                  <span>Create</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
