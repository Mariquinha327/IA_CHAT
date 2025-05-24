import { db } from "@/lib/firebase";

export async function GET(req) {
  const chatsSnapshot = await db.collection("chats").orderBy("createdAt", "desc").get();
  const chats = chatsSnapshot.docs.map(doc => doc.data());
  return Response.json({ chats });
}