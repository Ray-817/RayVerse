import { AlertCircleIcon, CheckCircle2Icon, PopcornIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function EventAlert({ type = "err", message }) {
  const IconComponent = type === "err" ? AlertCircleIcon : CheckCircle2Icon;
  const variant = type === "err" ? "destructive" : "";
  return (
    <div>
      <Alert variant={variant}>
        <IconComponent />
        <AlertTitle>Title</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </div>
  );
}

export default EventAlert;
