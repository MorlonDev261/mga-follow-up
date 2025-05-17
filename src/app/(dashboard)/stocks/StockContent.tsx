"use client";

import * as React from "react";
import useSWR from "swr";
import moment from "moment";
import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BsShopWindow } from "react-icons/bs";
import { MoreHorizontal } from "lucide-react";
import { NextSeo } from "next-seo";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ColumnDef, Row } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import DialogPopup from "@components/DialogPopup";
import ProductForm from "@components/Insertion/ProductForm";
import ProductTable from "@components/Table/Stock";
import Counter from "@components/Counter";
import StockList from "./StockList";
import Balance from "@components/Balance";

// Types
type Product = {
  id: number;
  productId: string;
  productName: string;
  date: Date;
  dateStock: string;
  comment: string;
};

type Stock = {
  id: string;
  name: string;
  inStock?: number;
  sales?: number;
  color?: string;
};

// SWR fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Custom hooks
function useStockSummary() {
  return useSWR<Stock[]>("/api/stocks/summary", fetcher);
}

function useProducts(companyId: string | null) {
  return useSWR<Product[]>(
    companyId ? `/api/products/${companyId}` : null,
    fetcher
  );
}

export default function PendingContent({ companyId }: { companyId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stockParam = searchParams.get("stock");

  const [open, setOpen] = useState(false);

  const {
    data: stocks = [],
    isLoading: isStockLoading,
    mutate: mutateStock,
  } = useStockSummary();

  const {
    data: rawData = [],
    isLoading: isProductLoading,
    mutate: mutateProduct,
  } = useProducts(companyId);

  const mutation = async () => {
    await mutateStock(undefined, { revalidate: true });
    return mutateProduct(undefined, { revalidate: true });
  }

  const getStockName = (stockId: string) =>
    stocks.find((stock) => stock.id === stockId)?.name || "Unknown";

  const filteredData = useMemo(() => {
    return stockParam ? rawData.filter(item => item.dateStock === stockParam) : rawData;
  }, [rawData, stockParam]);

  const totalStock = filteredData.length;

  const subtitle = stockParam
    ? `Stock from ${getStockName(stockParam)}.`
    : `All Stocks are displayed.`;

  const Columns: ColumnDef<Product>[] = [
    {
      accessorKey: "date",
      header: "DATE",
      cell: ({ row }) => (
        <div>{moment(row.getValue("date")).format("YYYY-MM-DD")}</div>
      ),
    },
    {
      accessorKey: "productName",
      header: "DESIGNATION",
    },
    {
      accessorKey: "dateStock",
      header: "DATE STOCK",
      cell: ({ row }) => (
        <div>{moment(row.getValue("dateStock")).format("YYYY-MM-DD")}</div>
      ),
    },
    {
      accessorKey: "id",
      header: "IDENTIFIANT",
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }: { row: Row<Product> }) => {
        const product = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(product.id.toString())}
              >
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  router.push(`?stock=${encodeURIComponent(product.dateStock)}`)
                }
              >
                Show from same product
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <NextSeo
        title={`Stocks - ${stockParam ? getStockName(stockParam) : "All Stocks"}`}
        description={`View all Stocks${stockParam ? ` from ${getStockName(stockParam)}` : ""}.`}
      />

      <div className={cn("px-2 transition-opacity", { "opacity-100": !isProductLoading, "opacity-0": isProductLoading })}>
        <Balance
          title={
            <>
              <BsShopWindow /> Stocks
            </>
          }
          balance={
            isProductLoading ? (
              "Loading..."
            ) : totalStock > 0 ? (
              <>
                <Counter end={totalStock} duration={0.8} /> pcs dans{" "}
                {stockParam ? "le stock" : "tous les stocks"}
              </>
            ) : (
              "No product added in stock."
            )
          }
          balanceColor="text-blue-500 hover:text-blue-600"
          subtitle={subtitle}
          subtitleSize="text-sm"
        >
          {!isProductLoading && (
            <>
              <Button
                className="bg-blue-500 text-white hover:bg-blue-600 p-1"
                onClick={() => setOpen(true)}
              >
                Add new Stock
              </Button>

              <DialogPopup
                isOpen={open}
                onClose={() => setOpen(false)}
                title="Ajouter un nouveau produit"
                description="Veuillez remplir les détails du produit à enregistrer."
              >
                <ProductForm setOpen={() => setOpen(false)} mutate={mutation} />
              </DialogPopup>
            </>
          )}
        </Balance>

        <StockList stocks={stocks} />

        <div className="pt-2">
          <ProductTable Columns={Columns} data={isProductLoading ? [] : filteredData} loading={isProductLoading} />
        </div>
      </div>
    </>
  );
}
