import { ThemeProvider } from "../components/theme-provider";
import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "sonner"
import { AuthProvider } from "./context/AuthContext"
import { SourceProvider } from "./context/SourceContext"



// Register Syncfusion license

export const metadata: Metadata = {
  title: "PaperCraft - Ihr digitaler Assistent für akademisches Schreiben",
  description: "Organisieren Sie Ihre Hausarbeiten effizient mit PaperCraft",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SourceProvider>
              {children}
            </SourceProvider>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
