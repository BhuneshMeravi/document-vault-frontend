const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function fetchAPI(endpoint: string, options?: { method?: string; body?: string; headers?: Record<string, string> }) {
  const accessToken = localStorage.getItem('accessToken');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
    },
    credentials: 'include' as RequestCredentials,
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...((options?.headers) ?? {}),
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, mergedOptions);
  
  const contentType = response.headers.get('content-type');
  const data = contentType && contentType.includes('application/json') 
    ? await response.json() 
    : await response.text();
  
  if (!response.ok) {
    throw new Error(typeof data === 'object' && data.message ? data.message : 'API request failed');
  }
  
  return data;
}
