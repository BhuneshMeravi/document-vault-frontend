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

export function useDocument(id: string) {
  return useQuery<Document>({
    queryKey: ["document", id],
    queryFn: async () => {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/documents/${id}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      return response.data;
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
}