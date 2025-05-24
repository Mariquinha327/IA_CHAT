import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

export async function responderIA(pergunta) {
  try {
    const response = await cohere.generate({
      model: "command",
      prompt: pergunta,
      maxTokens: 100,
      temperature: 0.9,
    });

    return response.generations[0].text.trim();
  } catch (error) {
    console.error("Erro ao gerar resposta com IA:", error);
    return "Desculpe, não consegui gerar uma resposta no momento.";
  }
}