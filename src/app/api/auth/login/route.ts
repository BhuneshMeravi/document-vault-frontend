import { NextResponse } from "next/server";
import { LoginCredentials } from "@/types/auth";

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

    // if (!response.ok) {
    //   return NextResponse.json({ error: result.message || "Login failed" }, { status: response.status });
    // }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}