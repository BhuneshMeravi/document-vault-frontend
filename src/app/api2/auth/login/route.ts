import { NextResponse } from "next/server";
import { LoginCredentials } from "@/types/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const data: LoginCredentials = await request.json();
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("Login response:", result); 

    if (!response.ok) {
      return NextResponse.json({ error: result.message || "Login failed" }, { status: response.status });
    }

    // Store the access token in an HTTP-only cookie
    if (result.token || result.accessToken) {
      const tokenValue = result.token || result.accessToken;
      const cookieStore = cookies();
      
      // Set the token in an HTTP-only cookie that lasts for 7 days (or adjust as needed)
       (await cookieStore).set({
        name: "Authentication",
        // Use the token from the response
        // or generate a new token if needed
        // This is just an example; adjust according to your needs
        // and the structure of your token
        // For example, if the token is a JWT, you might want to decode it
        // and set specific claims in the cookie
        // For now, we are just setting the token as is
        // This is just an example; adjust according to your needs
        // and the structure of your token
        // For example, if the token is a JWT, you might want to decode it
        // and set specific claims in the cookie    
        value: tokenValue,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}