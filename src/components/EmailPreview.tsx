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
  Search,
  Star,
  Archive,
  Trash2,
  Reply,
  Forward,
  MoreHorizontal,
  Paperclip,
  Grid3X3,
} from "lucide-react";
import { brand } from "@/constants/brand";

interface EmailPreviewProps {
  subject: string;
  content: string;
  recipientEmail?: string;
}

type PreviewMode = "gmail" | "outlook" | "apple" | "mobile" | "all";

const CLIENTS = [
  { id: "gmail" as PreviewMode, name: "Gmail", color: "#EA4335" },
  { id: "outlook" as PreviewMode, name: "Outlook", color: "#0078D4" },
  { id: "apple" as PreviewMode, name: "Apple Mail", color: "#1d1d1f" },
  { id: "mobile" as PreviewMode, name: "Mobile", color: "#6b7280" },
  { id: "all" as PreviewMode, name: "All Clients", color: "#8b5cf6" },
];

function stripHtml(html: string): string {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return (tmp.textContent || tmp.innerText || "").slice(0, 150);
}

function timeAgo(): string {
  return "10:42 AM";
}

export const EmailPreview = ({
  subject,
  content,
  recipientEmail = "subscriber@example.com",
}: EmailPreviewProps) => {
  const [previewMode, setPreviewMode] = useState<PreviewMode>("gmail");
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
            {/* Client Selector Tabs */}
            <div className="flex items-center space-x-1.5 flex-wrap bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {CLIENTS.map((client) => (
                <button
                  key={client.id}
                  onClick={() => setPreviewMode(client.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    previewMode === client.id
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: client.color }}
                  />
                  <span>{client.name}</span>
                </button>
              ))}
            </div>

            {/* All Clients Grid */}
            {previewMode === "all" ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#EA4335]" />
                    <span>Gmail</span>
                  </div>
                  <div className="rounded-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden shadow-sm">
                    <GmailPreview subject={previewSubject} content={previewContent} text={previewText} recipientEmail={recipientEmail} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0078D4]" />
                    <span>Outlook</span>
                  </div>
                  <div className="rounded-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden shadow-sm">
                    <OutlookPreview subject={previewSubject} content={previewContent} text={previewText} recipientEmail={recipientEmail} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1d1d1f]" />
                    <span>Apple Mail</span>
                  </div>
                  <div className="rounded-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden shadow-sm">
                    <AppleMailPreview subject={previewSubject} content={previewContent} text={previewText} recipientEmail={recipientEmail} />
                  </div>
                </div>
              </div>
            ) : (
              /* Single Client Preview */
              <div className="rounded-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden bg-white dark:bg-slate-800 shadow-sm">
                <AnimatePresence mode="wait">
                  {previewMode === "gmail" && (
                    <motion.div key="gmail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <GmailPreview subject={previewSubject} content={previewContent} text={previewText} recipientEmail={recipientEmail} />
                    </motion.div>
                  )}
                  {previewMode === "outlook" && (
                    <motion.div key="outlook" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <OutlookPreview subject={previewSubject} content={previewContent} text={previewText} recipientEmail={recipientEmail} />
                    </motion.div>
                  )}
                  {previewMode === "apple" && (
                    <motion.div key="apple" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <AppleMailPreview subject={previewSubject} content={previewContent} text={previewText} recipientEmail={recipientEmail} />
                    </motion.div>
                  )}
                  {previewMode === "mobile" && (
                    <motion.div key="mobile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <MobileMailPreview subject={previewSubject} content={previewContent} text={previewText} recipientEmail={recipientEmail} />
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

/* ─── Gmail Preview ──────────────────────────────────────────── */
function GmailPreview({
  subject,
  content,
  text,
  recipientEmail,
}: {
  subject: string;
  content: string;
  text: string;
  recipientEmail: string;
}) {
  return (
    <div className="bg-white dark:bg-[#202124] text-sm">
      {/* Gmail Top Bar */}
      <div className="flex items-center px-4 py-2 bg-[#f6f8fc] dark:bg-[#303134] border-b border-[#e0e0e0] dark:border-[#5f6368]">
        <div className="flex items-center space-x-2 flex-1">
          <div className="w-8 h-8 rounded-full bg-[#EA4335] flex items-center justify-center">
            <span className="text-white font-bold text-xs">M</span>
          </div>
          <span className="text-[13px] text-[#5f6368] dark:text-[#9aa0a6]">Gmail</span>
        </div>
        <div className="flex items-center bg-white dark:bg-[#202124] border border-[#e0e0e0] dark:border-[#5f6368] rounded-full px-3 py-1.5 flex-1 max-w-md mx-4">
          <Search className="w-4 h-4 text-[#5f6368] dark:text-[#9aa0a6] mr-2" />
          <span className="text-[13px] text-[#9aa0a6]">Search mail</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-8 h-8 rounded-full bg-[#EA4335] flex items-center justify-center text-white text-xs font-medium">E</div>
        </div>
      </div>

      {/* Gmail Tabs */}
      <div className="flex border-b border-[#e0e0e0] dark:border-[#5f6368]">
        <div className="flex items-center space-x-2 px-6 py-3 border-b-2 border-[#EA4335] text-[#EA4335] font-medium text-[13px]">
          <Inbox className="w-4 h-4" />
          <span>Primary</span>
        </div>
        <div className="flex items-center space-x-2 px-6 py-3 text-[#5f6368] dark:text-[#9aa0a6] text-[13px]">
          <span>Updates</span>
        </div>
        <div className="flex items-center space-x-2 px-6 py-3 text-[#5f6368] dark:text-[#9aa0a6] text-[13px]">
          <span>Promotions</span>
        </div>
      </div>

      {/* Email Row */}
      <div className="px-4 py-3 hover:bg-[#f2f6fc] dark:hover:bg-[#303134] cursor-pointer border-b border-[#f2f2f2] dark:border-[#3c4043]">
        <div className="flex items-start space-x-3">
          <input type="checkbox" className="mt-1 accent-[#EA4335]" />
          <Star className="w-4 h-4 text-[#5f6368] dark:text-[#9aa0a6] mt-0.5" />
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ backgroundColor: brand.colors.primary }}>
            E
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[13px] text-[#202124] dark:text-[#e8eaed]">
                {brand.projectName}
              </span>
              <span className="text-[11px] text-[#5f6368] dark:text-[#9aa0a6] flex-shrink-0 ml-2">
                {timeAgo()}
              </span>
            </div>
            <div className="text-[13px] text-[#202124] dark:text-[#e8eaed] truncate">
              {subject}
            </div>
            <div className="text-[12px] text-[#5f6368] dark:text-[#9aa0a6] truncate mt-0.5">
              - {text}...
            </div>
          </div>
          <Paperclip className="w-4 h-4 text-[#5f6368] dark:text-[#9aa0a6] flex-shrink-0 mt-1" />
        </div>
      </div>

      {/* Email Body */}
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ backgroundColor: brand.colors.primary }}>
            E
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-[14px] text-[#202124] dark:text-[#e8eaed]">{brand.projectName}</span>
              <span className="text-[12px] text-[#5f6368] dark:text-[#9aa0a6]">&lt;noreply@{brand.domain}&gt;</span>
            </div>
            <div className="text-[12px] text-[#5f6368] dark:text-[#9aa0a6]">to {recipientEmail}</div>
          </div>
        </div>
        <div className="prose prose-sm max-w-none text-[14px] text-[#202124] dark:text-[#e8eaed] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content }} />
      </div>

      {/* Gmail Action Bar */}
      <div className="px-6 py-2 border-t border-[#e0e0e0] dark:border-[#5f6368] flex items-center space-x-1">
        <button className="flex items-center space-x-1 px-3 py-1.5 rounded-full text-[12px] text-[#5f6368] dark:text-[#9aa0a6] hover:bg-[#f2f6fc] dark:hover:bg-[#303134]">
          <Reply className="w-4 h-4" />
          <span>Reply</span>
        </button>
        <button className="flex items-center space-x-1 px-3 py-1.5 rounded-full text-[12px] text-[#5f6368] dark:text-[#9aa0a6] hover:bg-[#f2f6fc] dark:hover:bg-[#303134]">
          <Forward className="w-4 h-4" />
          <span>Forward</span>
        </button>
        <button className="flex items-center space-x-1 px-3 py-1.5 rounded-full text-[12px] text-[#5f6368] dark:text-[#9aa0a6] hover:bg-[#f2f6fc] dark:hover:bg-[#303134]">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ─── Outlook Preview ──────────────────────────────────────────── */
function OutlookPreview({
  subject,
  content,
  text,
  recipientEmail,
}: {
  subject: string;
  content: string;
  text: string;
  recipientEmail: string;
}) {
  return (
    <div className="bg-white dark:bg-[#1b1b1b] text-sm" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Outlook Top Bar */}
      <div className="flex items-center px-4 py-2 bg-[#0078D4] text-white">
        <div className="flex items-center space-x-2 flex-1">
          <div className="w-6 h-6 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white">
              <rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke="white" strokeWidth="1.5"/>
              <path d="M2 6l10 7 10-7" fill="none" stroke="white" strokeWidth="1.5"/>
            </svg>
          </div>
          <span className="text-[13px] font-semibold">Outlook</span>
        </div>
        <div className="flex items-center bg-white/15 rounded px-3 py-1.5 flex-1 max-w-sm mx-4">
          <Search className="w-3.5 h-3.5 text-white/70 mr-2" />
          <span className="text-[12px] text-white/70">Search</span>
        </div>
        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-[11px] font-medium">E</div>
      </div>

      {/* Outlook Ribbon */}
      <div className="flex items-center px-4 py-1.5 bg-[#f3f2f1] dark:bg-[#2d2d2d] border-b border-[#edebe9] dark:border-[#404040] text-[12px] text-[#605e5c] dark:text-[#a19f9d]">
        <span className="px-2 py-1 hover:bg-[#edebe9] dark:hover:bg-[#404040] rounded cursor-pointer">Home</span>
        <span className="px-2 py-1 hover:bg-[#edebe9] dark:hover:bg-[#404040] rounded cursor-pointer">Send / Receive</span>
        <span className="px-2 py-1 hover:bg-[#edebe9] dark:hover:bg-[#404040] rounded cursor-pointer">Folder</span>
        <span className="px-2 py-1 hover:bg-[#edebe9] dark:hover:bg-[#404040] rounded cursor-pointer">View</span>
      </div>

      {/* Email Header */}
      <div className="p-5 border-b border-[#edebe9] dark:border-[#404040]">
        <h1 className="text-[20px] font-semibold text-[#323130] dark:text-[#faf9f8] mb-3">
          {subject}
        </h1>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ backgroundColor: brand.colors.primary }}>
            E
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-[13px] text-[#323130] dark:text-[#faf9f8]">{brand.projectName}</span>
            </div>
            <div className="text-[12px] text-[#605e5c] dark:text-[#a19f9d]">
              To: {recipientEmail}
            </div>
          </div>
          <div className="flex-1" />
          <span className="text-[11px] text-[#a19f9d]">{timeAgo()}</span>
        </div>
      </div>

      {/* Outlook Action Bar */}
      <div className="flex items-center px-4 py-1.5 bg-[#f3f2f1] dark:bg-[#2d2d2d] border-b border-[#edebe9] dark:border-[#404040]">
        <button className="flex items-center space-x-1 px-2.5 py-1 rounded text-[11px] text-[#323130] dark:text-[#faf9f8] hover:bg-[#edebe9] dark:hover:bg-[#404040]">
          <Reply className="w-3.5 h-3.5" />
          <span>Reply</span>
        </button>
        <button className="flex items-center space-x-1 px-2.5 py-1 rounded text-[11px] text-[#323130] dark:text-[#faf9f8] hover:bg-[#edebe9] dark:hover:bg-[#404040]">
          <Forward className="w-3.5 h-3.5" />
          <span>Forward</span>
        </button>
        <div className="w-px h-4 bg-[#edebe9] dark:bg-[#404040] mx-1" />
        <button className="flex items-center space-x-1 px-2.5 py-1 rounded text-[11px] text-[#323130] dark:text-[#faf9f8] hover:bg-[#edebe9] dark:hover:bg-[#404040]">
          <Archive className="w-3.5 h-3.5" />
        </button>
        <button className="flex items-center space-x-1 px-2.5 py-1 rounded text-[11px] text-[#323130] dark:text-[#faf9f8] hover:bg-[#edebe9] dark:hover:bg-[#404040]">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Email Body */}
      <div className="p-6">
        <div className="prose prose-sm max-w-none text-[14px] text-[#323130] dark:text-[#faf9f8] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content }} />
      </div>

      {/* Outlook Footer */}
      <div className="px-4 py-2 border-t border-[#edebe9] dark:border-[#404040] text-[11px] text-[#a19f9d] bg-[#faf9f8] dark:bg-[#1b1b1b]">
        <span>Scanned by Microsoft Defender for Office 365</span>
      </div>
    </div>
  );
}

/* ─── Apple Mail Preview ──────────────────────────────────────── */
function AppleMailPreview({
  subject,
  content,
  text,
  recipientEmail,
}: {
  subject: string;
  content: string;
  text: string;
  recipientEmail: string;
}) {
  return (
    <div className="bg-white dark:bg-[#1c1c1e] text-sm" style={{ fontFamily: "-apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif" }}>
      {/* Apple Mail Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#f5f5f7] dark:bg-[#2c2c2e] border-b border-[#d2d2d7] dark:border-[#48484a]">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
        </div>
        <div className="flex items-center bg-white/80 dark:bg-[#3a3a3c] rounded-md px-3 py-1 border border-[#d2d2d7] dark:border-[#48484a]">
          <span className="text-[12px] text-[#86868b]">Mailboxes</span>
        </div>
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#007AFF] to-[#5856D6] flex items-center justify-center text-white text-[10px] font-semibold">
          E
        </div>
      </div>

      {/* Email Subject Area */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-[20px] font-bold text-[#1d1d1f] dark:text-[#f5f5f7] leading-tight">
            {subject}
          </h1>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-semibold"
              style={{ backgroundColor: brand.colors.primary }}>
              E
            </div>
            <div>
              <div className="text-[13px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">{brand.projectName}</div>
              <div className="text-[11px] text-[#86868b]">To: {recipientEmail}</div>
            </div>
          </div>
          <div className="text-[11px] text-[#86868b]">{timeAgo()}</div>
        </div>
      </div>

      {/* Email Body */}
      <div className="px-5 py-4 border-t border-[#f2f2f7] dark:border-[#38383a]">
        <div className="text-[15px] text-[#1d1d1f] dark:text-[#f5f5f7] leading-[1.6]"
          dangerouslySetInnerHTML={{ __html: content }} />
      </div>

      {/* Apple Mail Action Bar */}
      <div className="flex items-center justify-around px-4 py-3 border-t border-[#d2d2d7] dark:border-[#48484a] bg-[#f5f5f7] dark:bg-[#2c2c2e]">
        <button className="flex flex-col items-center space-y-0.5">
          <Reply className="w-5 h-5 text-[#007AFF]" />
          <span className="text-[10px] text-[#007AFF]">Reply</span>
        </button>
        <button className="flex flex-col items-center space-y-0.5">
          <Forward className="w-5 h-5 text-[#007AFF]" />
          <span className="text-[10px] text-[#007AFF]">Forward</span>
        </button>
        <button className="flex flex-col items-center space-y-0.5">
          <Archive className="w-5 h-5 text-[#007AFF]" />
          <span className="text-[10px] text-[#007AFF]">Archive</span>
        </button>
        <button className="flex flex-col items-center space-y-0.5">
          <Trash2 className="w-5 h-5 text-[#FF3B30]" />
          <span className="text-[10px] text-[#FF3B30]">Delete</span>
        </button>
      </div>
    </div>
  );
}

/* ─── Mobile Mail Preview (iPhone Mail App) ────────────────────── */
function MobileMailPreview({
  subject,
  content,
  text,
  recipientEmail,
}: {
  subject: string;
  content: string;
  text: string;
  recipientEmail: string;
}) {
  return (
    <div className="bg-white dark:bg-[#000000] text-sm max-w-[375px] mx-auto" style={{ fontFamily: "-apple-system, 'SF Pro', sans-serif" }}>
      {/* iPhone Status Bar */}
      <div className="flex items-center justify-between px-6 py-1.5 bg-white dark:bg-[#000000]">
        <span className="text-[12px] font-semibold text-black dark:text-white">9:41</span>
        <div className="flex items-center space-x-1">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/></svg>
        </div>
      </div>

      {/* Mail Navigation */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#f2f2f7] dark:bg-[#1c1c1e]">
        <button className="text-[#007AFF] text-[14px]">&lt; Mailboxes</button>
        <span className="text-[13px] font-semibold text-black dark:text-white">Inbox</span>
        <button className="text-[#007AFF] text-[14px]">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        </button>
      </div>

      {/* Email Content */}
      <div className="px-4 py-4 bg-white dark:bg-[#000000]">
        <h1 className="text-[18px] font-bold text-black dark:text-white mb-3 leading-tight">
          {subject}
        </h1>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold"
              style={{ backgroundColor: brand.colors.primary }}>
              E
            </div>
            <div>
              <div className="text-[13px] font-semibold text-black dark:text-white">{brand.projectName}</div>
              <div className="text-[11px] text-[#8e8e93]">to {recipientEmail}</div>
            </div>
          </div>
          <span className="text-[11px] text-[#8e8e93]">{timeAgo()}</span>
        </div>
        <div className="text-[15px] text-black dark:text-white leading-[1.6]"
          dangerouslySetInnerHTML={{ __html: content }} />
      </div>

      {/* Mobile Action Bar */}
      <div className="flex items-center justify-around px-4 py-3 border-t border-[#c6c6c8] dark:border-[#38383a] bg-[#f9f9f9] dark:bg-[#1c1c1e]">
        <button className="flex flex-col items-center">
          <Reply className="w-5 h-5 text-[#007AFF]" />
          <span className="text-[9px] text-[#007AFF] mt-0.5">Reply</span>
        </button>
        <button className="flex flex-col items-center">
          <Forward className="w-5 h-5 text-[#007AFF]" />
          <span className="text-[9px] text-[#007AFF] mt-0.5">Forward</span>
        </button>
        <button className="flex flex-col items-center">
          <svg className="w-5 h-5 text-[#007AFF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          <span className="text-[9px] text-[#007AFF] mt-0.5">Compose</span>
        </button>
        <button className="flex flex-col items-center">
          <Trash2 className="w-5 h-5 text-[#FF3B30]" />
          <span className="text-[9px] text-[#FF3B30] mt-0.5">Delete</span>
        </button>
      </div>

      {/* iPhone Home Indicator */}
      <div className="flex justify-center py-2 bg-white dark:bg-[#000000]">
        <div className="w-[134px] h-[5px] rounded-full bg-black dark:bg-white" />
      </div>
    </div>
  );
}
