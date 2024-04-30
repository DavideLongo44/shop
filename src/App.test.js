import { render, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

test('updateItemList function adds an item to the list', async () => {
  const { getByPlaceholderText, getByText, getByDisplayValue } = render(<App />);

  // Eingabefelder und Hinzufügen/Aktualisieren-Button finden
  const nameInput = getByPlaceholderText('Name des Einkäufers');
  const productInput = getByPlaceholderText('Neues Produkt');
  const addButton = getByText('Hinzufügen');

  // Benutzernamen und Produktname eingeben
  fireEvent.change(nameInput, { target: { value: 'Max' } });
  fireEvent.change(productInput, { target: { value: 'Milch' } });

  // Hinzufügen/Aktualisieren-Button klicken
  fireEvent.click(addButton);

  // Überprüfen, ob das Element zur Liste hinzugefügt wurde
  await waitFor(() => {
    const listItem = getByDisplayValue('Milch');
    expect(listItem).toBeInTheDocument();
  });
});
