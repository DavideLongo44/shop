const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

export async function fetchProducts() {
  const response = await fetch(`${API_URL}/api/products`);
  if (!response.ok) throw new Error("Impossibile caricare i prodotti");
  const data = await response.json();
  return data.products;
}

export async function quoteCart(items) {
  const response = await fetch(`${API_URL}/api/cart/quote`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ items })
  });
  if (!response.ok) throw new Error("Impossibile calcolare il carrello");
  return response.json();
}
