"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa";
import { FiClock } from "@react-icons/fi";
import { MoreHorizontal } from "lucide-react";
import moment from "moment";
import { NextSeo } from "next-seo";
import Transactions from "@components/Table/Transactions";
import Counter from "@components/Counter";
import Caisse from "../stocks/Caisse";
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
type Payment = {
  id: string;
  date: string;
  comments: string;
  amount: number;
  caisseId: string;
};

// Liste des caisses (stocké en local ou récupéré depuis une API)
const dataCaisse = [
  { id: "uzRt253", name: "Caisse 1", value: 457900, color: "from-blue-500 to-blue-700 text-white" },
  { id: "7264Yehf", name: "Caisse 2", value: 457900, color: "from-orange-500 to-orange-700 text-white" },
  { id: "jdjbe59Jz", name: "Caisse 3", value: 457900, color: "from-yellow-400 to-yellow-600 text-white" },
  { id: "7uet357eH", name: "Caisse 4", value: 4476900, color: "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300" },
  { id: "zyegq753JsG", name: "Caisse 5", value: 4837900, color: "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300" },
  { id: "djhe5292H", name: "Caisse 6", value: 364900, color: "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300" },
];

// Fonction pour obtenir le nom de la caisse
const getCaisseName = (caisseId: string) =>
  dataCaisse.find((caisse) => caisse.id === caisseId)?.name || "Unknown";

export default function PendingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const caisseParam = searchParams.get("caisse");

  // État pour stocker les transactions
  const [rawData, setRawData] = React.useState<Payment[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch des données au montage
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

  // Filtrer les données en fonction de la caisse sélectionnée
  const data = React.useMemo(
    () => (caisseParam ? rawData.filter((item) => item.caisseId === caisseParam) : rawData),
    [rawData, caisseParam]
  );

  // Calcul du total des paiements en attente
  const totalPending = React.useMemo(() => data.reduce((acc, item) => acc + item.amount, 0), [data]);

  // Définition du sous-titre en fonction du filtre
  const subtitle = caisseParam
    ? `Pending payments from ${getCaisseName(caisseParam)}.`
    : `All pending payments are displayed.`;

  // Définition des colonnes du tableau
  const Columns: ColumnDef<Payment>[] = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => <div>{moment(row.getValue("date")).format("DD/MM/YYYY")}</div>,
    },
    { accessorKey: "comments", header: "Comments" },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }: { row: Row<Payment> }) => {
        const amount = row.getValue("amount") as number;
        return (
          <div className={cn("text-center", { "text-green-500": amount > 0, "text-red-500": amount <= 0 })}>
            {amount}
          </div>
        );
      }
    },
    {
      accessorKey: "caisseId",
      header: "Caisse",
      cell: ({ row }: { row: Row<Payment> }) => (
        <div className="text-center">{getCaisseName(row.getValue("caisseId"))}</div>
      ),
    },
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
                  <DropdownMenuItem onClick={() => router.push(`?caisse=${encodeURIComponent(payment.caisseId)}`)}>
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
      <NextSeo
        title={`Pending Payments - ${caisseParam ? getCaisseName(caisseParam) : "All Caisse"}`}
        description={`View all pending payments${caisseParam ? ` from ${getCaisseName(caisseParam)}` : ""}.`}
      />

      <div className={cn("px-2 transition-opacity", { "opacity-100": !loading, "opacity-0": loading })}>
        <Balance
          title={<><FiClock /> Transactions</>}
          balance={loading ? "Loading..." : data.length > 0 ? <><Counter end={totalPending} duration={0.8} /> Ar.</> : "No pending payment added."}
          balanceColor="text-orange-500 hover:text-orange-600"
          subtitle={subtitle}
          subtitleSize="text-sm"
        >
          {!loading && data.length > 0 && (
            <button className="flex items-center gap-1 rounded bg-green-500 text-white hover:bg-green-600 px-2 py-1 text-sm">
              <FaPlus /> Add new caisse
            </button>
          )}
        </Balance>

       <Caisse caisses={dataCaisse} />
       
        <div className="pt-2">
          <Transactions Columns={Columns} data={loading ? [] : data} loading={loading} />
        </div>
      </div>
    </>
  );
}
