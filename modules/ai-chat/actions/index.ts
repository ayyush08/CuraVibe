"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/modules/auth/actions";

type ChatMessageInput = {
  role: "user" | "model";
  content: string;
  type?: "chat" | "code_review" | "suggestion" | "error_fix" | "optimization";
};

type ChatHistoryItem = {
  id: string;
  role: "user" | "model";
  content: string;
  createdAt: Date;
  type?: ChatMessageInput["type"] | null;
};


export async function autosaveChatMessages(
  messages: ChatMessageInput[],
  playgroundId: string
) {
    console.log("Auto Save called");
    
  const user = await currentUser();
  if (!user?.id) return;
  if (!messages.length) return;

  await db.chatMessage.createMany({
    data: messages.map((msg) => ({
      userId: user.id!,
      role: msg.role,
      content: msg.content,
      type: msg.type,
      playgroundId: playgroundId,
    })),
  });
}



export async function getChatHistory(
  limit = 50,
  playgroundId: string
): Promise<ChatHistoryItem[]> {
  const user = await currentUser();
  if (!user?.id) return [];

  const records = await db.chatMessage.findMany({
    where: { userId: user.id ,playgroundId: playgroundId},
    orderBy: { createdAt: "asc" },
    take: limit,
  });

  return records.map((record) => ({
    id: record.id,
    role: record.role as "user" | "model",
    content: record.content,
    createdAt: record.createdAt,
    type: (record as { type?: ChatMessageInput["type"] | null }).type ?? null
  }));
}
