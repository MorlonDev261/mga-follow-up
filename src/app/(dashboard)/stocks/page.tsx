import { listStocksByCompany } from "@/actions";
import StockContent from "./TransactionContent";

export default async function Page() {
  const companyId = "cmacjsr390004ld0406t3vxpq";
  const stocks = await listStocksByCompany(companyId);
  
  return (
    <StockContent stocks={stocks} />
  );
}
