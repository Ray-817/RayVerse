// 确保导入 AlertContext.jsx 中定义的 createContext 和 useContext
import { useContext } from "react";
import { AlertContext } from "@context/AlertContext"; // 确保路径正确，指向 AlertContext.jsx

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
