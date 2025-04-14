"use client";

import { useState, useEffect } from "react";
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

interface DocumentsResponse {
  data: Document[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

interface UseDocumentsOptions {
  page?: number;
  limit?: number;
  search?: string;
}

// This would normally fetch from your API
export function useDocuments({ page = 1, limit = 10, search = "" }: UseDocumentsOptions = {}) {
  // Mock API call - in a real app, this would fetch from your backend
  return useQuery<DocumentsResponse>({
    queryKey: ["documents", page, limit, search],
    queryFn: () => {
      // For demo purposes, we're using mock data
      // In a real app, you'd use fetch or axios to get the data from your API
      const mockData = {
        data: [
          {
            id: "27df0f87-de17-4fa4-8aa8-e8e3883984e5",
            filename: "Free_Test_Data_2.15MB_PDF.pdf",
            description: "string",
            contentType: "application/pdf",
            size: 2248567,
            path: "25002f5c-d6c9-4d99-8e7d-721696497dea/7019a850-f177-4aac-817d-5af772725e0d.pdf",
            hash: "fbfa1593e6b2eb6d53d52f56e374f8f316403c3841d5321bd6d7d84145f91d10",
            encryptionIv: "95feac532de14f63f72553417c6511b4",
            isEncrypted: true,
            ownerId: "25002f5c-d6c9-4d99-8e7d-721696497dea",
            createdAt: "2025-04-12T14:35:53.734Z",
            updatedAt: "2025-04-12T14:35:53.734Z"
          },
          {
            id: "252f769d-11e6-4b25-899c-3f9953ee54ac",
            filename: "1.5MB.pdf",
            description: "string",
            contentType: "application/pdf",
            size: 1664464,
            path: "25002f5c-d6c9-4d99-8e7d-721696497dea/67f0ecba-fc64-4cf7-b6cb-d9720af24609.pdf",
            hash: "4db036ecdf5760f921523924e3f7dc7e100696af4b41dcd0a66ba0b74241e77d",
            encryptionIv: "",
            isEncrypted: false,
            ownerId: "25002f5c-d6c9-4d99-8e7d-721696497dea",
            createdAt: "2025-04-12T13:28:56.473Z",
            updatedAt: "2025-04-12T13:28:56.473Z"
          }
        ],
        meta: {
          total: 2,
          page: page,
          limit: limit,
          pages: 1
        }
      };

      // Simulate API delay
      return new Promise<DocumentsResponse>((resolve) => {
        setTimeout(() => resolve(mockData), 500);
      });
    },
  });
}