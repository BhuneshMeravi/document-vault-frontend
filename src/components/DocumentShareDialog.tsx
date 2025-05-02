import React, { useState } from "react";
import { Copy, Link, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import axios from "axios";

interface DocumentShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  documentName: string;
}

export const DocumentShareDialog: React.FC<DocumentShareDialogProps> = ({
  isOpen,
  onClose,
  documentId,
  documentName,
}) => {
  const [accessLink, setAccessLink] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen && documentId) {
      generateShareLink();
    }
  }, [isOpen, documentId]);

  const generateShareLink = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/access-links/document/${documentId}`,
        {
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      
      if (response.data && response.data.length > 0) {
        setAccessLink(response.data[0].accessUrl);
      } else {
        throw new Error("No access link available");
      }
    } catch (err) {
      console.error("Failed to generate share link:", err);
      setError("Failed to generate share link. Please try again.");
      toast.error("Sharing failed", {
        description: "Could not generate a sharing link for this document.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(accessLink);
    toast.success("Link copied!", {
      description: "Document link has been copied to clipboard.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Document</DialogTitle>
          <DialogDescription>
            Share "{documentName}" securely with others
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="py-4">
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
            <Button 
              variant="outline" 
              className="mt-4 w-full" 
              onClick={generateShareLink}
            >
              Try Again
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <label htmlFor="link" className="sr-only">
                  Share link
                </label>
                <div className="flex items-center">
                  <Link className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="link"
                    readOnly
                    value={accessLink}
                    className="font-mono text-sm"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  This link expires in 1 month and allows anyone with the link to view this document.
                </p>
              </div>
              <Button type="button" size="icon" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
        
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentShareDialog;