import { listStocksByCompany } from "@/actions";
import StockListClient from "./StockListClient";

const StockList = async () => {
  const companyId = "cma5mvy3i0000l504izi8zb2i";
  const stocks = await listStocksByCompany(companyId);

  return <StockListClient stocks={stocks} />;
};

export default StockList;
