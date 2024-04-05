describe('App', () => {
    beforeEach(() => {
      cy.visit('/') // Assicurati di adattare l'URL in base all'indirizzo della tua app React
    })
  
    it('should display input fields for user name and new product', () => {
      cy.get('.einkäufer').should('be.visible')
      cy.get('#inputfield_newitem').should('be.visible')
    })
  
    it('should allow user to enter user name', () => {
      const username = 'TestUser'
      cy.get('.einkäufer').type(username).should('have.value', username)
    })
  
    it('should allow user to enter new product details and add it to the list', () => {
      const productName = 'Test Product'
      const quantity = 2
      cy.get('#inputfield_newitem').type(productName)
      cy.get('.quantity').type(quantity)
      cy.get('.add-button').click()
      cy.contains(productName).should('be.visible')
    })
  
    it('should allow user to edit a product in the list', () => {
      const updatedProductName = 'Updated Product'
      cy.get('.edit-button').first().click()
      cy.get('#inputfield_newitem').clear().type(updatedProductName)
      cy.get('.update-button').click()
      cy.contains(updatedProductName).should('be.visible')
    })
  
    it('should allow user to delete a product from the list', () => {
      cy.get('.delete-button').first().click()
      cy.get('.confirmation-dialog').should('be.visible')
      cy.contains('Yes').click()
      cy.get('.deleted-product').should('not.exist')
    })
  
    it('should allow user to save the shopping list', () => {
      const username = 'TestUser'
      cy.get('.einkäufer').type(username)
      cy.get('.save-button').click()
      cy.contains('liste gespeichert!').should('be.visible')
    })
  
    it('should allow user to delete the current shopping list', () => {
      cy.get('.deletelist-button').click()
      cy.get('.confirmation-dialog').should('be.visible')
      cy.contains('Yes').click()
      cy.get('.product').should('not.exist')
    })
  
    it('should allow user to download the shopping list as PDF', () => {
      cy.get('.downloadlist-button').click()
      cy.wait(3000) // Attendere un po 'per il download del file
      // Verifica se il file è stato scaricato correttamente
      cy.readFile('cypress/downloads/shopping-list.pdf').should('exist')
    })
  })
  