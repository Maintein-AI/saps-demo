import { Inter } from "next/font/google";
import "./globals.css";
import LayoutClient from "@/components/LayoutClient";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport = {
  width: "device-width" as const,
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${inter.variable} antialiased`}
        style={{ fontFamily: "var(--font-inter), sans-serif", backgroundColor: "#F8FAFC" }}
      >
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}