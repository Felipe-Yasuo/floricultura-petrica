import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  icons: {
    icon: "/favicon.png",
  },
  title: {
    default: "Pétrica — Floricultura Botânica Editorial",
    template: "%s | Pétrica",
  },
  description: "Cultivando momentos através da curadoria botânica editorial. Flores frescas, arranjos exclusivos e plantas para transformar seu ambiente.",
  openGraph: {
    siteName: "Pétrica",
    locale: "pt_BR",
    type: "website",
    title: "Pétrica — Floricultura Botânica Editorial",
    description: "Cultivando momentos através da curadoria botânica editorial. Flores frescas, arranjos exclusivos e plantas para transformar seu ambiente.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Pétrica — Floricultura Botânica Editorial",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pétrica — Floricultura Botânica Editorial",
    description: "Cultivando momentos através da curadoria botânica editorial. Flores frescas, arranjos exclusivos e plantas para transformar seu ambiente.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster
              position="top-right"
              richColors
              closeButton
              toastOptions={{
                className: 'rounded-2xl',
              }}
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}