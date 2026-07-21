"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { KPIRow } from "@/components/dashboard/kpi-row";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type FinancialMovement,
  type KPIMetrics,
  type MonthlyDataPoint,
} from "@/lib/financial-types";
import { computeKPIs, computeMonthlyData } from "@/lib/financial-utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const INITIAL_FETCH_ATTEMPTS = 5;
const INITIAL_FETCH_RETRY_DELAY_MS = 1200;

const IncomeOutcomeChart = dynamic(
  () =>
    import("@/components/dashboard/income-outcome-chart").then(
      (module) => module.IncomeOutcomeChart,
    ),
  {
    ssr: false,
    loading: () => <ChartCardSkeleton />,
  },
);

const ProfitPercentChart = dynamic(
  () =>
    import("@/components/dashboard/profit-percent-chart").then(
      (module) => module.ProfitPercentChart,
    ),
  {
    ssr: false,
    loading: () => <ChartCardSkeleton />,
  },
);

function ChartCardSkeleton() {
  return (
    <Card className="border-border/60" role="status" aria-live="polite" aria-label="Loading chart">
      <CardHeader className="pb-4">
        <Skeleton className="h-5 w-52" />
        <Skeleton className="mt-1 h-3 w-64" />
      </CardHeader>
      <CardContent>
        <span className="sr-only">Loading chart</span>
        <Skeleton className="h-[280px] w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}

async function fetchFinancialData(signal?: AbortSignal): Promise<FinancialMovement[]> {
  const response = await fetch(`${API_BASE_URL}/api/metrics`, { signal });
  if (!response.ok) {
    throw new Error(`Failed to fetch financial data: ${response.status}`);
  }
  return response.json();
}

function waitForRetry(delayMs: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      if (signal) {
        signal.removeEventListener("abort", abortHandler);
      }
      resolve();
    }, delayMs);

    function abortHandler() {
      window.clearTimeout(timeoutId);
      reject(new DOMException("The operation was aborted.", "AbortError"));
    }

    if (signal) {
      signal.addEventListener("abort", abortHandler, { once: true });
    }
  });
}

async function fetchFinancialDataWithRetry(signal?: AbortSignal): Promise<FinancialMovement[]> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= INITIAL_FETCH_ATTEMPTS; attempt += 1) {
    try {
      return await fetchFinancialData(signal);
    } catch (error) {
      if ((error as { name?: string })?.name === "AbortError") {
        throw error;
      }

      lastError = error;

      if (attempt === INITIAL_FETCH_ATTEMPTS) {
        break;
      }

      await waitForRetry(INITIAL_FETCH_RETRY_DELAY_MS, signal);
    }
  }

  throw lastError;
}

function App() {
  const [metrics, setMetrics] = useState<KPIMetrics | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetchFinancialDataWithRetry(controller.signal)
      .then((movements) => {
        setMetrics(computeKPIs(movements));
        setMonthlyData(computeMonthlyData(movements));
      })
      .catch((err: unknown) => {
        if ((err as { name?: string })?.name === "AbortError") {
          return;
        }

        setError(
          "No se pudo cargar la informacion financiera. Revisa la API de backend.",
        );
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <main className="dark min-h-screen bg-background text-foreground" aria-busy={loading}>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <div id="main-content" tabIndex={-1} className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <DashboardHeader period="2024 - Full Year" />

          <p className="sr-only" role="status" aria-live="polite">
            {loading
              ? "Loading financial dashboard data"
              : "Financial dashboard data loaded"}
          </p>

          {error ? (
            <div
              role="alert"
              aria-live="assertive"
              className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive-foreground"
            >
              {error}
            </div>
          ) : null}

          <section aria-labelledby="kpi-section-title">
            <h2 id="kpi-section-title" className="sr-only">
              Key performance indicators
            </h2>
            <KPIRow metrics={metrics} loading={loading} />
          </section>

          <section
            aria-labelledby="charts-section-title"
            className="grid grid-cols-1 gap-4 xl:grid-cols-2"
          >
            <h2 id="charts-section-title" className="sr-only">
              Financial charts
            </h2>
            <IncomeOutcomeChart data={monthlyData} loading={loading} />
            <ProfitPercentChart data={monthlyData} loading={loading} />
          </section>
        </div>
      </div>
    </main>
  );
}

export default App;
