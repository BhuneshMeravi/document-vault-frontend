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
}

interface AuditLogsResponse {
  data: AuditLog[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

interface UseAuditLogsOptions {
  page?: number;
  limit?: number;
  search?: string;
  filter?: string;
  documentId?: string;
}

// This would normally fetch from your API
export function useAuditLogs({ page = 1, limit = 50, search = "", filter = "all", documentId }: UseAuditLogsOptions = {}) {
  return useQuery<AuditLogsResponse>({
    queryKey: ["audit-logs", page, limit, search, filter, documentId],
    queryFn: () => {
      // For demo purposes, we're using mock data
      // In a real app, you'd use fetch or axios to get the data from your API
      const mockData = {
        data: [
          {
            id: "2fee5bb9-f82a-4739-aa38-e23df374f2ef",
            action: "UPLOAD",
            userId: "25002f5c-d6c9-4d99-8e7d-721696497dea",
            accessLinkId: null,
            ipAddress: "::1",
            userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
            timestamp: "2025-04-12T14:35:54.094Z",
            documentId: "27df0f87-de17-4fa4-8aa8-e8e3883984e5"
          },
          {
            id: "4bbaee44-d2fc-4aef-8451-fbef6b3d8b6f",
            action: "SHARE",
            userId: "25002f5c-d6c9-4d99-8e7d-721696497dea",
            accessLinkId: "ab35d731-9ba3-45e6-ac8d-9269db9abec2",
            ipAddress: "::1",
            userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
            timestamp: "2025-04-12T13:38:42.701Z",
            documentId: "252f769d-11e6-4b25-899c-3f9953ee54ac"
          },
          {
            id: "fc5b762a-7517-49dd-813b-e5b92f2efe8b",
            action: "UPLOAD",
            userId: "25002f5c-d6c9-4d99-8e7d-721696497dea",
            accessLinkId: null,
            ipAddress: "::1",
            userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
            timestamp: "2025-04-12T13:28:56.744Z",
            documentId: "252f769d-11e6-4b25-899c-3f9953ee54ac"
          }
        ],
        meta: {
          total: 3,
          page: page,
          limit: limit,
          pages: 1
        }
      };

      // Filter by documentId if provided
      if (documentId) {
        mockData.data = mockData.data.filter(log => log.documentId === documentId);
      }

      // Simulate API delay
      return new Promise<AuditLogsResponse>((resolve) => {
        setTimeout(() => resolve(mockData), 500);
      });
    },
  });
}