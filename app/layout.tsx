import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { getCachedPortfolio } from "@/lib/cache/portfolio-cache";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getCachedPortfolio().catch(() => null);
  const name = data?.profile?.full_name || 'Portfolio';
  const tagline = data?.profile?.tagline;

  const title = name;
  const description = tagline || 'Personal portfolio showcasing projects, experience, education, and certifications.';

  return {
    metadataBase: new URL(defaultUrl),
    title: {
      default: title,
      template: `%s | ${name}`,
    },
    description,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: defaultUrl,
      siteName: name,
      title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
