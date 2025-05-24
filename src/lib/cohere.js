import axios from 'axios';

const COHERE_API_KEY = process.env.COHERE_API_KEY;

export async function responderIA(mensagem) {
  const response = await axios.post(
    'https://api.cohere.ai/v1/generate',
    {
      model: "command",
      prompt: mensagem,
      max_tokens: 300,
      temperature: 0.7
    },
    {
      headers: {
        Authorization: `Bearer ${COHERE_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data.generations[0].text.trim();
}