import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import React from "react";

interface RedAlertProps {
  title?: string;
  className?: string;
  description?: string;
}

const RedAlert: React.FC<RedAlertProps> = ({
  title = "표를 좌우로 스와이프 하세요",
  className = "mb-4",
  description,
}) => {
  return (
    <Alert
      variant="destructive"
      className={`flex flex-wrap items-center mb-2 ${className || ""}`}
    >
      <AlertCircle className="w-4 h-4" />
      {/* prettier-ignore */}
      <AlertTitle className="text-base flex-1 min-w-0">{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
};

export default RedAlert;
