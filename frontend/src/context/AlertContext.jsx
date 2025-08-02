/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/button-has-type */
// src/context/AlertContext.jsx (简化版本，无动画，自动适应内容大小)

import React, { createContext, useState, useCallback } from "react";
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// AlertContext 定义保持不变
export const AlertContext = createContext(null);

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({
    isVisible: false,
    type: "default", // 'default', 'success', 'destructive'
    title: "",
    description: "",
  });

  const hideAlert = useCallback(() => {
    setAlert((prev) => ({ ...prev, isVisible: false }));
  }, []);

  const showAlert = useCallback(
    (type, title, description, duration = 5000) => {
      setAlert({ isVisible: true, type, title, description });
      if (duration > 0) {
        setTimeout(() => {
          hideAlert();
        }, duration); // 仅保留自动关闭功能
      }
    },
    [hideAlert]
  );

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      {alert.isVisible && (
        <div
          className={cn(
            // 基础定位：底部距离加大到 bottom-8 (原 bottom-4 扩大一倍)
            "fixed bottom-8 z-50",
            // Mobile: 宽度调整为 w-[calc(100%-4rem)] (左右各2rem，原1rem)，max-w-xl (原max-w-sm，增大)，
            // 确保居中机制 left-1/2 -translate-x-1/2 仍然工作
            "left-1/2 -translate-x-1/2 w-[calc(100%-10rem)] max-w-xl", // 4rem留白（左右各2rem），最大宽度增大
            // Laptop: 距离右侧和底部加大到 right-8 md:bottom-8 (原right-4 md:bottom-4)，
            // 宽度调整为 max-w-2xl (原max-w-md，增大)，且不需要 translate-x-0 来重置
            "md:left-auto md:right-15 md:bottom-8 md:translate-x-0 md:w-auto md:max-w-4xl", // 右侧和底部边距增大，最大宽度增大
            "flex flex-col gap-2",
            "bg-background-dark rounded-3xl"
          )}
        >
          <Alert
            variant={alert.type}
            className="text-7xl" // 字体大小保持与之前需求一致
          >
            <AlertTitle className="flex justify-between items-center font-bold text-5xl my-5 mx-7 md:text-3xl md:my-3">
              {alert.title}
              <button
                onClick={hideAlert}
                className="p-1 rounded-md hover:bg-opacity-100 transition-colors ml-8"
                aria-label="Close alert"
              >
                <X className="h-8 w-8" />
              </button>
            </AlertTitle>
            <AlertDescription className="text-4xl my-3 mx-5 md:text-2xl">
              {alert.description}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </AlertContext.Provider>
  );
};
