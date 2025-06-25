// hooks/useDownload.js
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next"; // 假设你用的是react-i18next
import { getQueryParam } from "@utils/helpers"; // 假设你的工具函数在这里
import { getResumeDownloadLink } from "@services/resumeService"; // 假设你的API调用在这里
import { useAlert } from "@hooks/useAlert";

export const useDownloadResume = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation();
  const { showAlert } = useAlert();

  const handleDownload = useCallback(async () => {
    setLoading(true);
    setError(null);

    const currentLanguage = getQueryParam("lang") || "en";

    try {
      const downloadUrl = await getResumeDownloadLink(currentLanguage);
      const successTitle = t("successDownloadResumetitle");
      const successMessage = t("successDownloadMessage"); // 建议这里使用不同的翻译键，或者更通用的消息
      showAlert("success", successTitle, successMessage, 3000);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `RayResume_${currentLanguage}.pdf`);
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("下载失败:", err); // 在控制台打印错误便于调试
      setError(err); // 设置错误状态
      const failTitle = t("failDownloadResumetitle");
      const failMessage = t("checkNetworkMessage");
      showAlert("destructive", failTitle, failMessage, 3000);
    } finally {
      setLoading(false);
    }
  }, [showAlert, t]); // 依赖项包含t，确保语言切换时重新生成函数

  return { handleDownload, loading, error };
};
