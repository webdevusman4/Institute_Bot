import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: "transparent",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {/* The Isometric Stack SVG */}
                <svg width="28" height="28" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 256 120 L 400 192 L 256 264 L 112 192 Z" fill="#0ea5e9" />
                    <path d="M 112 264 L 256 336 L 400 264" fill="none" stroke="#4f46e5" strokeWidth="48" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M 112 336 L 256 408 L 400 336" fill="none" stroke="#7c3aed" strokeWidth="48" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
        ),
        { ...size }
    );
}