"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function useParams() {
  const searchParams = useSearchParams();
  const [params, setParams] = useState<Record<string, string | null>>({});

  useEffect(() => {
    const newParams: Record<string, string | null> = {};
    searchParams.forEach((value, key) => {
      newParams[key] = value;
    });

    setParams(newParams);
  }, [searchParams]);

  const getParams = (key: string) => params[key] || null;

  return { getParams };
}
