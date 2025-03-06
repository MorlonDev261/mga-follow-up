"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa";
import { FiClock } from 'react-icons/fi';
import { MoreHorizontal } from "lucide-react";
import { format } from 'date-fns';
import Pending from "@components/Table/Pending";
import Counter from "@components/Counter";
import Balance from "@components/Balance";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
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
  designation: string | string[];
  price: number;
};

type dataType = Payment & { 
  Qte?: number; 
  sum?: number;
};

export default function PendingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const show = searchParams.get("show");

  const [data, setData] = React.useState<dataType[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Memoized calculations
  const { totalPending, numberOfCustomers } = React.useMemo(() => ({
    totalPending: data.reduce((acc, item) => acc + (item.sum || item.price), 0),
    numberOfCustomers: new Set(data.map(item => item.customer)).size
  }), [data]);

  // Optimized grouping function with useCallback
  const groupByCustomer = React.useCallback((data: Payment[]): dataType[] => {
  const grouped = data.reduce((acc: Record<string, dataType>, item) => {
    const key = item.customer;
    const currentDesignation = Array.isArray(item.designation) 
      ? item.designation 
      : [item.designation]; // S'assurer que c'est un tableau

    if (!acc[key]) {
      acc[key] = { 
        ...item, 
        Qte: 1, 
        sum: item.price, 
        designation: currentDesignation // Déjà un tableau
      };
    } else {
      acc[key].Qte! += 1;
      acc[key].sum! += item.price;

      // S'assurer que acc[key].designation est un tableau avant d'utiliser push
      if (!Array.isArray(acc[key].designation)) {
        acc[key].designation = [acc[key].designation as string]; // Convertir en tableau si nécessaire
      }
      acc[key].designation.push(...currentDesignation); // Ajouter les éléments
    }
    
    return acc;
  }, {});

  return Object.values(grouped);
}, []);
  
  // Data fetching with abort controller
  React.useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/pending", { 
          signal: abortController.signal 
        });
        
        if (!response.ok) throw new Error('Failed to fetch');
        
        const result: Payment[] = await response.json();
        const processedData = show 
          ? result.filter(item => item.customer === show).map(item => ({
            ...item, 
            designation: Array.isArray(item.designation) 
              ? item.designation 
              : [item.designation] // Ensure it's a flat array
          }))
          : groupByCustomer(result);

        setData(processedData);
      } catch (error) {
        if (!abortController.signal.aborted) {
          setError("Failed to load pending payments");
          console.error("Fetch error:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => abortController.abort();
  }, [show, groupByCustomer]); // Add groupByCustomer to dependencies

  // Memoized columns configuration
  
  ) => navigator.clipboard.writeText(payment.id)}
  const Columns = React.useMemo<ColumnDef<dataType>[]>(() => [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }: { row: { getValue: (key: string) => any } }) => 
      format(new Date(row.getValue("date")), 'dd/MM/yyyy')
  },
  {
    accessorKey: "customer",
    header: "Customer"
  },
  {
    accessorKey: "designation",
    header: "Designation",
    cell: ({ row }: { row: { getValue: (key: string) => any } }) => (
      <div>{(row.getValue("designation") as string[]).join(', ')}</div>
    )
  },
  ...(show
    ? [{
        accessorKey: "price",
        header: "Price",
        cell: ({ row }: { row: { getValue: (key: string) => any } }) => (
          <div className="text-center">{row.getValue("price")}</div>
        )
      }]
    : [{
        accessorKey: "Qte",
        header: () => <div className="text-center">Qte</div>,
        cell: ({ row }: { row: { getValue: (key: string) => any } }) => (
          <div className="text-center">{row.getValue("Qte")}</div>
        )
      },
      {
        accessorKey: "sum",
        header: () => <div className="text-center">Total</div>,
        cell: ({ row }: { row: { getValue: (key: string) => any } }) => (
          <div className="text-center">{row.getValue("sum")}</div>
        )
      }]),
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }: { row: { original: dataType } }) => {
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
              <DropdownMenuItem
                onClick={() => router.push(`/view/pending/${payment.id}`)}
              >
                Show details
              </DropdownMenuItem>
            ) : (
              <>
                <DropdownMenuItem 
                  onClick={() => navigator.clipboard.writeText(payment.id)}
                >
                  Copy payment ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View customer</DropdownMenuItem>
                <DropdownMenuItem>View payment details</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push(`?show=${encodeURIComponent(payment.customer)}`)}
                >
                  Show pending payments
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
], [show, router]);

  // Subtitle calculation
  const subtitle = React.useMemo(() => 
    show
      ? `Pending payment from ${data[0]?.customer || "unknown customer"}.`
      : `${numberOfCustomers} customers have pending payments.`,
    [show, data, numberOfCustomers]
  );

  if (error) {
    return (
      <div className="w-full h-[65vh] flex items-center justify-center bg-[#111]">
        <div className="text-red-500 text-center">
          <p>Error: {error}</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className={cn(data.length <= 0 && "bg-[#111]")}>
      <div className="px-2 bg-[#111]">
        <Balance 
          title={<><FiClock /> Pending Payment</>} 
          balance={loading ? "Loading..." : data.length > 0 ? (
            <><Counter end={totalPending} duration={0.8} /> Ar.</>
          ) : "No pending payments found."}
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

      {loading ? (
        <PendingSkeleton />
      ) : data.length > 0 ? (
        <div className="pt-2 bg-[#111]">
          <Pending Columns={Columns} data={data} />
        </div>
      ) : (
        <EmptyState />
      )}
    </main>
  );
}

// Additional components
const PendingSkeleton = () => (
  <div className="pt-2 bg-[#111] animate-pulse">
    <div className="h-64 bg-gray-800 rounded-lg" />
  </div>
);

const EmptyState = () => (
  <div className="w-full h-[65vh] flex items-center justify-center bg-[#111]">
    <div className="-mt-5 text-center">
      <p className="mb-4">No pending payments found. Start by adding a new unpaid sale.</p>
      <Button className="bg-yellow-500 hover:bg-yellow-600">
        <FaPlus className="mr-2" /> Add First Pending Payment
      </Button>
    </div>
  </div>
);
