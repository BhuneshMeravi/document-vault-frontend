import React, { useState } from "react";
import { Copy, Link, Download, Eye } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [downloadLink, setDownloadLink] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [linkType, setLinkType] = useState<"view" | "download">("view");

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
        // Base URL without download parameter
        const baseUrl = response.data[0].accessUrl;
        setAccessLink(baseUrl); // View link
        setDownloadLink(`${baseUrl}?download=true`); // Download link
      } else {
        // If no links exist, create a new one
        const createResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/access-links`,
          {
            documentId: documentId,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          },
          {
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        
        if (createResponse.data && createResponse.data.accessUrl) {
          const baseUrl = createResponse.data.accessUrl;
          setAccessLink(baseUrl); // View link
          setDownloadLink(`${baseUrl}?download=true`); // Download link
        } else {
          throw new Error("Failed to create access link");
        }
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
    const linkToCopy = linkType === "view" ? accessLink : downloadLink;
    navigator.clipboard.writeText(linkToCopy);
    toast.success("Link copied!", {
      description: `${linkType === "view" ? "View" : "Download"} link has been copied to clipboard.`,
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
            <Tabs defaultValue="view" onValueChange={(value) => setLinkType(value as "view" | "download")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="view" className="flex items-center justify-center">
                  <Eye className="mr-2 h-4 w-4" />
                  View Link
                </TabsTrigger>
                <TabsTrigger value="download" className="flex items-center justify-center">
                  <Download className="mr-2 h-4 w-4" />
                  Download Link
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="view" className="mt-4">
                <div className="flex items-center space-x-2">
                  <div className="grid flex-1 gap-2">
                    <div className="flex items-center">
                      <Link className="mr-2 h-4 w-4 text-muted-foreground" />
                      <Input
                        readOnly
                        value={accessLink}
                        className="font-mono text-sm"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Recipients can view this document in their browser without downloading.
                    </p>
                  </div>
                  <Button type="button" size="icon" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="download" className="mt-4">
                <div className="flex items-center space-x-2">
                  <div className="grid flex-1 gap-2">
                    <div className="flex items-center">
                      <Download className="mr-2 h-4 w-4 text-muted-foreground" />
                      <Input
                        readOnly
                        value={downloadLink}
                        className="font-mono text-sm"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Recipients will download this document directly to their device.
                    </p>
                  </div>
                  <Button type="button" size="icon" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
            
            <p className="mt-4 text-xs text-muted-foreground">
              Links expire in 30 days and allow anyone with the link to access this document.
            </p>
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