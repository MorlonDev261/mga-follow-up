"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { FiClock, FiArrowLeft } from "react-icons/fi";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import * as React from "react";

type Payment = {
  id: string;
  date: string;
  customer: string;
  designation: string;
  price: number;
};

export default function PendingDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [payment, setPayment] = React.useState<Payment | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Récupérer les détails du paiement depuis l'API
  React.useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const response = await fetch(`/api/pending/${params.id}`);
        if (!response.ok) throw new Error("Failed to fetch payment details");

        const data: Payment = await response.json();
        setPayment(data);
      } catch (error) {
        console.error("Error fetching payment details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Skeleton className="h-10 w-48 mb-4" />
        <Skeleton className="h-6 w-64 mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-red-500">Payment not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.back()}
      >
        <FiArrowLeft className="mr-2" /> Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FiClock className="text-yellow-500" />
            Pending Payment Details
          </CardTitle>
          <CardDescription>
            Details of the pending payment for {payment.customer}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-medium">
              {format(new Date(payment.date), "dd/MM/yyyy")}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Customer</p>
            <p className="font-medium">{payment.customer}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Designation</p>
            <p className="font-medium">{payment.designation}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Amount</p>
            <p className="font-medium text-yellow-500">{payment.price} Ar</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Close
          </Button>
          <Button
            variant="default"
            onClick={() => alert("Mark as paid functionality here")}
          >
            Mark as Paid
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
