// lib/hooks/useStocks.ts
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useStockSummary() {
  return useSWR("/api/stocks/summary", fetcher);
}

export function useProducts(companyId: string | null) {
  return useSWR(companyId ? `/api/products/${companyId}` : null, fetcher);
}
