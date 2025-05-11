"use client";

import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { BsShopWindow } from "react-icons/bs";
import { MoreHorizontal } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import moment from "moment";
import { NextSeo } from "next-seo";

import DialogPopup from "@components/DialogPopup";
import ProductForm from "@components/Insertion/ProductForm";
import ProductTable from "@components/Table/Stock";
import Counter from "@components/Counter";
import StockList from "./StockList";
import Balance from "@components/Balance";
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

export default function PendingContent({ stocks, companyId }: { stocks: Stock[], companyId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stockParam = searchParams.get("stock");

  const [rawData, setRawData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const dataStock = stocks;
  const [open, setOpen] = useState(false);

  const getStockName = (stockId: string) =>
    dataStock.find((stock) => stock.id === stockId)?.name || "Unknown";
  
  useEffect(() => {
    if (!companyId) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/stocks/${companyId}`);
        if (!response.ok) throw new Error("Failed to fetch data");

        const result: Product[] = await response.json();
        setRawData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId]);
  
  const data = useMemo(
    () =>
      stockParam
        ? rawData.filter((item) => item.dateStock === stockParam)
        : rawData,
    [rawData, stockParam]
  );

  const totalStock = useMemo(() => data.length, [data]);

  const subtitle = stockParam
    ? `Stock from ${getStockName(stockParam)}.`
    : `All Stocks are displayed.`;

  const Columns: ColumnDef<Product>[] = [
    {
      accessorKey: "date",
      header: "DATE",
      cell: ({ row }) => <div>{moment(row.getValue("date")).format("YYYY-MM-DD")}</div>,
    },
    {
      accessorKey: "productName",
      header: "DESIGNATION",
    },
    {
      accessorKey: "dateStock",
      header: "DATE STOCK",
      cell: ({ row }) => <div>{moment(row.getValue("dateStock")).format("YYYY-MM-DD")}</div>,
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
                onClick={() => router.push(`?stock=${encodeURIComponent(product.dateStock)}`)}
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

      <div className={cn("px-2 transition-opacity", { "opacity-100": !loading, "opacity-0": loading })}>
        <Balance
          title={<><BsShopWindow /> Stocks</>}
          balance={
            loading
              ? "Loading..."
              : data.length > 0
              ? <><Counter end={totalStock} duration={0.8} /> pcs dans {stockParam ? "le stock" : "tous les stocks"}</>
              : "No product added in stock."
          }
          balanceColor="text-green-500 hover:text-green-600"
          subtitle={subtitle}
          subtitleSize="text-sm"
        >
          {!loading && (
            <>
              <button 
                className="relative flex bg-blue-500 items-center text-white rounded overflow-hidden" 
                onClick={() => setOpen(prev => !prev)}
              >
                Add new Stock
              </button>
              {/* Modale Produit */}
              <DialogPopup
                isOpen={open}
                onClose={() => setOpen(false)}
                title="Ajouter un nouveau produit"
                description="Veuillez remplir les détails du produit à enregistrer."
              >
                <ProductForm setOpen={() => setOpen(prev => !prev)} />
              </DialogPopup>
            </>
          )}
        </Balance>

        <StockList stocks={dataStock} />

        <div className="pt-2">
          <ProductTable Columns={Columns} data={loading ? [] : data} loading={loading} />
        </div>
      </div>
    </>
  );
}
