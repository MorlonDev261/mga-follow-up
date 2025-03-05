// Pas de "use client" ici, car generateMetadata est côté serveur

import { Metadata } from "next";
import PendingDetailsPage from "./PendingDetailsPage"; // Importez le composant côté client

type Payment = {
  id: string;
  date: string;
  customer: string;
  designation: string;
  price: number;
};

// Fonction pour générer les métadonnées dynamiques
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  // Récupérer les détails du paiement depuis l'API
  const response = await fetch(`http://localhost:3000/api/pending/${params.id}`); // Remplacez par l'URL de votre API
  const payment: Payment = await response.json();

  return {
    title: `Pending Payment - ${payment.customer}`,
    description: `Details of the pending payment for ${payment.customer}. Amount: ${payment.price} Ar.`,
    openGraph: {
      title: `Pending Payment - ${payment.customer}`,
      description: `Details of the pending payment for ${payment.customer}. Amount: ${payment.price} Ar.`,
      type: "website",
      url: `http://localhost:3000/view/pending/${params.id}`, // Remplacez par l'URL de votre page
      images: [
        {
          url: "https://yourwebsite.com/og-image.png", // Remplacez par l'URL de votre image OpenGraph
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
      images: ["https://yourwebsite.com/og-image.png"], // Remplacez par l'URL de votre image Twitter
    },
  };
}

// Exportez le composant de page par défaut
export default function Page({ params }: { params: { id: string } }) {
  return <PendingDetailsPage params={params} />;
}
