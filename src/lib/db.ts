import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

export interface User {
  id: string;
  name: string;
  avatar?: string; // URL de l'image de profil
  isOnline?: boolean; // Statut en ligne
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTimestamp: number;
  unread: number;
}

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
  senderId: string;
  chatId: string;
  read: boolean;
  avatar: string;
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
