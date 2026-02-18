import type { Metadata } from "next";
import "@crayonai/react-ui/styles/index.css";
import "./globals.css";

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
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
