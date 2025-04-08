import { Suspense } from "react";
import PendingContent from "./PendingContent";

export default function Page() {
  return (
    <Suspense>
      <PendingContent />
    </Suspense>
  );
}
