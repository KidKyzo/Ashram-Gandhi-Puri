"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { useTranslation } from "./LocaleContext";

interface Toast {
  id: string;
  message: string;
  type?: "success" | "error" | "info";
}

interface ToastContextType {
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { locale } = useTranslation();
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: "success" | "error" | "info" = "success") => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    },
    []
  );

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-md w-[calc(100vw-3rem)] pointer-events-none"
        role="status"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border text-sm backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${
              toast.type === "error"
                ? "bg-red-950/90 border-red-800 text-red-100"
                : "bg-[#2E1065]/95 border-[#f1ad66]/40 text-purple-50"
            }`}
          >
            {toast.type === "error" ? (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-[#CA8A04] shrink-0 mt-0.5" />
            )}
            <p className="flex-1 leading-relaxed">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-purple-300 hover:text-white p-1 rounded-lg transition-colors"
              aria-label={locale === "id" ? "Tutup pemberitahuan" : "Close notification"}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
