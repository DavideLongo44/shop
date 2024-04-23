import './App.css';
import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';

function App() {
  // Zustände
  const [items, setItems] = useState([]);
  const [isAddButton, setIsAddButton] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState("stk");
  const [currentId, setCurrentId] = useState(1000);
  const [category, setCategory] = useState("Lebensmittel");
  const [editingItem, setEditingItem] = useState(null);
  const [userName, setUserName] = useState("");
  const [savedUsers, setSavedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if(selectedUser) {
      setItems(selectedUser.items);
    }
  }, [selectedUser]);

  // Callback-Funktion zum Abrufen des Preises und Angebots eines Produkts
  async function fetchPriceAndOffer(itemName) {
    const url = 'https://price-analytics.p.rapidapi.com/search-by-term';
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-RapidAPI-Key': '8a7f697789msha9cc675e7bcb39ep1bff95jsn95278506a417',
        'X-RapidAPI-Host': 'price-analytics.p.rapidapi.com'
      },
      body: new URLSearchParams({
        source: 'amazon',
        country: 'de',
        values: itemName // Statt 'iphone 11' verwenden Sie den übergebenen Produktnamen
      })
    };
  
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json(); // Angenommen, die API gibt JSON zurück und nicht Nur Text
      return {
        price: data.price || 'Nicht verfügbar',
        onSaleAt: data.onSaleAt || 'Nicht im Angebot'
      };
    } catch (error) {
      console.error('Fehler beim Abrufen der Produktinformationen:', error);
      return { price: 'Unbekannt', onSaleAt: 'Unbekannt' };
    }
  }

  function handleItemInput(e) {
    if (editingItem) {
      setEditingItem({
        ...editingItem,
        value: e.target.value
      });
    }
  }

  async function updateItemList() {
    let itemName = editingItem ? editingItem.value : document.getElementById("inputfield_newitem").value;
    const productDetails = await fetchPriceAndOffer(itemName);

    let newItem = {
      value: itemName,
      quantity,
      unit,
      id: currentId,
      category,
      price: productDetails.price,
      onSaleAt: productDetails.onSaleAt
    };

    if (editingItem) {
      const updatedItems = items.map(item => item.id === editingItem.id ? newItem : item);
      setItems(updatedItems);
      setEditingItem(null);
    } else {
      setItems([...items, newItem]);
      setCurrentId(currentId + 1);
    }

    setIsAddButton(true);
    setQuantity(1);
    setUnit("stk");
    setCategory("Lebensmittel");
  }

  function deleteItem(idToDelete) {
    setItems(items.filter(item => item.id !== idToDelete));
  }

  function editItem(itemToEdit) {
    setIsAddButton(false);
    setEditingItem(itemToEdit);
  }

  function saveUserShopping() {
    if (!userName) {
      alert("Bitte gib erst einen Namen ein.");
      return;
    }

    const userShoppingData = {
      userName,
      items
    };

    const newSavedUsers = savedUsers.filter(user => user.userName !== userName);
    newSavedUsers.push(userShoppingData);
    setSavedUsers(newSavedUsers);

    setSelectedUser(userShoppingData);
  }

  function downloadList() {
    const doc = new jsPDF();
    doc.text(`Einkaufsliste für: ${userName}`, 10, 10);
    items.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.value}, Menge: ${item.quantity} ${item.unit}, Kategorie: ${item.category}`, 10, (index + 1) * 10 + 20);
    });
    doc.save('Einkaufsliste.pdf');
  }

  function selectUser(userName) {
    const user = savedUsers.find(u => u.userName === userName);
    setSelectedUser(user);
  }

  function resetShopping() {
    setUserName("");
    setItems([]);
    setSelectedUser(null);
  }

  function deleteUserShopping() {
    setSavedUsers(savedUsers.filter(user => user.userName !== userName));
    resetShopping();
  }
 
  // JSX für die Darstellung der Komponente
  return (
    <>
      <div className="container mt-4">
        <div className="input-group row justify-content-md-center gap-3">
          {/* Eingabefeld für den Namen des Einkäufers */}
          <input
            type="text"
            className="col-2 fs-5 rounded text-center border-0 w-25 p-2 einkäufer"
            placeholder="Name des Einkäufers"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          {/* Eingabefeld für den Produktname */}
          <input
            type="text"
            id="inputfield_newitem"
            className="col-2 fs-5 rounded text-center border-0 w-26"
            placeholder="Neues Produkt"
            aria-describedby="basic-addon2"
          />
          {/* Eingabefeld für die Menge */}
          <input
            type="number"
            className="col-1 fs-5 rounded text-center border-0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
          />
          {/* Dropdown-Menü für die Einheit */}
          <select
            className="col-1 fs-5 rounded text-center border-0"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          >
            <option value="g">g</option>
            <option value="kg">kg</option>
            <option value="stk">stk</option>
            <option value="pkg">pkg</option>
          </select>
          {/* Dropdown-Menü für die Kategorie */}
          <select
            className="col-2 fs-5 rounded text-center border-0 kategorie"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Lebensmittel">Lebensmittel</option>
            <option value="Elektronik">Elektronik</option>
            <option value="Bekleidung">Bekleidung</option>
            <option value="Haushalt">Haushalt</option>
            <option value="Freizeit">Freizeit</option>
            <option value="Gesundheit">Gesundheit</option>
            <option value="Tierbedarf">Tierbedarf</option>
            <option value="Sonstiges">Sonstiges</option>
          </select>
          {/* Button zum Hinzufügen oder Aktualisieren */}
          <div className="col-2 input-group-append">
            <button
              onClick={updateItemList}
              className="btn btn-outline-warning add-button"
            >
              {isAddButton === true ? "Hinzufügen" : "Aktualisieren"}
            </button>
          </div>
        </div>
        {/* Reihe für die Bedienungselemente: Speichern, Zurücksetzen und Auswahl des Benutzers */}
        <div className="row justify-content-md-center mt-3">
          {/* Button zum Speichern */}
          <button
            onClick={saveUserShopping}
            className="btn btn-outline-warning save-button"
          >
            Speichern
          </button>
          {/* Button zum Zurücksetzen */}
          <button
            onClick={resetShopping}
            className="btn btn-outline-warning reset-button"
          >
            Zurücksetzen
          </button>

          <button
            onClick={() => deleteUserShopping()}
            className="btn btn-outline-warning deletelist-button"
          >
            Liste löschen
          </button>
          {/* Dropdown-Menü für die Auswahl gespeicherter Benutzer */}
          <select
            className="col fs-4 rounded text-center border-0 einkaufslisten"
            value={selectedUser ? selectedUser.userName : ""}
            onChange={(e) => selectUser(savedUsers.find(user => user.userName === e.target.value))}
          >
            <option value="" disabled>Einkaufslisten</option>
            {savedUsers.map((user, index) => (
              <option key={index} value={user.userName}>{user.userName}</option>
            ))}
          </select>
        </div>
      </div>
      {/* Anzeige der Liste von Produkten */}
      <div className="container mt-3">
        <table className="table table-striped fs-4 rounded">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">✔</th>
              <th scope="col">Preis</th> {/* Neuer Header für Preis */}
              <th scope="col">Im Angebot bei</th> {/* Neuer Header für Angebotsdetails */}
              <th scope="col">Produkt</th>
              <th scope="col">Menge</th>
              <th scope="col">Einheit</th>
              <th scope="col">Kategorie</th>
              <th scope="col">Bearbeiten</th>
              <th scope="col">Löschen</th>
            </tr>
          </thead>
          <tbody>
            {/* Mapping über die Liste von Produkten */}
            {items.map((item, index) => (
              <tr key={item.id}>
                <th scope="row">{index + 1}</th>
                <th scope="row"><input type="checkbox" className="form-check-input" /></th>
                <td>{item.price}</td>
                <td>{item.onSaleAt}</td>
                <td>{item.value}</td>
                <td>{item.quantity}</td>
                <td>{item.unit}</td>
                <td>{item.category}</td>
                {/* Icon zum Starten der Bearbeitung */}
                <td>
                  <i
                    className="bi bi-pencil-square text-info fs-4"
                    onClick={() => editItem(item)}
                  ></i>
                </td>
                {/* Icon zum Löschen */}
                <td>
                  <i
                    className="bi bi-trash text-danger fs-4"
                    onClick={() => deleteItem(item.id)}
                  ></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={downloadList}
        className="btn btn-outline-warning downloadlist-button"
      >
        Liste Download
      </button>
    </>
  );
}

export default App;
