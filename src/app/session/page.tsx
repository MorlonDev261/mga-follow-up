import { auth } from "@/lib/auth.config";

export default async function SessionPage() {
  const session = await auth(); // Récupérer la session

  return (
    <main className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Session Info</h1>
      {session ? (
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
          {JSON.stringify(session, null, 2)}
        </pre>
      ) : (
        <p className="text-red-500">No active session</p>
      )}
    </main>
  );
}
