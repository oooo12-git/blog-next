import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import React from "react";

interface SwipeHintAlertProps {
  title?: string;
  className?: string;
}

const SwipeHintAlert: React.FC<SwipeHintAlertProps> = ({
  title = "표를 좌우로 스와이프 하세요",
  className = "mb-4",
}) => {
  return (
    <Alert variant="destructive" className={className}>
      <AlertCircle className="w-4 h-4" />
      {/* prettier-ignore */}
      <AlertTitle>{title}</AlertTitle>
    </Alert>
  );
};

export default SwipeHintAlert;
