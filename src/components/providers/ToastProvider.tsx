import React from "react";
import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        duration: 5000,
      }}
    />
  );
}

export default ToastProvider;
