import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./cinematic.css";
import "./immersion.css";
import { LanguageProvider } from '../components/Language';
export const metadata: Metadata = {
  title: "GWD Genesis — An AI-Native World",
  description:
    "Explore the five layers of GoWorld Digital’s proposed AI-native organization.",
};
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body><LanguageProvider>{children}</LanguageProvider></body>
    </html>
  );
}
