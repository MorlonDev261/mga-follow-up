import { listStocksByCompany } from "@/actions";
import StockContent from "./StockContent";
import { auth } from "@/lib/auth";

export default async function Page() {
  const session = await auth();

  if (!session?.selectedCompany) {
    return <div>Aucune entreprise sélectionnée</div>;
  }

  const stocks = await listStocksByCompany(session.selectedCompany);

  return <StockContent stocks={stocks} />;
}
