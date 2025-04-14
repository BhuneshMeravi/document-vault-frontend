"use client";

import { useQuery } from "@tanstack/react-query";

interface AuditLog {
  id: string;
  action: string;
  userId: string;
  accessLinkId: string | null;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  documentId: string | null;
  // Additional details that might only be available in single log view
  userName?: string;
  documentName?: string;
  actionDetails?: Record<string, any>;
}

interface UseAuditLogOptions {
  enabled?: boolean;
}

export function useAuditLog(logId: string, options: UseAuditLogOptions = {}) {
  return useQuery<AuditLog>({
    queryKey: ["audit-log", logId],
    queryFn: () => {
      // For demo purposes, we're using mock data
      // In a real app, you'd use fetch or axios to get the data from your API
      
      // Simulate fetching a specific log by ID
      const mockLog = {
        id: logId,
        action: "UPLOAD",
        userId: "25002f5c-d6c9-4d99-8e7d-721696497dea",
        userName: "John Doe", // Additional detail not in the list view
        accessLinkId: null,
        ipAddress: "::1",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
        timestamp: "2025-04-12T14:35:54.094Z",
        documentId: "27df0f87-de17-4fa4-8aa8-e8e3883984e5",
        documentName: "Important Report.pdf", // Additional detail not in the list view
        actionDetails: {
          fileSize: "2.4MB",
          fileType: "application/pdf",
          uploadMethod: "web-interface"
        }
      };

      // Simulate API delay
      return new Promise<AuditLog>((resolve) => {
        setTimeout(() => resolve(mockLog));
      });
    },
    enabled: options.enabled !== false && !!logId,
  });
}