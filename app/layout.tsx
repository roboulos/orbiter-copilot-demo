import type { Metadata } from "next";
import "@crayonai/react-ui/styles/index.css";
import "./globals.css";
import "./design-system.css";

export const metadata: Metadata = {
  title: "Orbiter Copilot",
  description: "Network intelligence — turn goals into introductions, signals into actions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
