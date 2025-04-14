
"use client";

import { useAuditLogs } from "./use-auditlogs";

interface UseDocumentAuditLogsOptions {
  page?: number;
  limit?: number;
}

/**
 * Custom hook to fetch audit logs for a specific document
 * @param documentId The ID of the document to fetch audit logs for
 * @param options Optional pagination parameters
 * @returns Audit logs filtered by document ID
 */
export function useDocumentAuditLogs(
  documentId: string,
  { page = 1, limit = 10 }: UseDocumentAuditLogsOptions = {}
) {
  return useAuditLogs({
    documentId,
    page,
    limit,
    filter: "all",
  });
}