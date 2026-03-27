import type { Metadata } from "next";
import "./globals.css";
import MagicCursor from "@/components/MagicCursor";

export const metadata: Metadata = {
  title: "Magical Floating Library",
  description: "An immersive 3D experience for reading ancient stories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MagicCursor />
        {children}
      </body>
    </html>
  );
}
