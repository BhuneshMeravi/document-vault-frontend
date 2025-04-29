"use client";

import { useState, useEffect, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import {
  CircleCheck,
  CircleAlert,
  MoreHorizontal,
  Search,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { formatBytes, formatDate } from "@/lib/utils";
import { useDocuments } from "@/hooks/use-documents";
import { Pagination } from "@/components/pagination";
import { FileUploader } from "@/components/DocumentUploader";
import { toast } from "sonner";

export default function FilesPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, isLoading, error, refetch } = useDocuments({ page, search });
  const [isDeleting, setIsDeleting] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<{
    id: string;
    filename: string;
  } | null>(null);

  useEffect(() => {}, [data, isLoading, error]);

  function handleView(id: string) {
    router.push(`/dashboard/files/${id}`);
  }

  const handleUploadComplete = () => {
    refetch();
  };

  const handleDeleteConfirm = () => {
    if (!documentToDelete) return;

    setIsDeleting(true);

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/documents/${documentToDelete.id}`,
      {
        method: "DELETE",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          toast.success("Document deleted", {
            description: `${documentToDelete.filename} has been successfully deleted.`,
          });
          refetch();
        }
      })
      .catch((error) => {
        toast.error("Error", {
          description: `Failed to delete document: ${error.message}`,
        });
      })
      .finally(() => {
        setIsDeleting(false);
        setDocumentToDelete(null);
      });
  };

  const handleDeleteRequest = (
    document: SetStateAction<{ id: string; filename: string } | null>
  ) => {
    setDocumentToDelete(document);
  };

  const handleDeleteCancel = () => {
    setDocumentToDelete(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Documents</h2>
        <FileUploader onUploadComplete={handleUploadComplete} />
      </div>
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Debug info */}
      {error && (
        <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-md">
          Error loading documents: {error.message}
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Security</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-5 w-full animate-pulse rounded bg-muted"></div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data?.data && data.data.length > 0 ? (
              data.data.map((document) => (
                <TableRow key={document.id}>
                  <TableCell className="font-medium">
                    {document.filename}
                  </TableCell>
                  <TableCell>
                    {document.contentType?.split("/")[1]?.toUpperCase() ||
                      document.contentType}
                  </TableCell>
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleView(document.id)}
                        >
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem>Download</DropdownMenuItem>
                        <DropdownMenuItem>Share</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteRequest(document)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No documents found.{" "}
                  {data ? `Response received but empty.` : `No data received.`}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Let's also update the Pagination check */}
      {data?.meta && data.meta.pages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={data.meta.pages}
          onPageChange={setPage}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!documentToDelete} onOpenChange={handleDeleteCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the document "
              {documentToDelete?.filename}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
