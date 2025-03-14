"use client";

import * as React from "react";
import Head from "next/head";
import { useSearchParams, useRouter } from "next/navigation";
import { FaPlus, FaSyncAlt } from "react-icons/fa";
import { FiClock } from "react-icons/fi";
import { MoreHorizontal } from "lucide-react";
import moment from "moment";
import Pending from "@components/Table/Pending";
import Counter from "@components/Counter";
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

type Payment = {
  id: string;
  date: string;
  comments: string;
  amount: number;
  caisse: string;
};

export default function PendingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const caisseParam = searchParams.get("caisse");

  const [rawData, setRawData] = React.useState<Payment[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/pending");
        if (!response.ok) throw new Error("Failed to fetch data");

        const result: Payment[] = await response.json();
        setRawData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrer les paiements par caisse si `caisse` est dans l'URL
  const data = React.useMemo(
    () => (caisseParam ? rawData.filter((item) => item.caisse === caisseParam) : rawData),
    [rawData, caisseParam]
  );

  const totalPending = React.useMemo(
    () => data.reduce((acc, item) => acc + item.amount, 0),
    [data]
  );

  const subtitle = caisseParam
    ? `Pending payments from caisse: ${caisseParam}.`
    : `All pending payments are displayed.`;

  const baseColumns: ColumnDef<Payment>[] = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => <div>{moment(row.getValue("date"), "DD-MM-YY").format("DD/MM/YYYY")}</div>,
    },
    {
      accessorKey: "comments",
      header: "Comments",
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }: { row: Row<Payment> }) => (
        <div className="text-center">{row.getValue("amount")}</div>
      ),
    },
    {
      accessorKey: "caisse",
      header: "Caisse",
      cell: ({ row }: { row: Row<Payment> }) => (
        <div className="text-center">{row.getValue("caisse")}</div>
      ),
    },
  ];

  const Columns = [
    ...baseColumns,
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }: { row: Row<Payment> }) => {
        const payment = row.original;
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
              {caisseParam ? (
                <DropdownMenuItem onClick={() => router.push(`/view/pending/${payment.id}`)}>
                  Show details
                </DropdownMenuItem>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id)}>
                    Copy payment ID
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>View payment details</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => router.push(`?caisse=${encodeURIComponent(payment.caisse)}`)}
                  >
                    Show payments from this caisse
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      {/* SEO Optimisation */}
      <Head>
        <title>Pending Payments - {caisseParam ? caisseParam : "All Caisse"}</title>
        <meta
          name="description"
          content={`View all pending payments${caisseParam ? ` from caisse ${caisseParam}` : ""}.`}
        />
      </Head>

      <div
        className={cn(
          "px-2 transition-opacity",
          { "opacity-100": !loading && data.length > 0, "opacity-0": loading || data.length === 0 }
        )}
      >
        <Balance
          title={
            <>
              <FiClock /> Pending Payment
            </>
          }
          balance={
            loading
              ? "Loading..."
              : data.length > 0
              ? <>
                  <Counter end={totalPending} duration={0.8} /> Ar.
                </>
              : "No pending payment added."
          }
          balanceColor="text-yellow-500 hover:text-yellow-600"
          subtitle={subtitle}
          subtitleSize="text-sm"
        >
          <div className="flex gap-2">
            {!loading && data.length > 0 && (
              <button className="flex items-center gap-1 rounded bg-yellow-500 text-white hover:bg-yellow-600 px-2 py-1 text-sm">
                <FaPlus /> New unpaid purchase
              </button>
            )}
            {caisseParam && (
              <button
                className="flex items-center gap-1 rounded bg-gray-500 text-white hover:bg-gray-600 px-2 py-1 text-sm"
                onClick={() => router.push("/view/pending")}
              >
                <FaSyncAlt /> Reset Filter
              </button>
            )}
          </div>
        </Balance>
      </div>

      <div className="pt-2">
        {loading ? (
          <Pending Columns={Columns} data={[]} loading={true} />
        ) : data.length > 0 ? (
          <Pending Columns={Columns} data={data} loading={false} />
        ) : (
          <div className="w-full h-[65vh] flex items-center justify-center">
            <div className="-mt-5 flex flex-col items-center">
              <p className="text-gray-900 dark:text-white">
                No pending payments. Please add one.
              </p>
              <button className="px-4 mt-2 flex items-center gap-2 py-2 bg-yellow-500 text-white hover:bg-yellow-600 rounded">
                <FaPlus /> Add First Transaction
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
