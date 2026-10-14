import { useEffect, useMemo, useState } from "react";
import { fetchProducts, quoteCart } from "./api";
import "./App.css";

const fallbackProducts = [
  { id: "coffee", name: "Caffè", category: "Alimentari", price: 6.9, unit: "250 g", emoji: "☕" },
  { id: "pasta", name: "Pasta", category: "Alimentari", price: 1.49, unit: "500 g", emoji: "🍝" },
  { id: "milk", name: "Latte", category: "Alimentari", price: 1.29, unit: "1 l", emoji: "🥛" },
  { id: "soap", name: "Sapone", category: "Casa", price: 2.99, unit: "1 pz", emoji: "🧼" },
  { id: "headphones", name: "Cuffie", category: "Elettronica", price: 29.9, unit: "1 pz", emoji: "🎧" },
  { id: "notebook", name: "Notebook", category: "Cartoleria", price: 3.5, unit: "1 pz", emoji: "📓" }
];

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("shop-cart") || "{}"));
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tutti");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => {
        setProducts(fallbackProducts);
        setNotice("Backend non raggiungibile: visualizzo il catalogo demo.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    localStorage.setItem("shop-cart", JSON.stringify(cart));
  }, [cart]);

  const categories = useMemo(
    () => ["Tutti", ...new Set(products.map(product => product.category))],
    [products]
  );

  const visibleProducts = products.filter(product =>
    (category === "Tutti" || product.category === category) &&
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  const cartItems = Object.entries(cart)
    .map(([id, quantity]) => ({ product: products.find(product => product.id === id), quantity }))
    .filter(item => item.product && item.quantity > 0);

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  function changeQuantity(productId, delta) {
    setCart(current => {
      const nextQuantity = (current[productId] || 0) + delta;
      const next = { ...current };
      if (nextQuantity <= 0) delete next[productId];
      else next[productId] = nextQuantity;
      return next;
    });
  }

  async function checkoutPreview() {
    try {
      const quote = await quoteCart(cartItems.map(item => ({ productId: item.product.id, quantity: item.quantity })));
      setNotice(`Carrello verificato: ${quote.total.toFixed(2)} €`);
    } catch {
      setNotice("Impossibile verificare il carrello.");
    }
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">SHOPWISE</p>
          <h1>Acquista con semplicità.</h1>
          <p className="hero-copy">Un catalogo chiaro, un carrello sempre sotto controllo.</p>
        </div>
        <div className="cart-summary" aria-label="Riepilogo carrello">
          <span className="cart-icon">🛒</span>
          <strong>{cartCount}</strong>
          <span>articoli</span>
        </div>
      </header>

      {notice && <div className="notice" role="status">{notice}</div>}

      <section className="toolbar" aria-label="Filtri prodotti">
        <input
          type="search"
          placeholder="Cerca prodotti..."
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
        <div className="category-list">
          {categories.map(item => (
            <button key={item} className={category === item ? "category active" : "category"} onClick={() => setCategory(item)}>
              {item}
            </button>
          ))}
        </div>
      </section>

      <div className="content-grid">
        <section>
          <div className="section-heading">
            <div>
              <p className="eyebrow">CATALOGO</p>
              <h2>Prodotti in evidenza</h2>
            </div>
            <span>{loading ? "Caricamento..." : `${visibleProducts.length} prodotti`}</span>
          </div>
          <div className="product-grid">
            {visibleProducts.map(product => (
              <article className="product-card" key={product.id}>
                <div className="product-emoji">{product.emoji}</div>
                <span className="product-category">{product.category}</span>
                <h3>{product.name}</h3>
                <p className="product-unit">{product.unit}</p>
                <div className="product-footer">
                  <strong>{product.price.toFixed(2)} €</strong>
                  <button className="add-button" onClick={() => changeQuantity(product.id, 1)}>Aggiungi</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="cart-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">IL TUO ORDINE</p>
              <h2>Carrello</h2>
            </div>
            {cartCount > 0 && <button className="clear-button" onClick={() => setCart({})}>Svuota</button>}
          </div>
          {cartItems.length === 0 ? (
            <div className="empty-cart"><span>🛍️</span><p>Il carrello è vuoto.</p><small>Aggiungi un prodotto per iniziare.</small></div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map(({ product, quantity }) => (
                  <div className="cart-item" key={product.id}>
                    <span className="cart-item-emoji">{product.emoji}</span>
                    <div className="cart-item-info"><strong>{product.name}</strong><small>{(product.price * quantity).toFixed(2)} €</small></div>
                    <div className="quantity-control">
                      <button onClick={() => changeQuantity(product.id, -1)} aria-label={`Rimuovi ${product.name}`}>−</button>
                      <span>{quantity}</span>
                      <button onClick={() => changeQuantity(product.id, 1)} aria-label={`Aggiungi ${product.name}`}>+</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-total"><span>Totale</span><strong>{total.toFixed(2)} €</strong></div>
              <button className="checkout-button" onClick={checkoutPreview}>Verifica carrello</button>
            </>
          )}
        </aside>
      </div>
    </main>
  );
}

export default App;
