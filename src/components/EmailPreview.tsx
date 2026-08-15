import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Monitor,
  Smartphone,
  Inbox,
  Send,
  Clock,
  ChevronDown,
  ChevronUp,
  Eye,
  Palette,
} from "lucide-react";
import { brand } from "@/constants/brand";

interface EmailPreviewProps {
  subject: string;
  content: string;
  recipientEmail?: string;
}

type PreviewMode = "inbox" | "desktop" | "mobile";
type DesignStyle = "classic" | "modern" | "minimal" | "bold";

const DESIGN_STYLES: { id: DesignStyle; name: string; description: string }[] = [
  { id: "classic", name: "Classic", description: "Clean, traditional email layout" },
  { id: "modern", name: "Modern", description: "Bold colors with gradient accents" },
  { id: "minimal", name: "Minimal", description: "Simple, text-focused design" },
  { id: "bold", name: "Bold", description: "High contrast, eye-catching" },
];

export const EmailPreview = ({
  subject,
  content,
  recipientEmail = "subscriber@example.com",
}: EmailPreviewProps) => {
  const [previewMode, setPreviewMode] = useState<PreviewMode>("inbox");
  const [designStyle, setDesignStyle] = useState<DesignStyle>("classic");
  const [expanded, setExpanded] = useState(true);

  const previewSubject = subject || "Your campaign subject here";
  const previewContent = content || "<p>Your email content will appear here...</p>";

  // Strip HTML for inbox preview text
  const stripHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const previewText = stripHtml(previewContent).slice(0, 120);

  const getDesignColors = () => {
    switch (designStyle) {
      case "classic":
        return {
          headerBg: "#ffffff",
          headerBorder: "#e5e7eb",
          bodyBg: "#ffffff",
          accent: brand.colors.primary,
          textColor: "#1f2937",
          mutedColor: "#6b7280",
          footerBg: "#f9fafb",
        };
      case "modern":
        return {
          headerBg: `linear-gradient(135deg, ${brand.colors.primary}, ${brand.colors.secondary})`,
          headerBorder: "transparent",
          bodyBg: "#ffffff",
          accent: brand.colors.primary,
          textColor: "#111827",
          mutedColor: "#6b7280",
          footerBg: "#1f2937",
        };
      case "minimal":
        return {
          headerBg: "#ffffff",
          headerBorder: "#f3f4f6",
          bodyBg: "#ffffff",
          accent: "#374151",
          textColor: "#374151",
          mutedColor: "#9ca3af",
          footerBg: "#ffffff",
        };
      case "bold":
        return {
          headerBg: brand.colors.primary,
          headerBorder: "transparent",
          bodyBg: "#ffffff",
          accent: brand.colors.primary,
          textColor: "#111827",
          mutedColor: "#6b7280",
          footerBg: brand.colors.primary,
        };
    }
  };

  const colors = getDesignColors();

  return (
    <div className="space-y-4">
      {/* Preview Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Eye className="w-5 h-5" style={{ color: brand.colors.primary }} />
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Email Preview
          </h3>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center space-x-1 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
        >
          <span>{expanded ? "Collapse" : "Expand"}</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {/* View Mode Tabs */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPreviewMode("inbox")}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  previewMode === "inbox"
                    ? "text-white shadow-md"
                    : "text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
                style={previewMode === "inbox" ? { backgroundColor: brand.colors.primary } : {}}
              >
                <Inbox className="w-4 h-4" />
                <span>Inbox</span>
              </button>
              <button
                onClick={() => setPreviewMode("desktop")}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  previewMode === "desktop"
                    ? "text-white shadow-md"
                    : "text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
                style={previewMode === "desktop" ? { backgroundColor: brand.colors.primary } : {}}
              >
                <Monitor className="w-4 h-4" />
                <span>Desktop</span>
              </button>
              <button
                onClick={() => setPreviewMode("mobile")}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  previewMode === "mobile"
                    ? "text-white shadow-md"
                    : "text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
                style={previewMode === "mobile" ? { backgroundColor: brand.colors.primary } : {}}
              >
                <Smartphone className="w-4 h-4" />
                <span>Mobile</span>
              </button>
            </div>

            {/* Design Style Selector */}
            <div className="flex items-center space-x-2">
              <Palette className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-500">Style:</span>
              {DESIGN_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setDesignStyle(style.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    designStyle === style.id
                      ? "text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                  style={designStyle === style.id ? { backgroundColor: brand.colors.primary } : {}}
                  title={style.description}
                >
                  {style.name}
                </button>
              ))}
            </div>

            {/* Preview Container */}
            <div
              className={`rounded-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden bg-white dark:bg-slate-800 ${
                previewMode === "mobile" ? "max-w-[375px] mx-auto" : ""
              }`}
            >
              <AnimatePresence mode="wait">
                {previewMode === "inbox" && (
                  <motion.div
                    key="inbox"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-0"
                  >
                    {/* Gmail-style inbox */}
                    <div className="bg-white dark:bg-slate-800">
                      {/* Search bar */}
                      <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center space-x-3 bg-slate-100 dark:bg-slate-700 rounded-full px-4 py-2">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-400">Search mail</span>
                        </div>
                      </div>

                      {/* Email row */}
                      <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer border-b border-slate-100 dark:border-slate-700/50">
                        <div className="flex items-start space-x-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5"
                            style={{ backgroundColor: brand.colors.primary }}
                          >
                            E
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                                {brand.projectName}
                              </span>
                              <div className="flex items-center space-x-1 flex-shrink-0">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span className="text-xs text-slate-400">Now</span>
                              </div>
                            </div>
                            <div className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                              {previewSubject}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                              {previewText}...
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* More rows (mock) */}
                      <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer border-b border-slate-100 dark:border-slate-700/50 opacity-40">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 rounded-full bg-slate-300 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-1/3 mb-1.5" />
                            <div className="h-2.5 bg-slate-200 dark:bg-slate-600 rounded w-1/2 mb-1" />
                            <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded w-2/3" />
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer border-b border-slate-100 dark:border-slate-700/50 opacity-25">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 rounded-full bg-slate-300 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-1/4 mb-1.5" />
                            <div className="h-2.5 bg-slate-200 dark:bg-slate-600 rounded w-2/5 mb-1" />
                            <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded w-1/2" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {previewMode === "desktop" && (
                  <motion.div
                    key="desktop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <DesktopPreview
                      subject={previewSubject}
                      content={previewContent}
                      colors={colors}
                      designStyle={designStyle}
                      brand={brand}
                    />
                  </motion.div>
                )}

                {previewMode === "mobile" && (
                  <motion.div
                    key="mobile"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <MobilePreview
                      subject={previewSubject}
                      content={previewContent}
                      colors={colors}
                      designStyle={designStyle}
                      brand={brand}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function DesktopPreview({
  subject,
  content,
  colors,
  designStyle,
  brand,
}: {
  subject: string;
  content: string;
  colors: ReturnType<typeof EmailPreview.prototype.getDesignColors extends () => infer R ? () => R : never>;
  designStyle: DesignStyle;
  brand: any;
}) {
  return (
    <div className="p-4">
      {/* Email header */}
      <div
        className="p-4 rounded-t-xl"
        style={{
          background: colors.headerBg,
          borderBottom: `2px solid ${colors.headerBorder}`,
        }}
      >
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: brand.colors.primary }}
          >
            E
          </div>
          <div>
            <div className="font-semibold" style={{ color: colors.textColor }}>
              {brand.projectName}
            </div>
            <div className="text-xs" style={{ color: colors.mutedColor }}>
              to {recipientEmail}
            </div>
          </div>
        </div>
      </div>

      {/* Subject line */}
      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
        <h2 className="text-lg font-bold" style={{ color: colors.textColor }}>
          {subject}
        </h2>
      </div>

      {/* Email body */}
      <div className="p-6" style={{ backgroundColor: colors.bodyBg }}>
        <div
          className="prose prose-sm max-w-none"
          style={{ color: colors.textColor }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>

      {/* Footer */}
      <div
        className="px-4 py-3 rounded-b-xl text-center text-xs"
        style={{ backgroundColor: colors.footerBg, color: designStyle === "modern" || designStyle === "bold" ? "#d1d5db" : colors.mutedColor }}
      >
        &copy; {new Date().getFullYear()} {brand.projectName}. All rights reserved.
      </div>
    </div>
  );
}

function MobilePreview({
  subject,
  content,
  colors,
  designStyle,
  brand,
}: {
  subject: string;
  content: string;
  colors: ReturnType<typeof EmailPreview.prototype.getDesignColors extends () => infer R ? () => R : never>;
  designStyle: DesignStyle;
  brand: any;
}) {
  return (
    <div className="p-4">
      {/* Mobile status bar */}
      <div className="flex items-center justify-between px-4 py-1 bg-slate-100 dark:bg-slate-700 rounded-t-lg text-xs text-slate-500">
        <span>9:41</span>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-2 bg-slate-400 rounded-sm" />
          <div className="w-3 h-2 bg-slate-400 rounded-sm" />
          <div className="w-4 h-2 bg-slate-400 rounded-sm" />
        </div>
      </div>

      {/* Mobile email header */}
      <div
        className="p-3"
        style={{
          background: colors.headerBg,
          borderBottom: `1px solid ${colors.headerBorder}`,
        }}
      >
        <div className="flex items-center space-x-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
            style={{ backgroundColor: brand.colors.primary }}
          >
            E
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm truncate" style={{ color: colors.textColor }}>
              {brand.projectName}
            </div>
            <div className="text-xs truncate" style={{ color: colors.mutedColor }}>
              {subject}
            </div>
          </div>
          <Clock className="w-3 h-3 flex-shrink-0" style={{ color: colors.mutedColor }} />
        </div>
      </div>

      {/* Mobile body */}
      <div className="p-4 bg-white rounded-b-lg" style={{ minHeight: 200 }}>
        <h2 className="text-base font-bold mb-3" style={{ color: colors.textColor }}>
          {subject}
        </h2>
        <div
          className="text-sm leading-relaxed"
          style={{ color: colors.textColor }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
}
