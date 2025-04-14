import { formatDate } from "@/lib/utils";
import { FileText, Upload, Share, Download, Trash, User, EyeIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface AuditLog {
  id: string;
  action: string;
  userId: string;
  accessLinkId: string | null;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  documentId: string | null;
}

interface AuditLogsListProps {
  auditLogs: AuditLog[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function AuditLogsList({ auditLogs, isLoading = false, emptyMessage = "No logs found" }: AuditLogsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!auditLogs.length) {
    return <div className="text-center py-8 text-muted-foreground">{emptyMessage}</div>;
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "UPLOAD":
        return <Upload className="h-4 w-4" />;
      case "SHARE":
        return <Share className="h-4 w-4" />;
      case "DOWNLOAD":
        return <Download className="h-4 w-4" />;
      case "DELETE":
        return <Trash className="h-4 w-4" />;
      case "VIEW":
        return <EyeIcon className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "UPLOAD":
        return "bg-blue-100 text-blue-700";
      case "SHARE":
        return "bg-green-100 text-green-700";
      case "DOWNLOAD":
        return "bg-purple-100 text-purple-700";
      case "DELETE":
        return "bg-red-100 text-red-700";
      case "VIEW":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getActionDescription = (log: AuditLog) => {
    const actionType = log.action.toLowerCase();
    const documentText = log.documentId ? "a document" : "";
    
    switch (log.action) {
      case "UPLOAD":
        return `uploaded ${documentText}`;
      case "SHARE":
        return `shared ${documentText}`;
      case "DOWNLOAD":
        return `downloaded ${documentText}`;
      case "DELETE":
        return `deleted ${documentText}`;
      case "VIEW":
        return `viewed ${documentText}`;
      default:
        return `${actionType} ${documentText}`;
    }
  };

  return (
    <div className="space-y-4">
      {auditLogs.map((log) => (
        <div key={log.id} className="flex items-start space-x-4 rounded border p-4">
          <div className={`p-2 rounded-full ${getActionColor(log.action)}`}>
            {getActionIcon(log.action)}
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="font-medium">
                User {getActionDescription(log)}
              </p>
              <span className="text-xs text-muted-foreground">
                {formatDate(log.timestamp)}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {log.documentId && (
                  <span className="flex items-center">
                    <FileText className="mr-1 h-3 w-3" /> Doc ID: {log.documentId.substring(0, 8)}...
                  </span>
                )}
                <span className="flex items-center">
                  <User className="mr-1 h-3 w-3" /> User ID: {log.userId.substring(0, 8)}...
                </span>
                <span>{log.ipAddress}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}