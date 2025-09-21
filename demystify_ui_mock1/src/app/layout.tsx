import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Inter, Lexend } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-headline',
})


export const metadata: Metadata = {
  title: "Legal Clarity",
  description: "AI-powered legal document analysis",
  icons: {
    icon: "/favicon.ico", // or "/favicon.png" or "/favicon.svg"
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${lexend.variable} font-body antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
