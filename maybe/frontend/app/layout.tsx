import type { Metadata } from "next";
import "../styles/globals.css"; // головний css

export const metadata: Metadata = {
  title: "Антарес",
  description: "Офіційний сайт школи Антарес",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
