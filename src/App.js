import { useEffect, useMemo, useState } from "react";
import { fetchProducts, quoteCart } from "./api";
import "./App.css";

const fallbackProducts = [
  { id: "coffee", name: "Coffee", category: "Food", price: 6.9, unit: "250 g", emoji: "☕" },
  { id: "pasta", name: "Pasta", category: "Food", price: 1.49, unit: "500 g", emoji: "🍝" },
  { id: "milk", name: "Milk", category: "Food", price: 1.29, unit: "1 l", emoji: "🥛" },
  { id: "soap", name: "Soap", category: "Home", price: 2.99, unit: "1 pc", emoji: "🧼" },
  { id: "headphones", name: "Headphones", category: "Electronics", price: 29.9, unit: "1 pc", emoji: "🎧" },
  { id: "notebook", name: "Notebook", category: "Stationery", price: 3.5, unit: "1 pc", emoji: "📓" },
  { id: "bread", name: "Bread", category: "Food", price: 2.2, unit: "1 pc", emoji: "🍞" },
  { id: "apples", name: "Apples", category: "Food", price: 2.79, unit: "1 kg", emoji: "🍎" },
  { id: "shampoo", name: "Shampoo", category: "Home", price: 4.49, unit: "250 ml", emoji: "🧴" },
  { id: "tshirt", name: "T-shirt", category: "Clothing", price: 12.9, unit: "1 pc", emoji: "👕" }
];

const productTranslations = {
  coffee: { it: ["Caffè", "Alimentari", "250 g"], en: ["Coffee", "Food", "250 g"], de: ["Kaffee", "Lebensmittel", "250 g"] },
  pasta: { it: ["Pasta", "Alimentari", "500 g"], en: ["Pasta", "Food", "500 g"], de: ["Nudeln", "Lebensmittel", "500 g"] },
  milk: { it: ["Latte", "Alimentari", "1 l"], en: ["Milk", "Food", "1 l"], de: ["Milch", "Lebensmittel", "1 l"] },
  soap: { it: ["Sapone", "Casa", "1 pz"], en: ["Soap", "Home", "1 pc"], de: ["Seife", "Haushalt", "1 Stk"] },
  headphones: { it: ["Cuffie", "Elettronica", "1 pz"], en: ["Headphones", "Electronics", "1 pc"], de: ["Kopfhörer", "Elektronik", "1 Stk"] },
  notebook: { it: ["Quaderno", "Cartoleria", "1 pz"], en: ["Notebook", "Stationery", "1 pc"], de: ["Notizbuch", "Schreibwaren", "1 Stk"] },
  bread: { it: ["Pane", "Alimentari", "1 pz"], en: ["Bread", "Food", "1 pc"], de: ["Brot", "Lebensmittel", "1 Stk"] },
  apples: { it: ["Mele", "Alimentari", "1 kg"], en: ["Apples", "Food", "1 kg"], de: ["Äpfel", "Lebensmittel", "1 kg"] },
  shampoo: { it: ["Shampoo", "Casa", "250 ml"], en: ["Shampoo", "Home", "250 ml"], de: ["Shampoo", "Haushalt", "250 ml"] },
  tshirt: { it: ["Maglietta", "Abbigliamento", "1 pz"], en: ["T-shirt", "Clothing", "1 pc"], de: ["T-Shirt", "Kleidung", "1 Stk"] }
};

const translations = {
  it: { name: "Italiano", hero: "Fai la spesa con semplicità.", copy: "Aggiungi i prodotti che vuoi comprare e controlla subito la spesa stimata.", catalog: "CATALOGO", products: "Prodotti suggeriti", cart: "La tua lista", search: "Cerca prodotti...", add: "Aggiungi", custom: "Aggiungi alla lista", item: "Cosa devi comprare?", price: "Prezzo stimato (€)", qty: "Quantità", total: "Totale stimato", clear: "Svuota", verify: "Verifica lista", empty: "La lista è vuota.", emptyHelp: "Aggiungi un prodotto suggerito o scrivi il tuo.", articles: "articoli", fallback: "Backend non raggiungibile: uso il catalogo demo.", verified: "Lista verificata", customCategory: "Personalizzato", all: "Tutti" },
  en: { name: "English", hero: "Shop with ease.", copy: "Add the products you want to buy and check your estimated total instantly.", catalog: "CATALOG", products: "Suggested products", cart: "Your list", search: "Search products...", add: "Add", custom: "Add to list", item: "What do you need to buy?", price: "Estimated price (€)", qty: "Quantity", total: "Estimated total", clear: "Clear", verify: "Check list", empty: "Your list is empty.", emptyHelp: "Add a suggested product or enter your own.", articles: "items", fallback: "Backend unavailable: using the demo catalog.", verified: "List checked", customCategory: "Custom", all: "All" },
  de: { name: "Deutsch", hero: "Einfach einkaufen.", copy: "Füge deine Einkäufe hinzu und prüfe sofort die geschätzten Gesamtkosten.", catalog: "KATALOG", products: "Vorgeschlagene Produkte", cart: "Deine Liste", search: "Produkte suchen...", add: "Hinzufügen", custom: "Zur Liste hinzufügen", item: "Was möchtest du kaufen?", price: "Geschätzter Preis (€)", qty: "Menge", total: "Geschätzte Summe", clear: "Leeren", verify: "Liste prüfen", empty: "Deine Liste ist leer.", emptyHelp: "Füge ein Produkt hinzu oder gib ein eigenes ein.", articles: "Artikel", fallback: "Backend nicht erreichbar: Demo-Katalog wird verwendet.", verified: "Liste geprüft", customCategory: "Persönlich", all: "Alle" }
};

function App() {
  const [language, setLanguage] = useState(() => localStorage.getItem("shop-language") || "it");
  const t = translations[language];
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("shop-cart") || "{}"));
  const [customItems, setCustomItems] = useState(() => JSON.parse(localStorage.getItem("shop-custom-items") || "[]"));
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [customName, setCustomName] = useState("");
  const [customPrice, setCustomPrice] = useState("");
  const [customQuantity, setCustomQuantity] = useState(1);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    fetchProducts().then(setProducts).catch(() => { setProducts(fallbackProducts); setNotice(t.fallback); });
  }, [t.fallback]);

  useEffect(() => { localStorage.setItem("shop-cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem("shop-custom-items", JSON.stringify(customItems)); }, [customItems]);
  useEffect(() => { localStorage.setItem("shop-language", language); }, [language]);

  const localizedProducts = products.map(product => {
    const translation = productTranslations[product.id]?.[language];
    return translation ? { ...product, name: translation[0], category: translation[1], unit: translation[2] } : product;
  });

  const categories = useMemo(() => ["all", ...new Set(localizedProducts.map(product => product.category))], [localizedProducts]);
  const visibleProducts = localizedProducts.filter(product =>
    (category === "all" || product.category === category) &&
    product.name.toLowerCase().includes(query.toLowerCase())
  );
  const cartItems = Object.entries(cart)
    .map(([id, quantity]) => ({ product: localizedProducts.find(product => product.id === id), quantity }))
    .filter(item => item.product && item.quantity > 0);
  const standardTotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const customTotal = customItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = standardTotal + customTotal;
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0) + customItems.reduce((sum, item) => sum + item.quantity, 0);

  function changeQuantity(productId, delta) {
    setCart(current => {
      const nextQuantity = (current[productId] || 0) + delta;
      const next = { ...current };
      if (nextQuantity <= 0) delete next[productId]; else next[productId] = nextQuantity;
      return next;
    });
  }

  function addCustomItem(event) {
    event.preventDefault();
    const name = customName.trim();
    const price = Number(customPrice);
    const quantity = Number(customQuantity);
    if (!name || !Number.isFinite(price) || price < 0 || !Number.isInteger(quantity) || quantity < 1) {
      setNotice(language === "it" ? "Inserisci nome, prezzo e quantità validi." : language === "de" ? "Bitte Name, Preis und Menge prüfen." : "Enter a valid name, price and quantity.");
      return;
    }
    setCustomItems(items => [...items, { id: `custom-${Date.now()}`, name, price, quantity, emoji: "🛒" }]);
    setCustomName("");
    setCustomPrice("");
    setCustomQuantity(1);
    setNotice("");
  }

  function changeCustomQuantity(id, delta) {
    setCustomItems(items => items.map(item => item.id === id ? { ...item, quantity: item.quantity + delta } : item).filter(item => item.quantity > 0));
  }

  async function verifyCart() {
    try {
      const quote = await quoteCart(cartItems.map(item => ({ productId: item.product.id, quantity: item.quantity })));
      setNotice(`${t.verified}: ${(quote.total + customTotal).toFixed(2)} €`);
    } catch {
      setNotice(language === "it" ? "Impossibile verificare la lista." : language === "de" ? "Liste konnte nicht geprüft werden." : "Unable to check the list.");
    }
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <div className="brand-block"><img className="shop-logo" src="/shopwise-high-resolution-logo-transparent.png" alt="Shopwize" /><div><p className="eyebrow">SHOPWIZE</p><h1>{t.hero}</h1><p className="hero-copy">{t.copy}</p></div></div>
        <div className="hero-actions">
          <label className="language-picker"><span>🌐</span><select value={language} onChange={event => { setLanguage(event.target.value); setCategory("all"); }} aria-label="Language"><option value="it">IT</option><option value="en">EN</option><option value="de">DE</option></select></label>
          <div className="cart-summary"><span className="cart-icon">🛒</span><strong>{cartCount}</strong><span>{t.articles}</span></div>
        </div>
      </header>

      {notice && <div className="notice" role="status">{notice}</div>}

      <section className="custom-form-card">
        <div><p className="eyebrow">{t.custom.toUpperCase()}</p><h2>{t.item}</h2></div>
        <form onSubmit={addCustomItem} className="custom-form">
          <input value={customName} onChange={event => setCustomName(event.target.value)} placeholder={t.item} aria-label={t.item} />
          <input type="number" min="0" step="0.01" value={customPrice} onChange={event => setCustomPrice(event.target.value)} placeholder={t.price} aria-label={t.price} />
          <input className="quantity-input" type="number" min="1" step="1" value={customQuantity} onChange={event => setCustomQuantity(event.target.value)} aria-label={t.qty} />
          <button className="add-button" type="submit">{t.custom}</button>
        </form>
      </section>

      <section className="toolbar"><input type="search" placeholder={t.search} value={query} onChange={event => setQuery(event.target.value)} /><div className="category-list">{categories.map(item => <button key={item} className={category === item ? "category active" : "category"} onClick={() => setCategory(item)}>{item === "all" ? t.all : item}</button>)}</div></section>

      <div className="content-grid">
        <section><div className="section-heading"><div><p className="eyebrow">{t.catalog}</p><h2>{t.products}</h2></div><span>{visibleProducts.length} {t.articles}</span></div><div className="product-grid">{visibleProducts.map(product => <article className="product-card" key={product.id}><div className="product-emoji">{product.emoji}</div><span className="product-category">{product.category}</span><h3>{product.name}</h3><p className="product-unit">{product.unit}</p><div className="product-footer"><strong>{product.price.toFixed(2)} €</strong><button className="add-button" onClick={() => changeQuantity(product.id, 1)}>{t.add}</button></div></article>)}</div></section>

        <aside className="cart-panel"><div className="section-heading"><div><p className="eyebrow">{t.cart.toUpperCase()}</p><h2>{t.cart}</h2></div>{cartCount > 0 && <button className="clear-button" onClick={() => { setCart({}); setCustomItems([]); }}>{t.clear}</button>}</div>
          {cartCount === 0 ? <div className="empty-cart"><span>🛍️</span><p>{t.empty}</p><small>{t.emptyHelp}</small></div> : <><div className="cart-items">{cartItems.map(({ product, quantity }) => <div className="cart-item" key={product.id}><span className="cart-item-emoji">{product.emoji}</span><div className="cart-item-info"><strong>{product.name}</strong><small>{(product.price * quantity).toFixed(2)} €</small></div><div className="quantity-control"><button onClick={() => changeQuantity(product.id, -1)} aria-label="decrease">−</button><span>{quantity}</span><button onClick={() => changeQuantity(product.id, 1)} aria-label="increase">+</button></div></div>)}{customItems.map(item => <div className="cart-item" key={item.id}><span className="cart-item-emoji">{item.emoji}</span><div className="cart-item-info"><strong>{item.name}</strong><small>{(item.price * item.quantity).toFixed(2)} €</small></div><div className="quantity-control"><button onClick={() => changeCustomQuantity(item.id, -1)} aria-label="decrease">−</button><span>{item.quantity}</span><button onClick={() => changeCustomQuantity(item.id, 1)} aria-label="increase">+</button></div></div>)}</div><div className="cart-total"><span>{t.total}</span><strong>{total.toFixed(2)} €</strong></div><button className="checkout-button" onClick={verifyCart}>{t.verify}</button></>}
        </aside>
      </div>
    </main>
  );
}

export default App;


