import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sky Logo Converter",
  description: "Convert images to Minecraft schematics with obsidian and crying obsidian.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-gold antialiased selection:bg-gold selection:text-black">
        {children}
      </body>
    </html>
  );
}
