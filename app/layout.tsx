import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: 'Portfolio',
    template: '%s | Portfolio',
  },
  description: 'Personal portfolio showcasing projects, experience, education, and certifications.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: defaultUrl,
    siteName: 'Portfolio',
    title: 'Portfolio',
    description: 'Personal portfolio showcasing projects, experience, education, and certifications.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio',
    description: 'Personal portfolio showcasing projects, experience, education, and certifications.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

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
