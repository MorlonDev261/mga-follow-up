import { Suspense } from "react";
import protectPage from '@/hooks/protect-server-page'
import PendingContent from "./PendingContent";

export default async function Page() {
  await protectPage()
  return (
    <Suspense>
      <PendingContent />
    </Suspense>
  );
}
