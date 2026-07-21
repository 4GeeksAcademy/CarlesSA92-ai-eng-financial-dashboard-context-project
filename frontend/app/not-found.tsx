import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pagina no encontrada",
  description:
    "La ruta solicitada no existe en el dashboard de metricas financieras.",
};

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold tracking-tight">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          La pagina que buscas no existe o fue movida.
        </p>
      </div>
    </main>
  );
}
