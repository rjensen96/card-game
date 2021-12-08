export interface ChatMessage {
  message: string;
  key: number;
  sender: string;
  room: string;
}

export function getEmptyChatMessageArray(): ChatMessage[] {
  const chats: ChatMessage[] = [];
  return chats;
}
