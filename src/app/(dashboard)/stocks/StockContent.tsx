"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa";
import { FiClock } from "react-icons/fi";
import { MoreHorizontal } from "lucide-react";
import moment from "moment";
import StockList from "./StockList";
import Statistique from "@components/Statistique";
import TableStock from "@components/Table/Stock";
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
  customer: string;
  designation: string;
  price: number;
};

type DataType = Payment & { Qte?: number; sum?: number };

export default function PendingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const show = searchParams.get("show");

  const stocks = [
    { id: 'hzhe58', name: '24-03-25', value: 457900, sales: 3636 },
    { id: 'jrfhz8', name: '01-02-25', value: 457900, sales: 846 },
    { id: 'hzshr8', name: '24-01-25', value: 457900, sales: 5353 },
    { id: 'ryhey6', name: '07-02-25', value: 7, sales: 35 },
    { id: 'hry488', name: '10-02-25', value: 53, sales: 386 },
    { id: 'hjfe58', name: '14-02-25', value: 7, sales: 5263 },
    { id: 'hzjrj8', name: '06-03-25', value: 568, sales: 56 },
    { id: 'hkrjra', name: '08-03-25', value: 567, sales: 56 },
  ];
  
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

  const data: DataType[] = React.useMemo(() => {
    if (!show) return groupByCustomer(rawData);
    return rawData.filter((item) => item.customer === show).map((item) => ({ ...item, Qte: 1, sum: item.price }));
  }, [rawData, show]);

  const totalPending = React.useMemo(
    () => data.reduce((acc, item) => acc + (item.sum || item.price), 0),
    [data]
  );
  const numberOfCustomers = React.useMemo(
    () => new Set(data.map((item) => item.customer)).size,
    [data]
  );

  const subtitle = React.useMemo(() => {
    if (show) return `Pending payment from ${data[0]?.customer || "unknown customer"}.`;
    return `${numberOfCustomers} customers have pending payments.`;
  }, [show, data, numberOfCustomers]);

  const baseColumns: ColumnDef<DataType>[] = [
    {
      accessorKey: "date",
      header: "Date",
      enableColumnFilter: true,
      filterFn: "includesString",
      cell: ({ row }) => <div>{moment(row.getValue("date"), "DD-MM-YY").format("DD/MM/YYYY")}</div>,
    },
    {
      accessorKey: "customer",
      header: "Customer",
      enableColumnFilter: true,
      filterFn: "includesString",
    },
    {
      accessorKey: "designation",
      header: "Designation",
      enableColumnFilter: true,
      filterFn: "includesString",
    },
  ];

  const additionalColumns = show
    ? [
        {
          accessorKey: "price",
          header: "Price",
          cell: ({ row }: { row: Row<DataType> }) => (<div className="text-center">{row.getValue("price")}</div>),
        },
      ]
    : [
        {
          accessorKey: "Qte",
          header: "Qte",
          cell: ({ row }: { row: Row<DataType> }) => <div className="text-center">{row.getValue("Qte")}</div>,
        },
        {
          accessorKey: "sum",
          header: "Total",
          cell: ({ row }: { row: Row<DataType> }) => <div className="text-center">{row.getValue("sum")}</div>,
        },
      ];

  const Columns = [...baseColumns, ...additionalColumns, {
    id: "actions",
    enableHiding: false,
    cell: ({ row }: { row: Row<DataType> }) => {
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
              <DropdownMenuItem onClick={() => router.push(`/view/pending/${payment.id}`)}>
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
    <>
      <div className={cn(
         "px-2 transition-opacity", 
         { "opacity-100": !loading && data.length > 0, "opacity-0": loading || data.length === 0 }
       )}>
        <Balance 
          title={<><FiClock /> Pending Payment</>} 
          balance={loading ? "Loading..." : data.length > 0 ? <><Counter end={totalPending} duration={0.8} /> Ar.</> : "No pending payment added."}
          balanceColor="text-blue-500 hover:text-blue-600"
          subtitle={subtitle}
          subtitleSize="text-sm"
        >
          {!loading && data.length > 0 && (
            <button className="flex items-center gap-1 rounded bg-blue-500 text-white hover:bg-blue-600 px-2 py-1 text-sm">
              <FaPlus /> New unpaid purchase
            </button>
          )}
        </Balance>

          
        {/* Statistique Component */}
        <div className="text-white p-2">
          <h3 className="mb-4">Statistique de vente:</h3>
          <div className="w-full">
            <Statistique type="bar" legende={false} />
          </div>
        </div>
    </div>
    
      <Suspense>
        <StockList stocks={stocks} />
      </Suspense>
      
      <div className="pt-2">
        {loading ? (
          <TableStock Columns={Columns} data={data} loading={false} />
        ) : data.length > 0 ? (
          <TableStock Columns={Columns} data={data} loading={false} />
        ) : (
          <div className="w-full h-[65vh] flex items-center justify-center">
            <div className="-mt-5 flex flex-col items-center">
              <p className="text-gray-900 dark:text-white">No pending payments. Please add one.</p>
              <button className="px-4 mt-2 flex items-center gap-2 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded">
                <FaPlus /> Add First Pending Payment
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
