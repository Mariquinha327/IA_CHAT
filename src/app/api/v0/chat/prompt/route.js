import { pool } from "@/lib/mysql"; 
import { responderIA } from "@/lib/cohere"; 
import { db } from "@/lib/firebase";

export async function POST(req) {
  try {
    const body = await req.json();
    const { cliente_id, sessao_id, mensagem } = body;

    if (!cliente_id || !mensagem) {
      return Response.json(
        { error: "cliente_id e mensagem são obrigatórios." },
        { status: 400 }
      );
    }

   

    // 🔍 Buscar em perguntas conhecidas no MySQL (busca case-insensitive e collation para ignorar acentos)
    const [rows] = await pool.execute(
      "SELECT resposta FROM faq WHERE LOWER(pergunta) LIKE LOWER(?) COLLATE utf8mb4_general_ci LIMIT 1",
      [`%${mensagem}%`]
    );

    

    let respostaIA = rows.length > 0
      ? rows[0].resposta
      : await responderIA(mensagem);

    // 💬 Salvar no Firebase
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

    return Response.json({ resposta: respostaIA });
  } catch (error) {
    console.error("Erro ao processar:", error);
    return Response.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
