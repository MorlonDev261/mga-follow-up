import HomePage from "@components/Welcome/HomePage";
import Dashboard from "@components/Welcome/Dashboard";
import { auth } from "@/lib/auth";

export default async function WelcomePage() {
  const session = await auth();

  if (session.user) {
    return <Dashboard />;
  } else {
    return <HomePage />;
  }
}
