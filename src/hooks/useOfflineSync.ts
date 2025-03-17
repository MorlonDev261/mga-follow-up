import { useEffect } from "react";
import axios from "axios";
import { db } from "@/lib/db";
import { useToast } from "@/components/ui/use-toast";

export function useOfflineSync() {
  const { toast } = useToast();

  useEffect(() => {
    const syncRequests = async () => {
      const requests = await db.requests.toArray();
      if (requests.length === 0) return;

      let successCount = 0;
      let failCount = 0;

      for (const req of requests) {
        try {
          await axios({
            method: req.method,
            url: req.url,
            data: req.data,
          });

          await db.requests.delete(req.id!);

          if (req.method === "DELETE") {
            await db.cache.delete(req.url);
          }

          successCount++;
        } catch (error) {
          console.error("Échec de la synchronisation", error);
          failCount++;
        }
      }

      if (successCount > 0) {
        toast({
          title: "Synchronisation réussie",
          description: `${successCount} requête(s) envoyée(s) au serveur`,
        });
      }

      if (failCount > 0) {
        toast({
          variant: "destructive",
          title: "Échec de la synchronisation",
          description: `${failCount} requête(s) n'ont pas pu être envoyées`,
        });
      }
    };

    if (navigator.onLine) {
      syncRequests();
    }

    window.addEventListener("online", syncRequests);
    return () => {
      window.removeEventListener("online", syncRequests);
    };
  }, [toast]);
}
