import { NextResponse } from "next/server";

// Real API endpoint
const API_URL = "https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json";

export async function GET() {
  try {
    // Fetch data from the real API endpoint
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch doctor data");
    }
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching doctor data:", error);
    return NextResponse.json(
      { error: "Failed to fetch doctor data" },
      { status: 500 }
    );
  }
}
