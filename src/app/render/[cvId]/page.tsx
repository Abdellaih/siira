import { notFound } from "next/navigation";
import CVPreview from "@/components/preview/CVPreview";
import { createEmptyCV } from "@/lib/styles/defaults";
import type { CVProfile } from "@/types/cv";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ cvId: string }>;
  searchParams: Promise<{ token?: string; data?: string }>;
}

export default async function RenderPage({ params, searchParams }: Props) {
  const { cvId } = await params;
  const { token, data } = await searchParams;

  // For guest CVs, the data is passed as a base64-encoded JSON string
  // In Phase 3, authenticated CVs will be fetched from the database
  let cv: CVProfile;

  if (data) {
    try {
      const decoded = Buffer.from(data, "base64").toString("utf-8");
      cv = JSON.parse(decoded) as CVProfile;
    } catch {
      notFound();
    }
  } else {
    // Placeholder until database is wired up in Phase 3
    cv = createEmptyCV({ id: cvId });
  }

  // Render page with no chrome — pure document
  return (
    <html lang={cv.cvLanguage} dir={cv.cvLanguage === "ar" ? "rtl" : "ltr"}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600;700&family=Noto+Naskh+Arabic:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body { background: white; }
          @page { margin: 0; size: ${cv.activeStyleId === "canadian" ? "letter" : "A4"}; }
        `}</style>
      </head>
      <body>
        <CVPreview cv={cv} forPDF />
      </body>
    </html>
  );
}
