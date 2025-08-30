import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../contexts/CartContext";
import { PriceProvider } from '@/contexts/PriceContext';
import {Banner} from "../components/Menu/Banner";
import Footer from "../components/Footer/Footer";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PAStoolz",
  description: "homePage of PAStoolz",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        
        <div className="flex flex-col min-h-screen">
          <PriceProvider>
          <CartProvider>
            <Banner />
            <main className="flex-grow">{children}</main>
            <Footer />
          </CartProvider>
          </PriceProvider>
        </div>
      </body>
    </html>
  );
}
