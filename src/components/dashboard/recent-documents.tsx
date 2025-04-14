"use client";

import Link from "next/link";
import { formatBytes, formatDate } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CircleCheck, CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDocuments } from "@/hooks/use-documents";

export function RecentDocuments() {
  const { data, isLoading } = useDocuments({ page: 1, limit: 5 });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 w-full animate-pulse rounded bg-muted"></div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Security</TableHead>
            <TableHead>Uploaded</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.data?.length ? (
            data.data.map((document: any) => (
              <TableRow key={document.id}>
                <TableCell className="font-medium">{document.filename}</TableCell>
                <TableCell>{document.contentType.split('/')[1].toUpperCase()}</TableCell>
                <TableCell>{formatBytes(document.size)}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {document.isEncrypted ? (
                      <>
                        <CircleCheck className="mr-2 h-4 w-4 text-green-500" />
                        <span>Encrypted</span>
                      </>
                    ) : (
                      <>
                        <CircleAlert className="mr-2 h-4 w-4 text-amber-500" />
                        <span>Not Encrypted</span>
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell>{formatDate(document.createdAt)}</TableCell>
                <TableCell>
                  <Button variant="ghost" asChild>
                    <Link href={`/dashboard/files/${document.id}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No documents found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-end">
        <Button variant="outline" asChild>
          <Link href="/dashboard/files">View All</Link>
        </Button>
      </div>
    </div>
  );
}