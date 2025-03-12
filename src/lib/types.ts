export interface User {
  id: string;
  name: string;
  avatar?: string; // URL de l'image de profil
  isOnline?: boolean; // Statut en ligne
}

export interface Message {
  id: string;
  text: string;
  timestamp: string | number; // Date et heure du message
  isOwn: boolean; // Si le message est envoyé par l'utilisateur actuel
  senderId: string; // ID de l'expéditeur
  chatId: string; // ID du chat associé
  read?: boolean; // Si le message a été lu
  avatar?: string; // Avatar de l'expéditeur (optionnel)
}

export interface Chat {
  id: string;
  name: string; // Nom du chat ou de l'utilisateur
  avatar?: string; // URL de l'image de profil
  lastMessage: string; // Dernier message envoyé
  lastMessageTimestamp: string; // Date du dernier message
  unread: number; // Nombre de messages non lus
  participants?: string[]; // Liste des ID des participants
  isGroup?: boolean; // Si c'est un groupe ou une conversation privée
}

export interface ChatWithMessages extends Chat {
  messages: Message[]; // Liste des messages du chat
}

export interface ChatListProps {
  chats: Chat[];
  selectedChat: string | null;
  onSelectChat: (chatId: string) => void;
}

export interface MessageListProps {
  messages: Message[];
}

export interface MessageInputProps {
  onSend: (message: string) => void;
}

export interface ChatHeaderProps {
  chat?: Chat;
}

// Types pour les événements de messagerie
export type MessageEvent = {
  type: "new_message" | "message_read" | "user_typing";
  payload: Message | { chatId: string; userId: string };
};

// Types pour les réponses de l'API
export interface ApiResponse<T> {
  data: T;
  error?: string;
  status: "success" | "error";
}
