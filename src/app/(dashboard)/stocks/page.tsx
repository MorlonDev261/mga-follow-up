import { Suspense } from "react";
import StockContent from "./StockContent";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StockContent />
    </Suspense>
  );
}
