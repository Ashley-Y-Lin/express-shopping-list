"use strict";

const express = require("express");
const { checkValidItem } = require("./middleWare");

const { shoppingCart } = require("./fakeDb");
const { ExpressError,
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
  ForbiddenError, } = require("./expressError");

const router = new express.Router();

/** GET /items: returns list of shopping items
 * e.g. { items: [
          { name: "popsicle", price: 1.45 },
          { name: "cheerios", price: 3.40 }
        ]}
*/
router.get("/", function (req, res) {
  return res.json({ items: shoppingCart.items });
});

/** POST /items: accepts JSON body, adds item, returns added item
 * {name: "popsicle", price: 1.45} =>
   {added: {name: "popsicle", price: 1.45}}
*/
router.post("/", checkValidItem, function (req, res) {
  shoppingCart.add(req.body);

  return res.status(201).json({ added: req.body });
});

/** GET /items/:names: returns a single item
 * e.g. {name: "popsicle", "price": 1.45}
*/
router.get("/:name", function (req, res) {
  const foundItem = shoppingCart.findItem(req.params.name);

  if (!foundItem) throw new NotFoundError();

  return res.json(foundItem);
});

/** PATCH /items/:name: accepts JSON body, modify item, and return the item
 * {name: "new popsicle", price: 2.45} =>
  {updated: {name: "new popsicle", price: 2.45}}
*/
router.patch("/:name", function (req, res) {
  if (req.body === undefined) throw new BadRequestError();

  let foundItem = shoppingCart.findItem(req.params.name);
  if (!foundItem) throw new NotFoundError();

  foundItem.name = req.body.name || foundItem.name;
  foundItem.price = req.body.price || foundItem.price;

  return res.json({ updated: foundItem });
});

/** DELETE /items/:name: delete item
 * returns {message: "Deleted"}
*/
router.delete("/:name", function (req, res) {
  //TODO: try to use a filter or findIndex, also allows you to fail fast

  const foundItem = shoppingCart.findItem(req.params.name);
  if (!foundItem) throw new NotFoundError();

  shoppingCart.remove(foundItem);

  return res.json({ message: "Deleted" });
});

module.exports = router;