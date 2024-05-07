import React from 'react';
import './App.css';
import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { BiReset, BiDownload, BiTrash } from 'react-icons/bi'; // Importe os ícones BiReset, BiDownload e BiTrash
import { BiSave } from 'react-icons/bi'; // Importe o ícone BiSave
import { AiOutlinePlus } from 'react-icons/ai'; // Importe o ícone AiOutlinePlus
import { BiRefresh } from 'react-icons/bi';
import { AiFillPlusCircle } from 'react-icons/ai'; // Importe o ícone AiFillPlusCircle




function App() {
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

  const handleCheck = (index) => {
    const newItems = [...items];
    newItems[index].completed = !newItems[index].completed;
    setItems(newItems);
  };

  let fieldID = "inputfield_newitem";

  useEffect(() => {
    if (selectedUser) {
      setItems(selectedUser.items);
    }
  }, [selectedUser]);

  function updateItemList() {
    const id = currentId;
    const value = document.getElementById(fieldID).value;

    let newItem = {
      value,
      quantity,
      unit,
      id,
      category,
    };

    if (newItem.value !== "") {
      if (editingItem !== null) {
        const updatedItems = items.map((item) =>
          item.id === editingItem.id ? newItem : item
        );
        setItems(updatedItems);
        setEditingItem(null);
        setIsAddButton(true);
      } else {
        setItems([...items, newItem]);
      }
      document.getElementById(fieldID).value = "";
      setQuantity(1);
      setUnit("stk");
      setCurrentId(currentId + 1);
      setCategory("Lebensmittel");
    }
  }

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
  
      // Focar no campo "Produto"
      document.getElementById('inputfield_newitem').focus();
  }


  function saveUserShopping() {
    if (userName.trim() === "") {
      alert("Bitte geben Sie einen Benutzernamen ein.");
      return;
    }

    const userShopping = {
      userName,
      items: [...items],
    };

    const existingUserIndex = savedUsers.findIndex(user => user.userName === userName);

    if (existingUserIndex !== -1) {
      const updatedUsers = [...savedUsers];
      updatedUsers[existingUserIndex] = userShopping;
      setSavedUsers(updatedUsers);
    } else {
      const updatedUsers = [...savedUsers, userShopping];
      setSavedUsers(updatedUsers);
      alert("Liste gespeichert!");
    }

    setItems([]);
    setSelectedUser(userShopping);
  }

  function deleteCurrentUserList() {
    const isConfirmed = window.confirm("Möchten Sie die aktuelle Liste wirklich löschen?");
    if (isConfirmed) {
      setItems([]);
      setSelectedUser(null);
      setSavedUsers(savedUsers.filter(user => user.userName !== userName));
    }
  }

  function resetShopping() {
    setUserName("");
    setItems([]);
    setSelectedUser(null);
  }

  function selectUser(user) {
    setUserName(user.userName);
    setSelectedUser(user);
  }

  function downloadList() {
    const userNameLine = `Name des Käufers: ${userName}`;
    const listContent = items.map(item => (
      `${item.value}: ${item.quantity} ${item.unit}, ${item.category}`
    )).join('\n');

    const pdf = new jsPDF();
    pdf.setFillColor(104, 190, 244);
    pdf.rect(0, 0, pdf.internal.pageSize.width, pdf.internal.pageSize.height, 'F');

    const logoUrl = 'shopwise-high-resolution-logo-transparent.png';
    pdf.addImage(logoUrl, 'PNG', 150, 10, 56, 40);
    pdf.setFont('helvetica');
    pdf.setFontSize(20);
    pdf.text(`${userNameLine}\n\nEinkaufsliste:\n${listContent}`, 10, 50);
    pdf.text(`Danke, dass Sie unsere App nutzen`, 10, 250);

    pdf.save('shopping-list.pdf');
  }

  return (
    <>
      <div className="container mt-4">
        <div className="row justify-content-md-center gap-1.5">
          <input
            type="text"
            className="col-2 fs-6 rounded text-center border-0 w-25 p-2 einkäufer mt-3"
            placeholder="Name des Einkäufers"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            id={fieldID}
            type="text"
            className="col-2 fs- rounded text-center border-0 p-2 mt-3"
            style={{ width: '291px' }}
            placeholder="Neues Produkt"
            aria-describedby="basic-addon2"
          />
          <input
            type="number"
            className="col-1 fs-6 rounded text-center border-0 p-2 mt-3"
            style={{ width: '70px' }}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
          />
          <select
            className="col-2 fs-6 rounded text-center border-0 mt-3"
            style={{ width: '70px'}}
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          >
            <option value="g">g</option>
            <option value="kg">kg</option>
            <option value="stk">stk</option>
            <option value="pkg">pkt</option>
          </select>
          <select
            className="col-2 fs-6 rounded text-center border-0 kategorie mt-3"
            style={{ width: '190px' }}
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
          <div className="col-2 fs-5 input-group-append rounded text-center border-0 w-27 p-0 mt-3">
          <button
  onClick={updateItemList}
  className={`btn btn-outline-warning add-button d-flex align-items-center ${isAddButton ? '' : 'text-black font-weight-bold'}`}
  style={{ width: '185px', marginLeft: '2px', height: '40px', fontSize: '17px', alignItems: 'center', justifyContent: 'center' }}
>
  {isAddButton ? "Hinzufügen" : "Aktualisieren"}

  {isAddButton ? <AiFillPlusCircle style={{ marginLeft: '5px' }} /> : <BiRefresh style={{ marginLeft: '5px' }} />} {/* Condicionalmente renderiza o ícone */}
</button>




          </div>
        </div>
        <div className="row justify-content-md-center mt-3">
          <select
            className="col-2 fs-6 rounded text-center border-0 einkaufslisten mt-2"
            style={{ width: '380px', margin: '6px', padding: '8px 10px' }}
            value={selectedUser ? selectedUser.userName : ""}
            onChange={(e) => selectUser(savedUsers.find(user => user.userName === e.target.value))}
          >
            <option value="" disabled>Einkaufslisten</option>
            {savedUsers.map((user, index) => (
              <option key={index} value={user.userName}>{user.userName}</option>
            ))}
          </select>
          <button
            onClick={saveUserShopping}
            className="btn btn-outline-warning save-button fs-6 mt-2"
            style={{ width: '190px', height: '40px' }}
          >
          <BiSave /> Speichern {/* Aqui você adiciona o ícone BiSave */}
          </button>
          <button
            onClick={resetShopping}
            className="btn btn-outline-warning reset-button ml-2 fs-6 mt-2"
            style={{ width: '190px', height: '40px' }}
          >
            <BiReset /> Zurücksetzen
          </button>
          <button
            onClick={downloadList}
            className="btn btn-outline-warning downloadlist-button ml-2 fs-6 mt-2"
            style={{ width: '160px', padding: '6px 10px', height: '40px' }} 
          >
            <BiDownload /> Liste Download
          </button>
          <button
            onClick={() => deleteCurrentUserList()}
            className="btn btn-outline-warning deletelist-button ml-2 fs-6 mt-2"
            style={{ width: '185px', padding: '6px 8px', height: '40px'}}
          >
            <BiTrash /> Liste löschen
          </button>

        </div>
        </div>
        <div className="container mt-3 d-flex justify-content-center">
    <table className="table table-striped fs-5 text-center" style={{ maxWidth: '1130px', borderRadius: '10px' }}>
      <thead>
        <tr style={{ height: '65px' }}>
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
        {items.map((item, index) => (
          <tr key={item.id} style={{ height: '60px' }}>
            <td>{index + 1}</td>
            <td><input type="checkbox" className="form-check-input" onChange={() => handleCheck(index)} checked={item.completed} /></td>
            <td style={{ textDecoration: item.completed ? 'line-through' : 'none' }}>{item.value}</td>
            <td>{item.quantity}</td>
            <td>{item.unit}</td>
            <td>{item.category}</td>
            <td>
              <button className="btn btn-link" style={{ marginTop: '-5px' }} onClick={() => startEditing(item)}>
                <i className="bi bi-pencil-square text-info fs-5"></i>
              </button>
            </td>
            <td>
              <button className="btn btn-link" style={{ marginTop: '-5px' }} onClick={() => deleteItem(item.id)}>
                <i className="bi bi-trash text-danger fs-5"></i>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>



    </>
  );
}

export default App;
