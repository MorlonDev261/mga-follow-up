"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SwapWallet } from "@icons";
import { MoreHorizontal } from "lucide-react";
import moment from "moment";
import { NextSeo } from "next-seo";

import ProductTable from "@components/Table/Stock";
import Counter from "@components/Counter";
import Caisse from "./Caisse";
import Balance from "@components/Balance";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ColumnDef, Row } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Types
type Product = {
  id: number;
  productId: string;
  productName: string;
  date: Date;
  dateStock: Date;
  comment: string;
};

type Stock = {
  id: string;
  name: string;
  inStock?: number;
  sales?: number;
  value?: number;
  color?: string;
};

export default function PendingContent({ stocks }: { stocks: Stock[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const caisseParam = searchParams.get("caisse");

  const [rawData, setRawData] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const dataCaisse = stocks;

  const getCaisseName = (caisseId: string) =>
    dataCaisse.find((caisse) => caisse.id === caisseId)?.name || "Unknown";

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/stocks/cmacjsr390004ld0406t3vxpq");
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
  }, []);

  const data = React.useMemo(
    () => (caisseParam ? rawData.filter((item) => item.productId === caisseParam) : rawData),
    [rawData, caisseParam]
  );

  const totalPending = React.useMemo(() => data.length, [data]); // Change if amount is available

  const subtitle = caisseParam
    ? `Pending payments from ${getCaisseName(caisseParam)}.`
    : `All pending payments are displayed.`;

  const Columns: ColumnDef<Product>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => <div>{moment(row.getValue("date")).format("DD/MM/YYYY")}</div>,
  },
  {
    accessorKey: "productName",
    header: "Designation",
  },
  {
    accessorKey: "dateStock",
    header: "Date Stock",
    cell: ({ row }) => <div>{moment(row.getValue("dateStock")).format("DD/MM/YYYY")}</div>,
  },
  {
    id: "actions",
    header: "Actions",
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
              onClick={() => router.push(`?caisse=${encodeURIComponent(product.productId)}`)}
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
        title={`Pending Payments - ${caisseParam ? getCaisseName(caisseParam) : "All Caisse"}`}
        description={`View all pending payments${caisseParam ? ` from ${getCaisseName(caisseParam)}` : ""}.`}
      />

      <div className={cn("px-2 transition-opacity", { "opacity-100": !loading, "opacity-0": loading })}>
        <Balance
          title={<><SwapWallet /> Transactions</>}
          balance={
            loading
              ? "Loading..."
              : data.length > 0
              ? <><Counter end={totalPending} duration={0.8} /> en attente</>
              : "No pending payment added."
          }
          balanceColor="text-green-500 hover:text-green-600"
          subtitle={subtitle}
          subtitleSize="text-sm"
        >
          {!loading && data.length > 0 && (
            <button className="relative flex bg-red-500 items-center text-white rounded overflow-hidden">
              <span className="bg-red-500 p-1 clip-debit">Débit</span>
              <span className="bg-green-500 p-1 pl-2 clip-credit">Crédit</span>
            </button>
          )}
        </Balance>

        <Caisse caisses={dataCaisse} />

        <div className="pt-2">
          <ProductTable Columns={Columns} data={loading ? [] : data} loading={loading} />
        </div>
      </div>
    </>
  );
}
