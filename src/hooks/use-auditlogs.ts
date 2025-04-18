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

export function useAuditLogs({ page = 1, limit = 50, search = "", filter = "all", documentId }: UseAuditLogsOptions = {}) {
  return useQuery<AuditLogsResponse>({
    queryKey: ["audit-logs", page, limit, search, filter, documentId],
    queryFn: async () => {
      // Build query parameters
      const params = new URLSearchParams();
      
      if (page) params.append("page", page.toString());
      if (limit) params.append("limit", limit.toString());
      if (search) params.append("search", search);
      if (filter && filter !== "all") params.append("filter", filter);
      if (documentId) params.append("documentId", documentId);
      
      const queryString = params.toString() ? `?${params.toString()}` : "";

      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/audit-logs/user${queryString}`, {
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching audit logs: ${response.status}`);
      }
      
      return response.json();
    },
    // Optional: Configure additional options
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
}