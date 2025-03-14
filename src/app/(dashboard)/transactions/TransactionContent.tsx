"use client";

import * as React from "react";
import Head from "next/head";
import { useSearchParams, useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa";
import { FiClock } from "react-icons/fi";
import { MoreHorizontal } from "lucide-react";
import moment from "moment";
import Transactions from "@components/Table/Transactions";
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

type Payment = {
  id: string;
  date: string;
  comments: string;
  amount: number;
  caisse: string;
};

const dataCaisse = [
  { id: "uzRt253", name: "Caisse 1", value: 457900, color: "from-blue-500 to-blue-700 text-white" },
  { id: "7264Yehf", name: "Caisse 2", value: 457900, color: "from-orange-500 to-orange-700 text-white" },
  { id: "jdjbe59Jz", name: "Caisse 3", value: 457900, color: "from-yellow-400 to-yellow-600 text-white" },
  { id: "7uet357eH", name: "Caisse 4", value: 4476900, color: "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300" },
  { id: "zyegq753JsG", name: "Caisse 5", value: 4837900, color: "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300" },
  { id: "djhe5292H", name: "Caisse 6", value: 364900, color: "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300" },
];

export default function PendingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const caisseParam = searchParams.get("caisse");

  const [rawData, setRawData] = React.useState<Payment[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/transactions");
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

  const data = React.useMemo(
    () => (caisseParam ? rawData.filter((item) => item.caisse === caisseParam) : rawData),
    [rawData, caisseParam]
  );

  const totalPending = React.useMemo(() => data.reduce((acc, item) => acc + item.amount, 0), [data]);

  const subtitle = caisseParam
    ? `Pending payments from caisse: ${caisseParam}.`
    : `All pending payments are displayed.`;

  const baseColumns: ColumnDef<Payment>[] = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => <div>{moment(row.getValue("date")).format("DD/MM/YYYY")}</div>,
    },
    { accessorKey: "comments", header: "Comments" },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }: { row: Row<Payment> }) => (
        <div className="text-center">{row.getValue("amount").toLocaleString()} Ar</div>
      ),
    },
    {
      accessorKey: "caisse",
      header: "Caisse",
      cell: ({ row }: { row: Row<Payment> }) => <div className="text-center">{row.getValue("caisse")}</div>,
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
      <Head>
        <title>Pending Payments - {caisseParam ? caisseParam : "All Caisse"}</title>
        <meta name="description" content={`View all pending payments${caisseParam ? ` from caisse ${caisseParam}` : ""}.`} />
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

      <Caisse caisses={dataCaisse} />

      <div className="pt-2">
        <Transactions Columns={Columns} data={loading ? [] : data} loading={loading} />
      </div>
    </>
  );
}
