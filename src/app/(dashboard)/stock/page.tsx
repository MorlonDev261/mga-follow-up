"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BsShopWindow } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import { MoreHorizontal } from "react-icons/fe";
import Balance from "@components/Balance";
import Counter from "@components/Counter";
import Statistique from "@components/Statistique";
import TableStock from "@components/DataTable/TableStock";
import { Row, ColumnDef } from "@tanstack/react-table";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
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

type dataType = Payment & { Qte?: number; sum?: number };

export default function Stock() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const show = searchParams.get("show");

  const [data, setData] = React.useState<dataType[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Récupération des données depuis l'API
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/pending");
        if (!response.ok) throw new Error("Failed to fetch data");

        let result: Payment[] = await response.json();

        if (!show) {
          result = groupByCustomer(result); // Regrouper uniquement si show est absent
        } else {
          result = result.filter((item) => item.customer === show); // Pas de regroupement
        }

        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [show]);

  // Fonction pour regrouper les données par customer
  const groupByCustomer = (data: Payment[]): dataType[] => {
    const grouped: Record<string, dataType> = {};

    data.forEach((item) => {
      const key = item.customer;

      if (!grouped[key]) {
        grouped[key] = { ...item, Qte: 1, sum: item.price, designation: item.designation };
      } else {
        grouped[key].Qte! += 1;
        grouped[key].sum! += item.price;
        grouped[key].designation += `, ${item.designation}`;
      }
    });

    return Object.values(grouped);
  };

  const Columns: ColumnDef<dataType>[] = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const date = row.getValue("date") as string;
        const [day, month, year] = date.split("-");
        return <div>{`${day}/${month}/20${year}`}</div>;
      },
    },
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => <div>{row.getValue("customer")}</div>,
    },
    {
      accessorKey: "designation",
      header: "Designation",
      cell: ({ row }) => <div>{row.getValue("designation")}</div>,
    },
    ...(show
      ? [
          {
            accessorKey: "price",
            header: "Price",
            cell: ({ row }: { row: Row<Payment> }) => (
              <div className="text-center">{row.getValue("price")}</div>
            ),
          },
        ]
      : [
          {
            accessorKey: "Qte",
            header: () => <div className="text-center">Qte</div>,
            cell: ({ row }: { row: Row<Payment> }) => (
              <div className="text-center">{row.getValue("Qte")}</div>
            ),
          },
          {
            accessorKey: "sum",
            header: () => <div className="text-center">Total</div>,
            cell: ({ row }: { row: Row<Payment> }) => (
              <div className="text-center">{row.getValue("sum")}</div>
            ),
          },
        ]),
    {
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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id)}>
                Copy payment ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View customer</DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push(`?show=${encodeURIComponent(payment.customer)}`)}
              >
                Show list pending payment
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <main className="p-2">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Balance Component */}
        <div className="bg-[#111] p-2">
          <Balance
            title={
              <>
                <BsShopWindow key="icon" /> Stock Available
              </>
            }
            subtitle={<>Distributed across 6 stocks</>}
            balance={
              <>
                <Counter
                  end={5220500}
                  duration={0.8}
                  sound="on"
                  src="/sounds/money-sound.mp3"
                />{" "}
                Pcs
              </>
            }
            balanceColor="text-blue-500"
          >
            <button
              type="button"
              className="flex items-center justify-center gap-1 rounded bg-blue-500 px-2 py-1 text-sm text-white"
            >
              <FaPlus /> New arrival
            </button>
          </Balance>

          {/* Statistique Component */}
          <div className="bg-[#111] text-white p-2">
            <h3 className="mb-4">Statistique de vente:</h3>
            <div className="mb-5 w-full">
              <Statistique type="bar" legende={false} />
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <Suspense fallback={<div>Loading...</div>}>
        <TableStock Columns={Columns} data={data} loading={loading} />
      </Suspense>
    </main>
  );
}
