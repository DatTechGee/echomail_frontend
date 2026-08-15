import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Monitor,
  Smartphone,
  Inbox,
  Clock,
  ChevronDown,
  ChevronUp,
  Eye,
  Palette,
  Grid3X3,
} from "lucide-react";
import { brand } from "@/constants/brand";

interface EmailPreviewProps {
  subject: string;
  content: string;
  recipientEmail?: string;
}

interface DesignColors {
  headerBg: string;
  headerBorder: string;
  bodyBg: string;
  accent: string;
  textColor: string;
  mutedColor: string;
  footerBg: string;
}

type PreviewMode = "inbox" | "desktop" | "mobile" | "all";

const DESIGN_STYLES: { id: string; name: string; description: string }[] = [
  { id: "classic", name: "Classic", description: "Clean, traditional email layout" },
  { id: "modern", name: "Modern", description: "Bold gradient header" },
  { id: "minimal", name: "Minimal", description: "Simple, text-focused" },
  { id: "bold", name: "Bold", description: "High contrast, eye-catching" },
];

function getDesignColors(style: string): DesignColors {
  switch (style) {
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
    default:
      return {
        headerBg: "#ffffff",
        headerBorder: "#e5e7eb",
        bodyBg: "#ffffff",
        accent: brand.colors.primary,
        textColor: "#1f2937",
        mutedColor: "#6b7280",
        footerBg: "#f9fafb",
      };
  }
}

function stripHtml(html: string): string {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return (tmp.textContent || tmp.innerText || "").slice(0, 120);
}

export const EmailPreview = ({
  subject,
  content,
  recipientEmail = "subscriber@example.com",
}: EmailPreviewProps) => {
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [designStyle, setDesignStyle] = useState("classic");
  const [expanded, setExpanded] = useState(true);

  const previewSubject = subject || "Your campaign subject here";
  const previewContent = content || "<p>Your email content will appear here...</p>";
  const previewText = stripHtml(previewContent);

  return (
    <div className="space-y-4">
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
            <div className="flex items-center space-x-2 flex-wrap">
              {[
                { id: "inbox" as PreviewMode, icon: Inbox, label: "Inbox" },
                { id: "desktop" as PreviewMode, icon: Monitor, label: "Desktop" },
                { id: "mobile" as PreviewMode, icon: Smartphone, label: "Mobile" },
                { id: "all" as PreviewMode, icon: Grid3X3, label: "All Designs" },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setPreviewMode(mode.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    previewMode === mode.id
                      ? "text-white shadow-md"
                      : "text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                  style={previewMode === mode.id ? { backgroundColor: brand.colors.primary } : {}}
                >
                  <mode.icon className="w-4 h-4" />
                  <span>{mode.label}</span>
                </button>
              ))}
            </div>

            {/* Design Style Selector (hidden in "all" mode) */}
            {previewMode !== "all" && (
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
            )}

            {/* All Designs Grid */}
            {previewMode === "all" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DESIGN_STYLES.map((style) => (
                  <div key={style.id} className="space-y-2">
                    <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {style.name}
                    </div>
                    <div className="rounded-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden bg-white dark:bg-slate-800 shadow-sm">
                      <EmailCard
                        subject={previewSubject}
                        content={previewContent}
                        colors={getDesignColors(style.id)}
                        designStyle={style.id}
                        recipientEmail={recipientEmail}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Single Preview */
              <div
                className={`rounded-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden bg-white dark:bg-slate-800 ${
                  previewMode === "mobile" ? "max-w-[375px] mx-auto" : ""
                }`}
              >
                <AnimatePresence mode="wait">
                  {previewMode === "inbox" && (
                    <motion.div key="inbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <InboxPreview
                        subject={previewSubject}
                        text={previewText}
                        brand={brand}
                      />
                    </motion.div>
                  )}
                  {previewMode === "desktop" && (
                    <motion.div key="desktop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <DesktopPreview
                        subject={previewSubject}
                        content={previewContent}
                        colors={getDesignColors(designStyle)}
                        designStyle={designStyle}
                        recipientEmail={recipientEmail}
                        brand={brand}
                      />
                    </motion.div>
                  )}
                  {previewMode === "mobile" && (
                    <motion.div key="mobile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <MobilePreview
                        subject={previewSubject}
                        content={previewContent}
                        colors={getDesignColors(designStyle)}
                        designStyle={designStyle}
                        brand={brand}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function InboxPreview({
  subject,
  text,
  brand,
}: {
  subject: string;
  text: string;
  brand: any;
}) {
  return (
    <div className="bg-white dark:bg-slate-800">
      <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-3 bg-slate-100 dark:bg-slate-700 rounded-full px-4 py-2">
          <Mail className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-400">Search mail</span>
        </div>
      </div>

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
              {subject}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {text}...
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 opacity-40 border-b border-slate-100 dark:border-slate-700/50">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-full bg-slate-300 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="h-3 bg-slate-200 dark:bg-slate-600 rounded w-1/3 mb-1.5" />
            <div className="h-2.5 bg-slate-200 dark:bg-slate-600 rounded w-1/2 mb-1" />
            <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded w-2/3" />
          </div>
        </div>
      </div>
      <div className="px-4 py-3 opacity-25">
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
  );
}

function EmailCard({
  subject,
  content,
  colors,
  designStyle,
  recipientEmail,
  brand,
}: {
  subject: string;
  content: string;
  colors: DesignColors;
  designStyle: string;
  recipientEmail?: string;
  brand: any;
}) {
  return (
    <div className="text-sm">
      <div
        className="p-3"
        style={{ background: colors.headerBg, borderBottom: `2px solid ${colors.headerBorder}` }}
      >
        <div className="flex items-center space-x-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
            style={{ backgroundColor: brand.colors.primary }}
          >
            E
          </div>
          <div>
            <div className="font-semibold text-xs" style={{ color: designStyle === "bold" ? "#fff" : colors.textColor }}>
              {brand.projectName}
            </div>
            {recipientEmail && (
              <div className="text-[10px]" style={{ color: designStyle === "bold" ? "rgba(255,255,255,0.7)" : colors.mutedColor }}>
                to {recipientEmail}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
        <div className="font-bold text-xs" style={{ color: colors.textColor }}>{subject}</div>
      </div>
      <div className="p-3" style={{ backgroundColor: colors.bodyBg }}>
        <div
          className="text-xs leading-relaxed"
          style={{ color: colors.textColor }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
      <div
        className="px-3 py-2 text-center text-[10px]"
        style={{ backgroundColor: colors.footerBg, color: designStyle === "modern" || designStyle === "bold" ? "#d1d5db" : colors.mutedColor }}
      >
        &copy; {new Date().getFullYear()} {brand.projectName}
      </div>
    </div>
  );
}

function DesktopPreview({
  subject,
  content,
  colors,
  designStyle,
  recipientEmail,
  brand,
}: {
  subject: string;
  content: string;
  colors: DesignColors;
  designStyle: string;
  recipientEmail: string;
  brand: any;
}) {
  return (
    <div className="p-4">
      <div
        className="p-4 rounded-t-xl"
        style={{ background: colors.headerBg, borderBottom: `2px solid ${colors.headerBorder}` }}
      >
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: brand.colors.primary }}
          >
            E
          </div>
          <div>
            <div className="font-semibold" style={{ color: designStyle === "bold" ? "#fff" : colors.textColor }}>
              {brand.projectName}
            </div>
            <div className="text-xs" style={{ color: designStyle === "bold" ? "rgba(255,255,255,0.7)" : colors.mutedColor }}>
              to {recipientEmail}
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
        <h2 className="text-lg font-bold" style={{ color: colors.textColor }}>{subject}</h2>
      </div>
      <div className="p-6" style={{ backgroundColor: colors.bodyBg }}>
        <div
          className="prose prose-sm max-w-none"
          style={{ color: colors.textColor }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
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
  colors: DesignColors;
  designStyle: string;
  brand: any;
}) {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between px-4 py-1 bg-slate-100 dark:bg-slate-700 rounded-t-lg text-xs text-slate-500">
        <span>9:41</span>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-2 bg-slate-400 rounded-sm" />
          <div className="w-3 h-2 bg-slate-400 rounded-sm" />
          <div className="w-4 h-2 bg-slate-400 rounded-sm" />
        </div>
      </div>
      <div
        className="p-3"
        style={{ background: colors.headerBg, borderBottom: `1px solid ${colors.headerBorder}` }}
      >
        <div className="flex items-center space-x-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
            style={{ backgroundColor: brand.colors.primary }}
          >
            E
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm truncate" style={{ color: designStyle === "bold" ? "#fff" : colors.textColor }}>
              {brand.projectName}
            </div>
            <div className="text-xs truncate" style={{ color: designStyle === "bold" ? "rgba(255,255,255,0.7)" : colors.mutedColor }}>
              {subject}
            </div>
          </div>
          <Clock className="w-3 h-3 flex-shrink-0" style={{ color: designStyle === "bold" ? "rgba(255,255,255,0.7)" : colors.mutedColor }} />
        </div>
      </div>
      <div className="p-4 bg-white rounded-b-lg" style={{ minHeight: 200 }}>
        <h2 className="text-base font-bold mb-3" style={{ color: colors.textColor }}>{subject}</h2>
        <div
          className="text-sm leading-relaxed"
          style={{ color: colors.textColor }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
}
