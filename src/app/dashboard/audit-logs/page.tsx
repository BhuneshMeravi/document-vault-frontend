"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useAuditLogs } from "@/hooks/use-auditlogs";
import { AuditLogsList } from "@/components/audit-logs-list";
import { Pagination } from "@/components/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AuditLogsPage() {
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, isLoading } = useAuditLogs({ page, search, filter });
  // Make sure we're only rendering on the client
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Audit Logs</h2>
        <p className="text-muted-foreground">View all system activity logs</p>
      </div>

      <Tabs defaultValue="all" onValueChange={setFilter}>
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <TabsList>
            <TabsTrigger value="all">All Logs</TabsTrigger>
            <TabsTrigger value="documents">Document Logs</TabsTrigger>
            <TabsTrigger value="users">User Logs</TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                className="pl-8 w-[250px]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select defaultValue="recent">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Activity</CardTitle>
              <CardDescription>Complete system activity log</CardDescription>
            </CardHeader>
            <CardContent>
              {isClient && data?.data ? (
                <>
                  <AuditLogsList 
                    auditLogs={data.data || []} 
                    isLoading={isLoading} 
                  />
                  {data.meta && (
                    <div className="mt-4">
                      <Pagination
                        currentPage={page}
                        totalPages={data.meta.pages}
                        onPageChange={setPage}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div>Loading...</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Document Activity</CardTitle>
              <CardDescription>Document-related activity logs</CardDescription>
            </CardHeader>
            <CardContent>
              {isClient && data?.data ? (
                <AuditLogsList 
                  auditLogs={(data.data || []).filter(log => log.documentId)}
                  isLoading={isLoading}
                  emptyMessage="No document activity found"
                />
              ) : (
                <div>Loading...</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
              <CardDescription>User-related activity logs</CardDescription>
            </CardHeader>
            <CardContent>
              {isClient && data?.data ? (
                <AuditLogsList 
                  auditLogs={data.data || []} 
                  isLoading={isLoading}
                  emptyMessage="No user activity found"
                />
              ) : (
                <div>Loading...</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}