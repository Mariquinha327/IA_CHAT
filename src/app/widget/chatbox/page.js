
"use client";

import { useState } from "react";

export default function Chatbox({ searchParams }) {
  const clientId = searchParams.client || "default";

  const [messages, setMessages] = useState([
    { autor: "ia", conteudo: "Olá! Como posso ajudar você?" },
  ]);
  const [input, setInput] = useState("");

  // ✅ Função que envia mensagem e chama a API real
  const enviarMensagem = async () => {
    if (!input.trim()) return;

    const novaMensagem = { autor: "utilizador", conteudo: input };
    setMessages((prev) => [...prev, novaMensagem]);
    setInput("");

    try {
      const res = await fetch("/api/v0/chat/prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cliente_id: clientId,
          sessao_id: "sessao_001",
          mensagem: input,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { autor: "ia", conteudo: data.resposta || "Não entendi sua pergunta." },
      ]);
    } catch (err) {
      console.error("Erro ao comunicar com a IA:", err);
      setMessages((prev) => [
        ...prev,
        { autor: "ia", conteudo: "Erro ao obter resposta da IA." },
      ]);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h3>Chat IA - Cliente: {clientId}</h3>

      <div
        style={{
          border: "1px solid #ccc",
          height: "300px",
          overflowY: "auto",
          padding: 10,
          marginBottom: 10,
          background: "#f9f9f9",
          borderRadius: "8px",
        }}
      >
        {messages.map((msg, i) => (
          <p key={i} style={{ color: msg.autor === "ia" ? "blue" : "black" }}>
            <b>{msg.autor}:</b> {msg.conteudo}
          </p>
        ))}
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Digite sua mensagem"
        style={{ width: "80%", padding: "8px" }}
      />
      <button onClick={enviarMensagem} style={{ padding: "8px 12px" }}>
        Enviar
      </button>
    </div>
  );
}