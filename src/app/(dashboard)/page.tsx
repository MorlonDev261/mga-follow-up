import HomePage from "@components/Welcome/HomePage";
import Dashboard from "@components/Welcome/Dashboard";
import type { Session } from "next-auth";
import { auth } from "@/lib/auth";

interface WelcomePageProps {
  session: Session | null;
}

export default function WelcomePage({ session }: WelcomePageProps) {
  if (session?.user) {
    return <Dashboard />;
  } else {
    return <HomePage />;
  }
}

export async function getServerSideProps() {
  const session = await auth();
  return {
    props: {
      session,
    },
  };
}
