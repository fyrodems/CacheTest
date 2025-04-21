import React from "react";
import { formatDistance } from "date-fns";
import { pl } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import type { RecentTestSessionViewModel } from "@/lib/types/dashboard";
import { CheckCircle, XCircle, Clock, Server, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TestSessionItemProps {
  session: RecentTestSessionViewModel;
}

const TestSessionItem: React.FC<TestSessionItemProps> = ({ session }) => {
  const getStatusIcon = () => {
    switch (session.status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <Server className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (session.status) {
      case "success":
        return "Sukces";
      case "failed":
        return "Błąd";
      case "pending":
        return "W trakcie";
      default:
        return "Nieznany";
    }
  };

  const formattedDate = session.created_at
    ? formatDistance(new Date(session.created_at), new Date(), {
        addSuffix: true,
        locale: pl,
      })
    : "Nieznana data";

  return (
    <div className="p-4 border rounded-lg flex items-center justify-between hover:bg-accent/30 transition-colors">
      <div className="flex items-center gap-3">
        {getStatusIcon()}
        <div>
          <h3 className="font-medium">{session.name || "Sesja testowa"}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{formattedDate}</span>
            <span>•</span>
            <Badge
              variant={
                session.status === "success"
                  ? "success"
                  : session.status === "failed"
                    ? "destructive"
                    : "outline"
              }
            >
              {getStatusText()}
            </Badge>
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => (window.location.href = `/test-details/${session.id}`)}
        className="text-xs font-normal"
      >
        Szczegóły
        <ArrowRight className="ml-1 h-3 w-3" />
      </Button>
    </div>
  );
};

export default TestSessionItem;
