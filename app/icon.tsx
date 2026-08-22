import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Favicon: the same rounded "O" mark the nav uses. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex",
          alignItems: "center", justifyContent: "center",
          background: "#fff", color: "#000",
          fontSize: 42, fontWeight: 700, borderRadius: 14,
        }}
      >
        O
      </div>
    ),
    size
  );
}
