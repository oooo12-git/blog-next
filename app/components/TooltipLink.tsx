
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LinkIcon } from "lucide-react";
import Link from "next/link";

interface TooltipLinkProps {
  href: string;
  text: string;
}

const TooltipLink = ({ href, text }: TooltipLinkProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="link" asChild className="p-0 h-auto">
          <Link
            href={href}
            className="inline-flex items-center gap-x-2 text-base"
          >
            <LinkIcon className="h-5 w-5" />
            <span>{text}</span>
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>관련 포스팅으로 이동</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default TooltipLink;
