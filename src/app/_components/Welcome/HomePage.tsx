"use client";

import Image from 'next/image';
// import Company from "@components/Company/list";
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/register');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-8 px-4">
      {/* Header */}
      <header className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-green-600">
          Bienvenue dans <span className="text-orange-600">MGA Follow UP</span>
        </h1>
        <p className="mt-4 text-xl text-gray-700 max-w-3xl mx-auto">
          Une solution complète et performante pour la gestion de votre entreprise. Suivi des stocks, des clients,
          des débits et crédits, tout est réuni en un seul endroit pour améliorer votre efficacité.
        </p>
      </header>

      {/* Section: Image de présentation */}
      <section className="flex justify-center gap-8 mb-16">
        <div className="w-1/2">
          <Image
            src="/logo/screenshot-1.png" // Remplacer par ton image
            alt="Gestion des stocks"
            width={600}
            height={350}
            className="rounded-xl shadow-lg object-cover"
          />
        </div>
        <div className="w-1/2">
          <Image
            src="/logo/screenshot-2.png" // Remplacer par ton image
            alt="Gestion des clients"
            width={600}
            height={350}
            className="rounded-xl shadow-lg object-cover"
          />
        </div>
      </section>

      {/* Section: Entreprises inscrites */}
      
      
      {/* Section: Fonctionnalités */}
      <section className="text-center mb-16">
        <h2 className="text-3xl font-semibold text-green-600">Les Fonctionnalités Clés</h2>
        <p className="mt-4 text-lg text-gray-600">
          MGA Follow UP vous aide à gérer tous les aspects critiques de votre entreprise avec simplicité et efficacité.
        </p>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          <div className="bg-green-600 text-white p-8 rounded-xl shadow-md">
            <h3 className="text-2xl font-bold mb-4">Gestion des Stocks</h3>
            <p>Suivez vos stocks en temps réel, gérez les entrées et sorties pour une gestion optimale des ressources.</p>
          </div>
          <div className="bg-orange-600 text-white p-8 rounded-xl shadow-md">
            <h3 className="text-2xl font-bold mb-4">Gestion des Clients</h3>
            <p>Centralisez toutes les informations clients, améliorez vos relations et optimisez la fidélité.</p>
          </div>
          <div className="bg-green-600 text-white p-8 rounded-xl shadow-md">
            <h3 className="text-2xl font-bold mb-4">Débits et Crédits</h3>
            <p>Suivez les transactions financières, gérez les débits et crédits de manière claire et transparente.</p>
          </div>
          <div className="bg-orange-600 text-white p-8 rounded-xl shadow-md">
            <h3 className="text-2xl font-bold mb-4">Rapports et Analyses</h3>
            <p>Accédez à des rapports détaillés pour une vision claire de la performance de votre entreprise.</p>
          </div>
          <div className="bg-green-600 text-white p-8 rounded-xl shadow-md">
            <h3 className="text-2xl font-bold mb-4">Sécurisé et Fiable</h3>
            <p>Vos données sont protégées par des normes de sécurité élevées, garantissant la confidentialité et l&apos;intégrité.</p>
          </div>
          <div className="bg-orange-600 text-white p-8 rounded-xl shadow-md">
            <h3 className="text-2xl font-bold mb-4">Interface Intuitive</h3>
            <p>Une interface utilisateur conviviale et facile à utiliser pour toute l&apos;équipe, peu importe leur niveau technique.</p>
          </div>
        </div>
      </section>

      {/* Section: Call to Action */}
      <section className="text-center">
        <p className="text-xl text-gray-700 mb-6">
          Prêt à transformer la gestion de votre entreprise avec MGA Follow UP ? Rejoignez-nous dès aujourd&apos;hui !
        </p>
        <button
          onClick={handleGetStarted}
          className="px-8 py-4 text-white bg-green-600 hover:bg-green-700 rounded-xl shadow-lg text-lg font-semibold transition duration-300"
        >
          Get Started
        </button>
      </section>

      {/* Footer */}
      <footer className="text-center mt-16 text-gray-600">
        <p>&copy; 2025 MGA Follow UP. Tous droits réservés.</p>
        <p className="mt-2">
          <a href="/privacy" className="text-green-600 hover:text-green-800">Politique de confidentialité</a> |{' '}
          <a href="/terms" className="text-green-600 hover:text-green-800">Conditions d&apos;utilisation</a>
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
