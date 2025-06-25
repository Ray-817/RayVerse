import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Textarea } from "@components/ui/textarea";
import { Button } from "@components/ui/Button";
import { useTranslation } from "react-i18next";

function FeedbackForm() {
  const { t } = useTranslation();

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
          action="/success"
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
            >
              {t("submit")}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}

export default FeedbackForm;
