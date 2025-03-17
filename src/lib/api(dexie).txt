import axios from "axios";
import { db } from "./db";

// Fonction pour gérer les requêtes API avec IndexedDB
export const apiRequest = async (
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  data?: any
) => {
  if (navigator.onLine) {
    try {
      const response = await axios({ method, url, data });

      if (method === "GET") {
        await db.cache.put({ url, data: response.data });
      } else if (method === "DELETE") {
        await db.cache.delete(url);
      }

      return response;
    } catch (error) {
      console.error("Erreur de requête API :", error);
      throw error;
    }
  } else {
    console.warn("Mode hors ligne : stockage de la requête");

    if (method === "GET") {
      const cachedData = await db.cache.get(url);
      if (cachedData) {
        return { data: cachedData.data };
      } else {
        throw new Error("Données non disponibles en mode hors ligne");
      }
    } else {
      await db.requests.add({ url, method, data });
      return { data: { message: "Requête stockée et sera synchronisée en ligne." } };
    }
  }
};
