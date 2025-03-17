import Dexie from "dexie";

export const db = new Dexie("offlineDB");

db.version(1).stores({
  requests: "++id, url, method, data",
  cache: "url, data"
});
