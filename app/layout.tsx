import type { Metadata } from "next";
import { Figtree, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import CustomCursor from "@/components/CustomCursor";
import PageLoader from "@/components/PageLoader";
import LabsBackground from "@/components/LabsBackground";
import ThemeProvider from "@/components/ThemeProvider";
import ViewModeProvider from "@/components/ViewModeProvider";
import HoverPreview from "@/components/HoverPreview";
import SiteFooter from "@/components/SiteFooter";

/* Display + body.
 *
 * labs.lusion.co sets Aeonik for BOTH display and body (only labels differ,
 * in IBM Plex Mono). Aeonik is a commercial CoType face and cannot ship here,
 * so this is Figtree — the closest free match on the axes that matter:
 * geometric with near-circular bowls, single-storey 'g', large x-height, and
 * it carries the 900 weight Lusion uses for the loader counter (Space Grotesk,
 * the previous stand-in, is narrower, quirkier and stops at 700).
 *
 * One family for the whole page, exactly as Lusion does it. */
const display = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

/* Mono — exact match: labs.lusion.co uses IBM Plex Mono Medium. */
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OrigonLab",
  description: "A software development lab — design, apps, and infrastructure from one place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${display.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-bg text-ink font-body antialiased selection:bg-ink selection:text-bg">
        <ThemeProvider>
          {/* ViewModeProvider wraps BOTH Nav and the page so the GRID/LIST
              toggle in the header drives the list on the home route. */}
          <ViewModeProvider>
            {/* HoverPreview owns the floating card that trails the cursor;
                it must wrap the pages so any row can raise it. */}
            <HoverPreview>
              <LabsBackground />
              <div className="grain-overlay" aria-hidden />
              <PageLoader />
              <CustomCursor />
              <Nav />
              <div className="relative z-10">
                {children}
                <SiteFooter />
              </div>
            </HoverPreview>
          </ViewModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
