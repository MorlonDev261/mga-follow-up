import { listStocksByCompany } from "@/actions";
import StockContent from "./StockContent";

export default async function Page() {
  const companyId = "cma5mvy3i0000l504izi8zb2i";
  const stocks = await listStocksByCompany(companyId);
  
  return (
    <StockContent stocks={stocks} />
  );
}
