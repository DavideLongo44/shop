require("chromedriver");
var assert = require('assert');

const {Builder, By, Key} = require('selenium-webdriver');

describe('Einkaufliste', function() {
  it('Name hinzufügen', async function(){
    let driver = new Builder().forBrowser('chrome').build();
    await driver.get('http://shopwise.webhop.me/');
    await driver.findElement(By.className("col-2 fs-5 rounded text-center border-0 w-25 p-2 einkäufer")).sendKeys("banana")
    await driver.findElement(By.className("col-2 fs-5 rounded text-center border-0 w-26")).sendKeys("chiquita")
    //
    //await driver.findElement(By.id("menge")).selectByIndex(2)
    await driver.findElement(By.className("btn btn-outline-warning add-button")).click()
    await driver.findElement(By.className("bi bi-trash text-danger fs-4")).click()
    //await driver.quit()
  })
})