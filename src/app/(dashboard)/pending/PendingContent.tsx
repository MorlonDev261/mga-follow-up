"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa";
import { FiClock } from "react-icons/fi";
import { MoreHorizontal } from "lucide-react";
import moment from "moment";
import Pending from "@components/Table/Pending";
import Counter from "@components/Counter";
import Balance from "@components/Balance";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Row, ColumnDef } from "@tanstack/react-table";
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
  customer: string;
  designation: string;
  price: number;
};

type DataType = Payment & { Qte?: number; sum?: number };

export default function PendingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const show = searchParams.get("show");

  const [rawData, setRawData] = React.useState<Payment[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Récupération des données depuis l'API
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

  // Fonction pour regrouper les données par customer
  const groupByCustomer = (data: Payment[]): DataType[] => {
    const grouped: Record<string, DataType> = {};

    data.forEach((item) => {
      const key = item.customer;

      if (!grouped[key]) {
        grouped[key] = { ...item, Qte: 1, sum: item.price };
      } else {
        grouped[key].Qte! += 1;
        grouped[key].sum! += item.price;
        grouped[key].designation += `, ${item.designation}`;
      }
    });

    return Object.values(grouped);
  };

  // Application du filtrage ou du regroupement
  const data = React.useMemo(() => {
    if (!show) return groupByCustomer(rawData);
    return rawData.filter((item) => item.customer === show);
  }, [rawData, show]);

  // Calcul du total des paiements et du nombre de clients
  const totalPending = React.useMemo(
    () => data.reduce((acc, item) => acc + (item.sum || item.price), 0),
    [data]
  );
  const numberOfCustomers = React.useMemo(
    () => new Set(data.map((item) => item.customer)).size,
    [data]
  );

  // Définition du sous-titre
  const subtitle = React.useMemo(() => {
    if (show) return `Pending payment from ${data[0]?.customer || "unknown customer"}.`;
    return `${numberOfCustomers} customers have pending payments.`;
  }, [show, data]);

  // Définition des colonnes du tableau
  const baseColumns: ColumnDef<DataType>[] = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => <div>{moment(row.getValue("date"), "DD-MM-YY").format("DD/MM/YYYY")}</div>,
    },
    {
      accessorKey: "customer",
      header: "Customer",
    },
    {
      accessorKey: "designation",
      header: "Designation",
    },
  ];

  const additionalColumns = show
    ? [
        {
          accessorKey: "price",
          header: "Price",
          cell: ({ row }) => <div className="text-center">{row.getValue("price")}</div>,
        },
      ]
    : [
        {
          accessorKey: "Qte",
          header: "Qte",
          cell: ({ row }) => <div className="text-center">{row.getValue("Qte")}</div>,
        },
        {
          accessorKey: "sum",
          header: "Total",
          cell: ({ row }) => <div className="text-center">{row.getValue("sum")}</div>,
        },
      ];

  const Columns = [...baseColumns, ...additionalColumns, {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
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
            {show ? (
              <DropdownMenuItem onClick={() => router.push(`/view/pending?id=${payment.id}`)}>
                Show details
              </DropdownMenuItem>
            ) : (
              <>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id)}>
                  Copy payment ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View customer</DropdownMenuItem>
                <DropdownMenuItem>View payment details</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push(`?show=${encodeURIComponent(payment.customer)}`)}>
                  Show list pending payment
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }];

  return (
    <main className={cn(data.length <= 0 && "bg-[#111]")}>
      <div className="px-2 bg-[#111]">
        <Balance 
          title={<><FiClock /> Pending Payment</>} 
          balance={loading ? "Loading..." : data.length > 0 ? <><Counter end={totalPending} duration={0.8} /> Ar.</> : "No pending payment added."}
          balanceColor="text-yellow-500 hover:text-yellow-600"
          subtitle={subtitle}
          subtitleSize="text-sm"
        >
          {!loading && data.length > 0 && (
            <button className="flex items-center gap-1 rounded bg-yellow-500 hover:bg-yellow-600 px-2 py-1 text-sm text-white">
              <FaPlus /> New unpaid purchase
            </button>
          )}
        </Balance>
      </div>

      <div className="pt-2 bg-[#111]">
        {loading ? (
          <Pending Columns={Columns} data={[]} loading={true} />
        ) : data.length > 0 ? (
          <Pending Columns={Columns} data={data} loading={false} />
        ) : (
          <div className="w-full h-[65vh] flex items-center justify-center">
            <div className="-mt-5 flex items-center justify-center flex-col">
              <p>No pending payments. Please add one.</p>
              <button className="px-4 mt-2 flex items-center gap-2 py-2 bg-yellow-500 hover:bg-yellow-600">
                <FaPlus /> Add First Pending Payment
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
