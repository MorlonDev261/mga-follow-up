"use client";

import { useSearchParams } from "next/navigation";

export function useParams() {
  const searchParams = useSearchParams();

  const getParams = (key: string): string | null => {
    return searchParams.get(key);
  };

  return { getParams };
}
