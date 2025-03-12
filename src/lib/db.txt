import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { Chat, Message } from "./utils";

export interface User {
  id: string;
  name: string;
  avatar?: string; // URL de l'image de profil
  isOnline?: boolean; // Statut en ligne
}

interface Data {
  users: User[];
  chats: Chat[];
  messages: Message[];
}

// Fichier JSON où seront stockées les données
const file = "db.json";
const adapter = new JSONFile<Data>(file);
const db = new Low<Data>(adapter, { users: [], chats: [], messages: [] });

export default db;
