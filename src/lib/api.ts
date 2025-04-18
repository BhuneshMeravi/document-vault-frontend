const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function fetchAPI(endpoint: string, options?: { method?: string; body?: string; headers?: Record<string, string> }) {
  let accessToken;
  
  if (typeof window !== 'undefined') {
    accessToken = localStorage.getItem('accessToken');
  }
  
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
  console.log(`API Request to ${endpoint}:`, { method: mergedOptions.method });

  try {
    const response = await fetch(`${API_URL}${endpoint}`, mergedOptions);
    console.log(`API Response for ${endpoint}:`, { status: response.status, statusText: response.statusText });
    
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    // if (!response.ok) {
    //   const errorMessage = typeof data === 'object' && data.message ? data.message : 'API request failed';
    //   console.error(`API Error (${response.status}):`, errorMessage);
    //   throw new Error(errorMessage);
    // }
    
    return data;
  } catch (error) {
    console.error(`API Error for ${endpoint}:`, error);
    throw error;
  }
}