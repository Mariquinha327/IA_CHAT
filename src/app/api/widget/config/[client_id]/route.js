export async function GET(req, { params }) {
  const clientId = params.client_id;

  // Dados de exemplo, você pode buscar no banco de dados conforme clientId
  const config = {
    cliente_id: clientId,
    cor_principal: "#0070f3",
    logo_url: "https://example.com/logo.png",
    posicao_btn: "bottom-right",
    mostrar_nome_atendente: true,
    icone_btn: "chat",
    custom_css: "", // opcional
  };

  return new Response(JSON.stringify(config), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}