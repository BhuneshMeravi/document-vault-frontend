import { fetchAPI } from "./api";

export async function login(email: string, password: string) {
  
  try {
    const response = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response && response.accessToken) {
      localStorage.setItem('accessToken', response.accessToken);
      document.cookie = `auth_token=${response.accessToken}; path=/; max-age=86400; samesite=strict`;
      return response;
    } else {
      throw new Error("No access token received");
    }
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

export async function register(email: string, password: string, name: string) {
  try{
  const response = await fetchAPI(`/auth/register`, {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
  });

  if (response && response.accessToken) {
    localStorage.setItem('accessToken', response.accessToken);
    document.cookie = `auth_token=${response.accessToken}; path=/; max-age=86400; samesite=strict`;
  }

  return response;
} catch (error) {
  console.error("Registration failed:", error);
  throw error;
}
}

export const registerUser = register;

export async function getUserProfile() {
  const response = await fetchAPI(`/users/profile`, {
    method: "GET",
  });

  return response;
}

export async function verifyAuth() {
  try {
    const data = await fetchAPI("/auth/verify", {
      method: "POST",
    });

    return { authenticated: true, user: data.user };
  } catch (error) {
    console.error("Auth verification failed:", error);
    return { authenticated: false, user: null };
  }
}

export async function logout() {
  try {
    await fetchAPI('/auth/logout', {
      method: 'POST',
    });
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    localStorage.removeItem('accessToken');
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}