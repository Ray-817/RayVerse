/* eslint-disable no-unused-vars */
import { useState } from "react";
import config from "../config/appConfig";

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

  const GETFORM_ENDPOINT_URL = config.FORM_ENDPOINT;

  if (!GETFORM_ENDPOINT_URL) {
    console.error(
      "VITE_FORM_ENDPOINT is not defined in environment variables!"
    );
    showAlert("destructive", t("failSubmit"), t("networkErrorMessage"));
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);
    setError(null);

    const form = event.target;
    const formData = new FormData(form);

    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    try {
      const response = await fetch(GETFORM_ENDPOINT_URL, {
        // 使用环境变量
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSubmitted(true);
        form.reset();
        showAlert("success", t("successSubmit"), t("successSubmitMessage"));
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || t("checkNetworkMessage");
        setError(errorMessage);
        showAlert("destructive", t("failTitle"), errorMessage);
      }
    } catch (err) {
      setError(t("networkErrorMessage"));
      showAlert("destructive", t("failTitle"), t("networkErrorMessage"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-[70vw] mx-auto h-[40vh] bg-background-dark shadow-none border-none sm:w-[30vw] sm:h-auto">
      <CardHeader className="py-3">
        <CardTitle className="text-4xl leading-normal sm:text-3xl ">
          {t("formDescription")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form name="contact" method="POST" onSubmit={handleSubmit}>
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
