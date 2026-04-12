import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: true, message: "API key not configured" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Health chat API error:", JSON.stringify(data));
      return NextResponse.json(
        { error: true, message: data.error?.message || "API request failed" },
        { status: res.status }
      );
    }

    const text =
      data.content
        ?.map((b: { text?: string }) => b.text || "")
        .join("") || "";

    return NextResponse.json({ reply: text });
  } catch (err) {
    console.error("Health chat error:", err);
    return NextResponse.json(
      { error: true, message: String(err) },
      { status: 500 }
    );
  }
}
