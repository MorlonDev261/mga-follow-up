"use client"

import { createContext, useCallback, useContext, useState } from "react"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { v4 as uuid } from "uuid"

type ToastMessage = {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

const ToastContext = createContext<{
  showToast: (toast: Omit<ToastMessage, "id">) => void
} | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error("useToast must be used within <ToastManager>")
  return context
}

export function ToastManager({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const showToast = useCallback((toast: Omit<ToastMessage, "id">) => {
    const id = uuid()
    setToasts((prev) => [...prev, { ...toast, id }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      <ToastProvider>
        {children}
        <ToastViewport />
        {toasts.map((toast) => (
          <Toast key={toast.id} variant={toast.variant}>
            <div className="grid gap-1">
              {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
              {toast.description && (
                <ToastDescription>{toast.description}</ToastDescription>
              )}
            </div>
            <ToastClose />
          </Toast>
        ))}
      </ToastProvider>
    </ToastContext.Provider>
  )
}
