import { Metadata } from "next";
import PendingDetailsPage from "./PendingDetailsPage";

type Payment = {
  id: string;
  date: string;
  customer: string;
  designation: string;
  price: number;
};

// Fonction pour générer les métadonnées dynamiques
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params; // Attendre la résolution de params

  // Récupérer les détails du paiement depuis l'API
  const response = await fetch(`https://mga-follow-up.vercel.app/api/pending/${id}`);
  if (!response.ok) throw new Error("Failed to fetch payment data");

  const payment: Payment = await response.json();

  return {
    title: `Pending Payment - ${payment.customer}`,
    description: `Details of the pending payment for ${payment.customer}. Amount: ${payment.price} Ar.`,
    openGraph: {
      title: `Pending Payment - ${payment.customer}`,
      description: `Details of the pending payment for ${payment.customer}. Amount: ${payment.price} Ar.`,
      type: "website",
      url: `https://mga-follow-up.vercel.app/view/pending/${id}`,
      images: [
        {
          url: "https://mga-follow-up.vercel.app/og-image.png",
          width: 1200,
          height: 630,
          alt: "Pending Payment",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Pending Payment - ${payment.customer}`,
      description: `Details of the pending payment for ${payment.customer}. Amount: ${payment.price} Ar.`,
      images: ["https://mga-follow-up.vercel.app/og-image.png"],
    },
  };
}

// Composant principal de la page
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Attendre la résolution de params
  return <PendingDetailsPage params={{ id }} />;
}
