import { db } from "@/lib/firebase";
import { responderIA } from "@/lib/cohere"; // agora usando Cohere

export async function POST(req) {
  const body = await req.json();
  const { cliente_id, sessao_id, mensagem } = body;

  if (!cliente_id || !mensagem) {
    return Response.json({ error: "cliente_id e mensagem são obrigatórios." }, { status: 400 });
  }

  try {
    const respostaIA = await responderIA(mensagem);

    const mensagens = [
      { autor: "utilizador", conteudo: mensagem },
      { autor: "ia", conteudo: respostaIA },
    ];

    const doc = {
      cliente_id,
      sessao_id: sessao_id || null,
      mensagens,
      createdAt: new Date().toISOString(),
    };

    await db.collection("chats").add(doc);
    return Response.json({ mensagens });

  } catch (error) {
    return Response.json({ error: error.message || "Erro ao salvar conversa." }, { status: 500 });
  }
}