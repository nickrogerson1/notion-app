import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Notion Clone",
  description: "This a clone of Notion but with limited features to serve as a demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Header />

          <div className="flex min-h-screen">
            < Sidebar />
            <div className="flex-1 p-4 bg-gray-100 overflow-y-auto
            scrollbar-hide">
              {children}
            </div>
          </div>
          <Toaster position="bottom-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}
