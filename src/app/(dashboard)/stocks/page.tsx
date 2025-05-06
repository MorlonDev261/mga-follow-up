import { listStocksByCompany } from "@/actions";
import TransactionContent from "./TransactionContent";

export default async function Page() {
  const companyId = "cmacjsr390004ld0406t3vxpq";
  const stocks = await listStocksByCompany(companyId);
  
  return (
    <TransactionContent stocks={stocks} />
  );
}
