import { Suspense } from "react";
import TransactionContent from "./TransactionContent";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TransactionContent />
    </Suspense>
  );
}
