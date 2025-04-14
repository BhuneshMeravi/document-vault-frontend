"use client";

import { useQuery } from "@tanstack/react-query";

interface Document {
  id: string;
  filename: string;
  description: string;
  contentType: string;
  size: number;
  path: string;
  hash: string;
  encryptionIv: string;
  isEncrypted: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

// This would normally fetch from your API
export function useDocument(id: string) {
  return useQuery<Document>({
    queryKey: ["document", id],
    queryFn: () => {
      // For demo purposes, we're using mock data
      // In a real app, you'd use fetch or axios to get the data from your API
      const mockData = {
        id,
        filename: id === "27df0f87-de17-4fa4-8aa8-e8e3883984e5" 
          ? "Free_Test_Data_2.15MB_PDF.pdf" 
          : "1.5MB.pdf",
        description: "string",
        contentType: "application/pdf",
        size: id === "27df0f87-de17-4fa4-8aa8-e8e3883984e5" ? 2248567 : 1664464,
        path: `25002f5c-d6c9-4d99-8e7d-721696497dea/${id}.pdf`,
        hash: id === "27df0f87-de17-4fa4-8aa8-e8e3883984e5" 
          ? "fbfa1593e6b2eb6d53d52f56e374f8f316403c3841d5321bd6d7d84145f91d10" 
          : "4db036ecdf5760f921523924e3f7dc7e100696af4b41dcd0a66ba0b74241e77d",
        encryptionIv: id === "27df0f87-de17-4fa4-8aa8-e8e3883984e5" ? "95feac532de14f63f72553417c6511b4" : "",
        isEncrypted: id === "27df0f87-de17-4fa4-8aa8-e8e3883984e5",
        ownerId: "25002f5c-d6c9-4d99-8e7d-721696497dea",
        createdAt: id === "27df0f87-de17-4fa4-8aa8-e8e3883984e5" 
          ? "2025-04-12T14:35:53.734Z" 
          : "2025-04-12T13:28:56.473Z",
        updatedAt: id === "27df0f87-de17-4fa4-8aa8-e8e3883984e5" 
          ? "2025-04-12T14:35:53.734Z" 
          : "2025-04-12T13:28:56.473Z"
      };

      // Simulate API delay
      return new Promise<Document>((resolve) => {
        setTimeout(() => resolve(mockData), 500);
      });
    },
  });
}