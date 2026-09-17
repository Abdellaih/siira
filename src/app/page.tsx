// Root page: middleware handles locale detection and redirects here.
// This file is a fallback; normally next-intl middleware routes to /[locale].
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/fr");
}
