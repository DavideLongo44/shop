import './App.css';
import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
function App() {
// Zustände für die Liste von Produkten, den Zustand des Hinzufügen/Aktualisieren-Buttons,
// den Text des Eingabefelds, die Menge pro Produkt, die aktuelle ID und die Kategorie
// (Zustände für die Liste der Produkte, der Zustand der Schaltfläche Hinzufügen/Aktualisieren,
// der Text des Eingabefeldes, die Menge pro Produkt, die aktuelle ID und die Kategorie)

// Zustand für die Liste von Produkten 
const [items, setItems] = useState([]); 
// Zustand für den Hinzufügen/Aktualisieren-Button 
const [isAddButton, setIsAddButton] = useState(true); 
// Zustand für die Menge pro Produkt 
const [quantity, setQuantity] = useState(1); 
 // Zustand für die Einheit 
const [unit, setUnit] = useState("stk");
 // Zustand für die aktuelle ID 
const [currentId, setCurrentId] = useState(1000);
 // Zustand für die Kategorie 
const [category, setCategory] = useState("Lebensmittel");
// Zustand für das zu bearbeitende Element 
const [editingItem, setEditingItem] = useState(null); 
// Zustand für den Benutzernamen
const [userName, setUserName] = useState(""); 
// Zustand für die Liste der gespeicherten Benutzer
const [savedUsers, setSavedUsers] = useState([]);  
// Zustand für den ausgewählten Benutzer 
const [selectedUser, setSelectedUser] = useState(null); 

  // ID für das Eingabefeld
  let fieldID = "inputfield_newitem";

  // Effekt für das Laden des Einkaufs des ausgewählten Benutzers
  useEffect(() => {
    if (selectedUser) {
      setItems(selectedUser.items);
    }
  }, [selectedUser]);
  // Funktion zum Hinzufügen oder Aktualisieren eines Produkts

  function updateItemList() {
    const id = currentId;
    const value = document.getElementById(fieldID).value;
  
    // Neues Element erstellen
    let newItem = {
      value,
      quantity,
      unit,
      id,
      category,
    };
  
    // Überprüfen, ob der Produktname nicht leer ist
    if (newItem.value !== "") {
      // Überprüfen, ob das Element bearbeitet wird
      if (editingItem !== null) {
        // Aktualisierte Liste mit bearbeitetem Element erstellen
        const updatedItems = items.map((item) =>
          item.id === editingItem.id ? newItem : item
        );
        setItems(updatedItems);
        setEditingItem(null);
        setIsAddButton(true);
      } else {
        // Element zur Liste hinzufügen, wenn es nicht bearbeitet wird
        setItems([...items, newItem]);
      }
      // Eingabefeld zurücksetzen und Zustände aktualisieren
      document.getElementById(fieldID).value = "";
      setQuantity(1);
      setUnit("stk");
      setCurrentId(currentId + 1);
      setCategory("Lebensmittel");
    }
  }
  
  // Funktion zum Löschen eines Produkts
  function deleteItem(id) {
    const isConfirmed = window.confirm("Möchten Sie das Element wirklich löschen?");
    if (isConfirmed) {
      const updatedArray = items.filter((item) => item.id !== id);
      setItems(updatedArray);
    }
  }

  // Funktion zum Starten der Bearbeitung eines Produkts
  function startEditing(item) {
    // Bestätigungsdialog für den Start der Bearbeitung anzeigen
    const isConfirmed = window.confirm("Möchten Sie das Element wirklich bearbeiten?");
    if (!isConfirmed) {
      return;
    }
    // Bearbeitungsmodus aktivieren und Eingabefelder mit den Werten des ausgewählten Elements füllen
    setEditingItem(item);
    setIsAddButton(false);
    
    document.getElementById(fieldID).value = item.value;
    setQuantity(item.quantity);
    setUnit(item.unit);
    setCategory(item.category);
  }
  // Funktion zum Speichern der Einkaufsliste des Benutzers
  function saveUserShopping() {
    if (userName.trim() === "") {
      alert("Bitte geben Sie einen Benutzernamen ein.");
      return;
    }
    
    const userShopping = {
      userName,
      items: [...items],
    };


    // Überprüfen, ob der Benutzer bereits in der gespeicherten Liste existiert
  const existingUserIndex = savedUsers.findIndex(user => user.userName === userName);

  if (existingUserIndex !== -1) {
    // Wenn der Benutzer bereits existiert, ersetze die Liste
    const updatedUsers = [...savedUsers];
    updatedUsers[existingUserIndex] = userShopping;
    setSavedUsers(updatedUsers);
  } else {
    // Wenn der Benutzer nicht existiert, füge einen neuen Benutzer zur Liste hinzu
    const updatedUsers = [...savedUsers, userShopping];
    setSavedUsers(updatedUsers);
    alert("liste gespeichert! ");
  }

  // Zurücksetzen von Benutzername und Liste
  //setUserName(""); 
  setItems([]);
  // Setzen des ausgewählten Benutzers auf den gerade gespeicherten Benutzer
  setSelectedUser(userShopping);
 
}
  // Funktion zum Löschen der aktuellen Liste des Benutzers
  function deleteCurrentUserList() {
    // Bestätigungsdialog für das Löschen der aktuellen Liste anzeigen
    const isConfirmed = window.confirm("Möchten Sie die aktuelle Liste wirklich löschen?");
    if (isConfirmed) {
      // Liste und ausgewählten Benutzer zurücksetzen
      setItems([]);
      setSelectedUser(null);
      setSavedUsers(savedUsers.filter(user => user.userName !== userName));
      
    }

  }

  // Funktion zum Zurücksetzen der Einkaufsliste
  function resetShopping() {
    setUserName("");
    setItems([]);
    setSelectedUser(null);
  }

  // Funktion zum Auswählen eines Benutzers aus der Liste gespeicherter Benutzer
  function selectUser(user) {
    setUserName(user.userName);
    setSelectedUser(user);
  }
  function downloadList() {
    const userNameLine = `Name des Käufers: ${userName}`;
    const listContent = items.map(item => (
      `${item.value}: ${item.quantity} ${item.unit}, ${item.category}`
    )).join('\n');

    // Erstelle ein neues PDF-Dokument
    const pdf = new jsPDF();
    pdf.setFillColor(104, 190, 244); 
    pdf.rect(0, 0, pdf.internal.pageSize.width, pdf.internal.pageSize.height, 'F');

    
    // Füge das Logo deines Projekts zum Dokument hinzu
    const logoUrl = 'shopwise-high-resolution-logo-transparent.png'; // Ersetze dies durch den Pfad zu deinem Logo
    pdf.addImage(logoUrl, 'PNG',150, 10, 56, 40); // Passe die Koordinaten und Größe des Logos an
    pdf.setFont('helvetica');
    pdf.setFontSize(20);
    // Füge den Inhalt der Liste zum Dokument hinzu
    pdf.text(`${userNameLine}\n\nEinkaufsliste:\n${listContent}`, 10, 50);
    pdf.text(`Danke, dass Sie unsere App nutzen`,10 ,250);
    

    // Speichere das PDF-Dokument
    pdf.save('shopping-list.pdf');
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
            id={fieldID}
            type="text"

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
          onClick={() => deleteCurrentUserList()}
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
                <th scope="row"><input type="checkbox" class="form-check-input" /></th>
                <td>{item.value}</td>
                <td>{item.quantity}</td>
                <td>{item.unit}</td>
                <td>{item.category}</td>
                {/* Icon zum Starten der Bearbeitung */}
                <td>
                  <i
                    className="bi bi-pencil-square text-info fs-4"
                    onClick={() => startEditing(item)}
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

