import Dexie, { Table } from 'dexie';

export interface ChatMessage {
  id?: number;
  user: string;
  bot: string;
  createdAt: Date;
}

class ChatDB extends Dexie {
  messages!: Table<ChatMessage, number>;

  constructor() {
    super('chatDatabase');
    this.version(1).stores({
      messages: '++id, createdAt',
    });
  }
}

export const chatDB = new ChatDB();
