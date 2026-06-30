import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Vidplus+",
  description: "Platform streaming eksklusif untuk drama pendek vertikal premium",
  icons: {
    icon: "/favicon.png",
  }
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  return (
    <html lang={lang}>
      <body>{children}</body>
    </html>
  );
}
