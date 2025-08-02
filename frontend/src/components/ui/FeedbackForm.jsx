/* eslint-disable no-unused-vars */
import { useState } from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Textarea } from "@components/ui/textarea";
import { Button } from "@components/ui/Button";
import { useTranslation } from "react-i18next";
import { useAlert } from "@hooks/useAlert";
import config from "@config/appConfig";

function FeedbackForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation();
  const { showAlert } = useAlert();

  // 从环境变量获取 Web3Forms Access Key
  const WEB3FORMS_ACCESS_KEY = config.FORM_API;

  // Web3Forms 的通用提交 Endpoint
  const WEB3FORMS_ENDPOINT_URL = "https://api.web3forms.com/submit";

  const handleSubmit = async (event) => {
    event.preventDefault();

    // 基本的客户端提交冷却检查 (可选，但推荐作为第一道防线)
    const COOLDOWN_MINUTES = 2; // 2分钟冷却时间
    const lastSubmitTime = localStorage.getItem("lastWeb3FormSubmitTime");
    if (lastSubmitTime) {
      const now = Date.now();
      const lastTime = parseInt(lastSubmitTime, 10);
      const diffMinutes = (now - lastTime) / (1000 * 60);
      if (diffMinutes < COOLDOWN_MINUTES) {
        showAlert(
          "destructive",
          t("tooManyRequestsTitle"),
          t("tooManyRequestsMessage", {
            time: COOLDOWN_MINUTES - Math.floor(diffMinutes),
          })
        );
        return; // 阻止提交
      }
    }

    if (!WEB3FORMS_ACCESS_KEY) {
      console.error(
        "Web3Forms Access Key is not defined! Please check your .env files and Cloudflare Pages environment variables."
      );
      showAlert("destructive", t("failTitle"), t("configErrorMessage")); // 提示配置错误
      return;
    }

    setIsLoading(true);
    setError(null);

    const form = event.target;
    const formData = new FormData(form);

    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    data.access_key = WEB3FORMS_ACCESS_KEY;

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Web3Forms 推荐 JSON
          Accept: "application/json",
        },
        body: JSON.stringify(data), // 将数据转换为 JSON 字符串发送
      });

      const result = await response.json(); // 解析 Web3Forms 返回的 JSON 响应

      if (result.success) {
        // Web3Forms 返回 { success: true } 表示成功
        localStorage.setItem("lastWeb3FormSubmitTime", Date.now().toString()); // 提交成功后设置时间戳
        setIsSubmitted(true); // 设置提交成功状态
        form.reset(); // 清空表单字段
        showAlert("success", t("successSubmit"), t("successSubmitMessage"));
      } else {
        // Web3Forms 返回 { success: false, message: "..." }
        const errorMessage = result.message;
        setError(errorMessage);
        showAlert("destructive", t("failSubmit"), t("checkNetworkMessage"));
      }
    } catch (err) {
      showAlert("destructive", t("failSubmit"), t("checkNetworkMessage"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-[70vw] mx-auto h-[55vh] bg-background-dark shadow-none border-none sm:w-[30vw] sm:h-auto">
      <CardHeader className="py-3">
        <CardTitle className="text-5xl leading-normal sm:text-3xl ">
          {t("formDescription")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div
            style={{ position: "absolute", left: "-5000px" }}
            aria-hidden="true"
          >
            <input type="text" name="botcheck" tabIndex="-1" />
          </div>

          <div className="grid w-full items-center gap-4 ">
            <div className="flex flex-col space-y-3">
              <Label
                className="text-5xl leading-normal sm:text-2xl"
                htmlFor="name"
              >
                {t("name")}
              </Label>
              <Input
                id="name"
                name="name"
                placeholder={t("namePlaceholder")}
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label
                className="text-5xl leading-normal sm:text-2xl"
                htmlFor="email"
              >
                {t("mail")}
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={t("mailPlaceholder")}
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label
                className="text-5xl leading-normal sm:text-2xl"
                htmlFor="feedback"
              >
                {t("feedback")}
              </Label>
              <Textarea
                id="feedback"
                name="feedback"
                placeholder={t("feedbackPlaceholder")}
                required
              />
            </div>
          </div>
          <CardFooter className="flex justify-center items-center p-5">
            <Button
              type="submit"
              size="lg"
              className="text-4xl rounded-full bg-logo "
              disabled={isLoading}
            >
              {isLoading ? t("submiting") : t("submit")}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}

export default FeedbackForm;
