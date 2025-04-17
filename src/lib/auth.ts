import { fetchAPI } from "./api";

export async function login(email: string, password: string) {
  console.log("Logging in with:", { email, password });
  
  const response = await fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  
  if (response.accessToken) {
    localStorage.setItem('accessToken', response.accessToken);
  }
  
  return response;
}

export async function register(email: string, password: string, name: string) {
  const response = await fetchAPI(`/auth/register`, {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to register");
  }

  return response.json();
}

export async function getUserProfile() {
  const response = await fetchAPI(`/users/profile`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }

  return response.json();
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
    // Always clear token on logout attempt
    localStorage.removeItem('accessToken');
  }
}