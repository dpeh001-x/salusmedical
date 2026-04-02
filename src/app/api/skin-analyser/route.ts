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
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Anthropic API error:", JSON.stringify(data));
      return NextResponse.json({ error: true, message: data.error?.message || "API request failed" }, { status: res.status });
    }

    const text =
      data.content?.map((b: { text?: string }) => b.text || "").join("") || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Skin analyser error:", err);
    return NextResponse.json({ error: true, message: String(err) }, { status: 500 });
  }
}
