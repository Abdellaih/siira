import { NextRequest, NextResponse } from "next/server";
import type { CVProfile } from "@/types/cv";
import type { Browser } from "puppeteer-core";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

async function getBrowser(): Promise<Browser> {
  if (process.env.NODE_ENV === "production") {
    // In production, use the lightweight Chromium for serverless
    const chromium = (await import("@sparticuz/chromium-min")).default;
    const puppeteer = await import("puppeteer-core");
    return puppeteer.default.launch({
      args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
      executablePath: await chromium.executablePath(
        process.env.CHROMIUM_REMOTE_EXEC_PATH,
      ),
      headless: true,
    });
  }

  // Development: use puppeteer with its bundled Chromium
  const puppeteer = await import("puppeteer");
  return puppeteer.default.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
}

export async function POST(req: NextRequest) {
  let cv: CVProfile;
  try {
    cv = (await req.json()) as CVProfile;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const encoded = Buffer.from(JSON.stringify(cv)).toString("base64");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const renderUrl = `${baseUrl}/render/${cv.id}?data=${encodeURIComponent(encoded)}`;
  const pageSize = cv.activeStyleId === "canadian" ? "Letter" : "A4";

  let browser: Browser | undefined;
  try {
    browser = await getBrowser();
    const page = await browser.newPage();

    await page.goto(renderUrl, { waitUntil: "networkidle0", timeout: 30000 });

    const pdfBuffer = await page.pdf({
      format: pageSize as "Letter" | "A4",
      printBackground: true,
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
    });

    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(cv.name || "cv")}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[PDF] Generation failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "PDF generation failed" }, { status: 500 });
  } finally {
    await browser?.close();
  }
}
