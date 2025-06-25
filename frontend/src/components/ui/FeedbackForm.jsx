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

function FeedbackForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation();
  const { showAlert } = useAlert();

  const handleSubmit = async (event) => {
    event.preventDefault(); // 阻止表单的默认提交行为

    setIsLoading(true);
    setError(null); // 清除之前的错误信息

    const form = event.target;
    // 使用FormData来获取表单数据，包括Netlify的隐藏字段
    const formData = new FormData(form);

    try {
      // Netlify会根据form-name属性识别表单，并处理POST请求
      const response = await fetch("/", {
        // 向当前路径POST请求，Netlify会拦截并处理
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString(),
      });

      if (response.ok) {
        setIsSubmitted(true); // 设置提交成功状态
        // 可选：清空表单字段
        form.reset();
      } else {
        // 如果Netlify返回了非2xx状态码（通常是由于配置问题或内部错误）
        setError(t("checkNetworkMessage"));
      }
    } catch (err) {
      // 网络错误或其他异常
      setError(error);
      const title = t("failTitle");
      const message = t("checkNetworkMessage");
      showAlert("destructive", title, message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    const title = t("successSubmit");
    const message = t("successSubmitMessage");
    showAlert("success", title, message);
  }

  return (
    <Card className="w-[70vw] mx-auto h-[40vh] bg-background-dark shadow-none border-none sm:w-[30vw] sm:h-auto">
      <CardHeader className="py-3">
        <CardTitle className="text-4xl leading-normal sm:text-3xl ">
          {t("formDescription")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Netlify Form的关键部分：data-netlify="true" 和 name="contact" */}
        <form
          name="contact"
          method="POST"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          onSubmit={handleSubmit}
        >
          {/* 隐藏的输入框，用于Netlify的honeypot反垃圾邮件机制 */}
          <input type="hidden" name="form-name" value="contact" />
          <p className="hidden">
            <label>{t("hideLabel")}</label>
          </p>

          <div className="grid w-full items-center gap-4 ">
            <div className="flex flex-col space-y-3">
              <Label
                className="text-4xl leading-normal sm:text-2xl"
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
                className="text-4xl leading-normal sm:text-2xl"
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
                className="text-4xl leading-normal sm:text-2xl"
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
              className="text-3xl rounded-full bg-logo "
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
