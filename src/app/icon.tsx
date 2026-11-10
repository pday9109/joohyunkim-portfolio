import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f7f5f2",
          color: "#2a2a2a",
          fontSize: 14,
          fontFamily: "monospace",
          letterSpacing: "0.05em",
        }}
      >
        JK
      </div>
    ),
    { ...size },
  );
}
