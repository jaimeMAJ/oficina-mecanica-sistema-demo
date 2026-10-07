import type { Metadata } from "next";
import { Crimson_Text, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const crimsonText = Crimson_Text({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-crimson-text",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans-ui",
});

export const metadata: Metadata = {
  title: "Oficina Mecânica Sistema — ThreadWeave",
  description: "Sistema de gestão para oficina mecânica com agendamentos, clientes, estoque, financeiro e ordens de serviço.",
  openGraph: {
    title: "Oficina Mecânica Sistema — ThreadWeave",
    description: "Sistema de gestão para oficina mecânica com agendamentos, clientes, estoque, financeiro e ordens de serviço.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${crimsonText.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAFAF9] text-stone-900 font-sans">
        {children}
      </body>
    </html>
  );
}
