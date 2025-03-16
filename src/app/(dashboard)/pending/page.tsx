import { Suspense } from "react";
import StockContent from "./StockContent";

export default function Page() {
  return (
    <Suspense fallback={<StockContent />}>
      <StockContent />
    </Suspense>
  );
}
