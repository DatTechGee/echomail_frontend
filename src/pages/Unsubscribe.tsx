import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle, XCircle, Loader2, Home } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { brand } from "@/constants/brand";
import { ThemeToggle } from "@/components/ThemeToggle";
import { newsletterService } from "@/services/api/newsletter.services";

export const Unsubscribe = ({ token }: { token: string }) => {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid unsubscribe link.");
      return;
    }

    newsletterService
      .unsubscribe(token)
      .then((res: any) => {
        setStatus("success");
        setMessage(res?.data?.message || res?.message || "You have been unsubscribed successfully.");
      })
      .catch((err: any) => {
        setStatus("error");
        setMessage(err?.response?.data?.message || "This unsubscribe link is invalid or has already been used.");
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center space-x-2">
          <img src={brand.logo} alt={brand.projectName} className="h-8 w-auto" />
          <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {brand.projectName}
          </span>
        </Link>
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          <Link
            to="/"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-8 text-center">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-6"
            >
              {status === "loading" && (
                <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mx-auto">
                  <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                </div>
              )}
              {status === "success" && (
                <div className="w-20 h-20 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
              )}
              {status === "error" && (
                <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center mx-auto">
                  <XCircle className="w-10 h-10 text-red-500" />
                </div>
              )}
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3"
            >
              {status === "loading" && "Processing..."}
              {status === "success" && "Unsubscribed"}
              {status === "error" && "Oops!"}
            </motion.h1>

            {/* Message */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed"
            >
              {message}
            </motion.p>

            {/* Actions */}
            {status !== "loading" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-3"
              >
                <Link
                  to="/"
                  className="inline-flex items-center justify-center space-x-2 w-full px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all hover:shadow-lg"
                  style={{ backgroundColor: brand.colors.primary }}
                >
                  <Home className="w-4 h-4" />
                  <span>Back to {brand.projectName}</span>
                </Link>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Changed your mind? You can always re-subscribe from our website.
                </p>
              </motion.div>
            )}
          </div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center"
          >
            <div className="flex items-center justify-center space-x-1.5 text-sm text-slate-400 dark:text-slate-500">
              <Mail className="w-4 h-4" />
              <span>You won't receive emails from us anymore.</span>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-slate-400 dark:text-slate-600">
        &copy; {new Date().getFullYear()} {brand.projectName}. All rights reserved.
      </footer>
    </div>
  );
};
