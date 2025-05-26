"use client";

import { useState } from "react";

export default function Chatbox({ searchParams }) {
  const clientId = searchParams?.client || "default";

  const [messages, setMessages] = useState([
    { autor: "ia", conteudo: "Olá! Como posso ajudar você?" },
  ]);
  const [input, setInput] = useState("");

  const enviarMensagem = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { autor: "utilizador", conteudo: input }]);
    const texto = input;
    setInput("");

    try {
      const response = await fetch("/api/v0/chat/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente_id: clientId,
          mensagem: texto,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro na resposta da API");
      }

      const data = await response.json();

      const respostaIA = data.mensagens.find(
        (m) => m.autor === "ia"
      )?.conteudo;

      if (respostaIA) {
        setMessages((prev) => [...prev, { autor: "ia", conteudo: respostaIA }]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { autor: "ia", conteudo: "Erro ao obter resposta da IA." },
      ]);
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h3>Chat IA - Cliente: {clientId}</h3>
      <div
        style={{
          border: "1px solid #ccc",
          height: 300,
          overflowY: "auto",
          padding: 10,
          marginBottom: 10,
          background: "#f9f9f9",
          borderRadius: 8,
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
        style={{ width: "80%", padding: 8 }}
      />
      <button onClick={enviarMensagem} style={{ padding: "8px 12px" }}>
        Enviar
      </button>
    </div>
  );
}