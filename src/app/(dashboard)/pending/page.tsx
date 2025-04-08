import { Suspense } from "react";
import useProtectPage from '@/hooks/protect-server-page'
import PendingContent from "./PendingContent";

export default function Page() {
  useProtectPage()
  return (
    <Suspense>
      <PendingContent />
    </Suspense>
  );
}
