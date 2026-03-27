import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
