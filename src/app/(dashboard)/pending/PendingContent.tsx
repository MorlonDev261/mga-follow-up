// app/(dashboard)/pending/PendingContent.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa";
import { FiClock } from 'react-icons/fi';
import { MoreHorizontal } from "lucide-react";
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

type dataType = Payment & { Qte?: number; sum?: number };

export default function PendingContent() {
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

  // Calcul du total des paiements en attente et du nombre de clients
  const totalPending = data.reduce((acc, item) => acc + (item.sum || item.price), 0);
  const numberOfCustomers = new Set(data.map(item => item.customer)).size;

  // Ajustement du sous-titre en fonction du filtre
  const subtitle = show
    ? `Pending payment from ${!data[0]?.customer.startsWith("Mr.") ? "Mr. " : ""}${data[0]?.customer.split(" ")[0]}.`
    : `${numberOfCustomers} customers have pending payments. Pending payment from Mr. Kiady.`;

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
    <main className={cn(data.length <= 0 && "bg-[#111]")}>
      <div className="px-2 bg-[#111]">
        <Balance 
          title={<><FiClock /> Pending Payement</>} 
          balance={data.length > 0 ? <><Counter end={totalPending} duration={0.8} /> Ar.</> : "No pending payement added."}
          balanceColor="text-yellow-500 hover:text-yellow-600"
          subtitle={subtitle}
          subtitleSize="text-sm"
        >
          {data.length > 0 &&
            <button className="flex items-center gap-1 rounded bg-yellow-500 hover:bg-yellow-600 px-2 py-1 text-sm text-white">
              <FaPlus /> New unpaid purchase
            </button>
          }
        </Balance>
      </div>
      {data.length > 0 ?
        <div className="pt-2 bg-[#111]">
          <Pending Columns={Columns} data={data} loading={loading} />
        </div>
        :
        <div className="w-full h-[65vh] flex items-center justify-center bg-[#111]">
          <div className="-mt-5 flex items-center justify-center flex-col ">
            <p>There is nothing to see. Please record a first sale that has not been paid yet.</p>
            <button className="px-4 mt-2 flex items-center gap-2 py-2 bg-yellow-500 hover:bg-yellow-600"><FaPlus /> Add First Pending Payement</button>
          </div>
        </div>
      }
    </main>
  );
}
