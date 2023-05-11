// Representation of a shopping cart
class ShoppingCart {
  constructor(items) {
    this.items = items;
  }

  /** Accepts string input of name
   * Returns item object from this.items with corresponding name
   * {name: String, price: Number}
   *
   * OR returns null if item does not exist
  */
  findItem(name) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].name === name) {
        return this.items[i];
      }
    }
    return null;
  }

  /**Accept input of item object: {name: String, price: Number}
   * Adds item object to this.items
   */
  add(item) {
    this.items.push(item);
  }

  /**Accept input of item object: {name: String, price: Number}
   * Removes item object to this.items
   */
  remove(item) {
    const itemIndex = this._findIndex(item);
    this.items.splice(itemIndex, 1)
  }

  /** INTERNAL METHOD
   * Accepts string input of name
   * Returns index of the matching object this.items
   *
   * OR returns null if item does not exist
   */
  _findIndex(name) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].name === name) {
        return i;
      }
    }
    return null;
  }
}

let shoppingCart = new ShoppingCart([]);

module.exports = { shoppingCart };