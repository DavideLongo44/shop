import { createServer } from "node:http";

const port = Number(process.env.PORT || 4000);
const products = [
  { id: "coffee", name: "Caffè", category: "Alimentari", price: 6.9, unit: "250 g", emoji: "☕" },
  { id: "pasta", name: "Pasta", category: "Alimentari", price: 1.49, unit: "500 g", emoji: "🍝" },
  { id: "milk", name: "Latte", category: "Alimentari", price: 1.29, unit: "1 l", emoji: "🥛" },
  { id: "soap", name: "Sapone", category: "Casa", price: 2.99, unit: "1 pz", emoji: "🧼" },
  { id: "headphones", name: "Cuffie", category: "Elettronica", price: 29.9, unit: "1 pz", emoji: "🎧" },
  { id: "notebook", name: "Notebook", category: "Cartoleria", price: 3.5, unit: "1 pz", emoji: "📓" },
  { id: "bread", name: "Pane", category: "Alimentari", price: 2.2, unit: "1 pz", emoji: "🍞" },
  { id: "apples", name: "Mele", category: "Alimentari", price: 2.79, unit: "1 kg", emoji: "🍎" },
  { id: "shampoo", name: "Shampoo", category: "Casa", price: 4.49, unit: "250 ml", emoji: "🧴" },
  { id: "tshirt", name: "Maglietta", category: "Abbigliamento", price: 12.9, unit: "1 pz", emoji: "👕" }
];

const send = (res, status, body) => {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": process.env.FRONTEND_ORIGIN || "*",
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "content-type"
  });
  res.end(JSON.stringify(body));
};

const readBody = (req) => new Promise((resolve, reject) => {
  let data = "";
  req.on("data", chunk => { data += chunk; if (data.length > 1_000_000) reject(new Error("Payload too large")); });
  req.on("end", () => resolve(data ? JSON.parse(data) : {}));
  req.on("error", reject);
});

const server = createServer(async (req, res) => {
  if (req.method === "OPTIONS") return send(res, 204, {});
  if (req.method === "GET" && req.url === "/api/health") return send(res, 200, { status: "ok" });
  if (req.method === "GET" && req.url === "/api/products") return send(res, 200, { products });

  if (req.method === "POST" && req.url === "/api/cart/quote") {
    try {
      const { items = [] } = await readBody(req);
      const normalized = items
        .map(({ productId, quantity }) => ({ product: products.find(p => p.id === productId), quantity: Number(quantity) }))
        .filter(({ product, quantity }) => product && Number.isInteger(quantity) && quantity > 0)
        .map(({ product, quantity }) => ({ product, quantity, subtotal: Number((product.price * quantity).toFixed(2)) }));
      const total = Number(normalized.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2));
      return send(res, 200, { items: normalized, total });
    } catch {
      return send(res, 400, { error: "Invalid cart payload" });
    }
  }

  return send(res, 404, { error: "Not found" });
});

server.listen(port, () => console.log(`Shop API listening on http://localhost:${port}`));

