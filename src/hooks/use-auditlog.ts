"use client";

import { useQuery } from "@tanstack/react-query";

// Define a specific type for action details instead of using Record<string, any>
interface ActionDetails {
  fileSize?: string;
  fileType?: string;
  uploadMethod?: string;
  [key: string]: string | number | boolean | undefined; // For other potential properties with known types
}

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
  actionDetails?: ActionDetails;
}

interface UseAuditLogOptions {
  enabled?: boolean;
}

export function useAuditLog(logId: string, options: UseAuditLogOptions = {}) {
  return useQuery<AuditLog>({
    queryKey: ["audit-log", logId],
    queryFn: async () => {
      // For demo purposes, we're using mock data
      // In a real app, you'd use fetch or axios to get the data from your API
      
      // Simulate fetching a specific log by ID
      const mockLog: AuditLog = {
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
        setTimeout(() => resolve(mockLog), 300);
      });
    },
    enabled: options.enabled !== false && !!logId,
    staleTime: 5 * 60 * 1000, // 5 minutes - data won't refresh unnecessarily
    gcTime: 10 * 60 * 1000,   // 10 minutes - keep data in cache longer
  });
}