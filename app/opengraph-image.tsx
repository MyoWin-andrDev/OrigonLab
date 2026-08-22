import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "OrigonLab — design, apps and infrastructure from one lab";

/**
 * Social preview card. Generated rather than committed as a PNG so it stays
 * in sync with the brand without anyone re-exporting an image.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          justifyContent: "space-between", background: "#000", padding: 80,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 56, height: 56, borderRadius: 14, background: "#fff",
              color: "#000", fontSize: 34, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            O
          </div>
          <div style={{ color: "#8A8A8A", fontSize: 24, letterSpacing: 4 }}>
            ORIGONLAB
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ color: "#fff", fontSize: 76, lineHeight: 1.05, maxWidth: 900 }}>
            Design, apps and infrastructure from one lab
          </div>
          <div style={{ color: "#8A8A8A", fontSize: 28 }}>
            Brand · UI/UX · Web · Mobile
          </div>
        </div>
      </div>
    ),
    size
  );
}
