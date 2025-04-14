import { NextResponse } from "next/server";
import { RegisterCredentials } from "@/types/auth";

export async function POST(request: Request) {
  const data: RegisterCredentials = await request.json();
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    // if (!response.ok) {
    //   return NextResponse.json(
    //     { error: result.message || "Registration failed" }, 
    //     { status: response.status }
    //   );
    // }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}