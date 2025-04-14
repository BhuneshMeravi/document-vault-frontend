"use client";

import { useAuditLogs } from "@/hooks/use-auditlogs";
import { AuditLogsList } from "@/components/audit-logs-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function RecentActivity() {
  const { data, isLoading } = useAuditLogs({ page: 1, limit: 5 });

  return (
    <div>
      <AuditLogsList auditLogs={data?.data || []} isLoading={isLoading} />
      <div className="mt-4 flex justify-end">
        <Button variant="outline" asChild>
          <Link href="/dashboard/audit-logs">View All</Link>
        </Button>
      </div>
    </div>
  );
}