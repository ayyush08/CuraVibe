"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/modules/auth/actions";

type ChatMessageInput = {
  role: "user" | "model";
  content: string;
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
      playgroundId: playgroundId,
    })),
  });
}



export async function getChatHistory(limit = 50,playgroundId: string) {
  const user = await currentUser();
  if (!user?.id) return [];

  return db.chatMessage.findMany({
    where: { userId: user.id ,playgroundId: playgroundId},
    orderBy: { createdAt: "asc" },
    take: limit,
  });
}
