import type { Metadata } from "next";
import App from "@/App";

export const metadata: Metadata = {
  title: "Overview",
  description:
    "Vista principal del dashboard financiero con ingresos, egresos y utilidad por mes.",
};

export default function HomePage() {
  return <App />;
}
