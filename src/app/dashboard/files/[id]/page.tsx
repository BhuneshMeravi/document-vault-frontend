"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Share, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatBytes, formatDate } from "@/lib/utils";
import { useDocument } from "@/hooks/use-document";
import { useDocumentAuditLogs } from "@/hooks/use-document-audit-logs";
import { AuditLogsList } from "@/components/audit-logs-list";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import DocumentShareDialog from "@/components/DocumentShareDialog";

export default function DocumentDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const unwrappedParams = React.use(params);
  const documentId = unwrappedParams.id;

  const { data: document, isLoading: isLoadingDocument } =
    useDocument(documentId);
  const { data: auditLogs, isLoading: isLoadingAuditLogs } =
    useDocumentAuditLogs(documentId);
  const [activeTab, setActiveTab] = useState("details");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      toast.success("Document deleted", {
        description: "The document has been successfully deleted.",
      });
      router.push("/dashboard/files");
    } catch (error) {
      console.error("Failed to delete document:", error);
      toast.error("Deletion failed", {
        description: "Failed to delete the document. Please try again.",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (isLoadingDocument) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-8 w-64" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center">
        <h3 className="text-2xl font-bold">Document not found</h3>
        <p className="text-muted-foreground">
          The document you're looking for doesn't exist or you don't have access
          to it.
        </p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/files">Back to documents</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/files">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">
            {document.filename}
          </h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsShareDialogOpen(true)}
          >
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeleteDialogOpen(true)}
            disabled={isDeleting}
          >
            <Trash className="mr-2 h-4 w-4" />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="details">Document Details</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Document Information</CardTitle>
                <CardDescription>Details about this document</CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">
                      File name:
                    </dt>
                    <dd>{document.filename}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">
                      File type:
                    </dt>
                    <dd>{document.contentType}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">
                      File size:
                    </dt>
                    <dd>{formatBytes(document.size)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">
                      Uploaded:
                    </dt>
                    <dd>{formatDate(document.createdAt)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">
                      Last modified:
                    </dt>
                    <dd>{formatDate(document.updatedAt)}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>
                  Security details for this document
                </CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">
                      Encryption Status:
                    </dt>
                    <dd
                      className={
                        document.isEncrypted
                          ? "text-green-600"
                          : "text-amber-600"
                      }
                    >
                      {document.isEncrypted ? "Encrypted" : "Not Encrypted"}
                    </dd>
                  </div>
                  {document.isEncrypted && (
                    <div className="flex justify-between">
                      <dt className="font-medium text-muted-foreground">
                        Encryption IV:
                      </dt>
                      <dd className="font-mono text-sm">
                        {document.encryptionIv}
                      </dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">
                      File Hash:
                    </dt>
                    <dd
                      className="max-w-[250px] truncate font-mono text-sm"
                      title={document.hash}
                    >
                      {document.hash}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-muted-foreground">
                      Owner ID:
                    </dt>
                    <dd
                      className="max-w-[250px] truncate font-mono text-sm"
                      title={document.ownerId}
                    >
                      {document.ownerId}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Document Activity</CardTitle>
              <CardDescription>
                Recent activities for this document
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingAuditLogs ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <AuditLogsList auditLogs={auditLogs?.data || []} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this document?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              document "{document?.filename}" from the servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <DocumentShareDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        documentId={documentId}
        documentName={document?.filename || ""}
      />
    </div>
  );
}
