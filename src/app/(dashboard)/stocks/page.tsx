import { Suspense } from "react";
import StockContent from "./PendingContent";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StockContent />
    </Suspense>
  );
}
