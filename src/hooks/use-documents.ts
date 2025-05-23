"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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

export function useDocuments({ page = 1, limit = 10, search = "" }: UseDocumentsOptions = {}) {
  return useQuery<DocumentsResponse, Error>({
    queryKey: ["documents", page, limit, search],
    queryFn: async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        
        if (!accessToken) {
          console.warn("No access token found in localStorage");
        }
        
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/documents`, {
          params: {
            page,
            limit,
            ...(search ? { search } : {})
          },
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        
        if (!response.data.data) {
          throw new Error("Unexpected API response format");
        }
        
        return response.data;
      } catch (error) {
        console.error("Error fetching documents:", error);
        throw error;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
}