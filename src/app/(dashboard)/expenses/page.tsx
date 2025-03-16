import { Suspense } from "react";
import ExpenseContent from "./ExpenseContent";

export default function Page() {
  return (
    <Suspense>
      <ExpenseContent />
    </Suspense>
  );
}
