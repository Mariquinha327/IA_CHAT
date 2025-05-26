export async function GET(request) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split("/");
  const clientId = pathParts[pathParts.length - 1].replace(".js", ""); 

  const script = `
    (function () {
      const iframe = document.createElement("iframe");
      iframe.src = "http://localhost:3000/widget/chatbox?client=${clientId}";
      iframe.style.position = "fixed";
      iframe.style.bottom = "20px";
      iframe.style.right = "20px";
      iframe.style.width = "350px";
      iframe.style.height = "500px";
      iframe.style.border = "none";
      iframe.style.zIndex = "9999";
      iframe.style.borderRadius = "12px";
      iframe.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
      document.body.appendChild(iframe);
    })();
  `;

  return new Response(script, {
    headers: {
      "Content-Type": "application/javascript",
    },
  });
}