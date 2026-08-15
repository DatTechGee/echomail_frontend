import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FlaskConical,
  Plus,
  Trash2,
  Trophy,
  Play,
  BarChart3,
  X,
  Loader2,
} from "lucide-react";
import { brand } from "@/constants/brand";
import {
  useCreateAbTest,
  useStartAbTest,
  useSelectAbTestWinner,
  useDeleteAbTest,
} from "@/hooks/useAbTests";
import { toast } from "react-hot-toast";

interface AbTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignUuid: string;
  campaignSubject: string;
  campaignContent: string;
}

interface Variant {
  subject: string;
  content: string;
}

const VARIANT_COLORS = ["#2563EB", "#10B981", "#F59E0B", "#EF4444"];

export const AbTestModal = ({
  isOpen,
  onClose,
  campaignUuid,
  campaignSubject,
  campaignContent,
}: AbTestModalProps) => {
  const [testType, setTestType] = useState<"subject" | "content">("subject");
  const [testPercentage, setTestPercentage] = useState(20);
  const [variants, setVariants] = useState<Variant[]>([
    { subject: campaignSubject, content: campaignContent },
    { subject: campaignSubject + " - Variation B", content: campaignContent },
  ]);

  const createMutation = useCreateAbTest(campaignUuid);
  const startMutation = useStartAbTest(campaignUuid);
  const winnerMutation = useSelectAbTestWinner(campaignUuid);
  const deleteMutation = useDeleteAbTest(campaignUuid);

  const addVariant = () => {
    if (variants.length >= 4) return;
    setVariants([
      ...variants,
      { subject: campaignSubject, content: campaignContent },
    ]);
  };

  const removeVariant = (index: number) => {
    if (variants.length <= 2) return;
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: "subject" | "content", value: string) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const handleCreate = async () => {
    try {
      await createMutation.mutateAsync({
        test_type: testType,
        test_percentage: testPercentage,
        variants: variants.map((v) => ({
          subject: testType === "subject" ? v.subject : undefined,
          content: testType === "content" ? v.content : undefined,
        })),
      });
      toast.success("A/B test created! Start sending to run the test.");
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create A/B test");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  A/B Test
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Test different versions to find what works best
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Test Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                What to test
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "subject" as const, label: "Subject Line", desc: "Test different subject lines" },
                  { id: "content" as const, label: "Email Content", desc: "Test different email bodies" },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setTestType(type.id)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      testType === type.id
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {type.label}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {type.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Test Percentage */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Test on {testPercentage}% of recipients
              </label>
              <input
                type="range"
                min={10}
                max={50}
                step={5}
                value={testPercentage}
                onChange={(e) => setTestPercentage(Number(e.target.value))}
                className="w-full accent-purple-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>10%</span>
                <span>50%</span>
              </div>
            </div>

            {/* Variants */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Variants ({variants.length}/4)
                </label>
                {variants.length < 4 && (
                  <button
                    onClick={addVariant}
                    className="flex items-center space-x-1 text-sm font-medium text-purple-600 hover:text-purple-700"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Variant</span>
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {variants.map((variant, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-750"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: VARIANT_COLORS[index] }}
                        />
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Variant {String.fromCharCode(65 + index)}
                        </span>
                      </div>
                      {variants.length > 2 && (
                        <button
                          onClick={() => removeVariant(index)}
                          className="p-1 text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {testType === "subject" ? (
                      <input
                        type="text"
                        value={variant.subject}
                        onChange={(e) => updateVariant(index, "subject", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter subject line"
                      />
                    ) : (
                      <textarea
                        value={variant.content}
                        onChange={(e) => updateVariant(index, "content", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 h-24 resize-none"
                        placeholder="Enter email content"
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={createMutation.isPending}
              className="flex items-center space-x-2 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50"
              style={{ backgroundColor: "#7C3AED" }}
            >
              {createMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FlaskConical className="w-4 h-4" />
              )}
              <span>Create A/B Test</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
