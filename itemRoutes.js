"use strict";

const express = require("express");

const db = require("./fakeDb");
const { ExpressError,
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
  ForbiddenError, } = require("./expressError");

const router = new express.Router();

//TODO: implement a class around the item
// TODO: make docstrings give example of response

//TODO: make this middleware
function checkValidItem(item) {
  if (!item.name || !(typeof item.name === 'string') ||
    !item.price || !(typeof item.price === 'number')) {
    throw new BadRequestError();
  }
}

/** GET /items: returns list of shopping items */
router.get("/", function (req, res) {
  return res.json({ items: db.items });
});

/** POST /items: accepts JSON body, adds item, returns added item */
router.post("/", function (req, res) {
  if (req.body === undefined) throw new BadRequestError();

  checkValidItem(req.body);

  db.items.push(req.body);
  return res.status(201).json({ added: req.body });
});

/** GET /items/:names: returns a single item */
router.get("/:name", function (req, res) {
  //TODO: use .find (add this method to your class)
  for (let i = 0; i < db.items.length; i++) {
    if (db.items[i].name === req.params.name) {
      return res.json(db.items[i]);
    }
  }
  throw new NotFoundError();
});

/** PATCH /items/:name: accepts JSON body, modify item, and return the item */
router.patch("/:name", function (req, res) {
  if (req.body === undefined) throw new BadRequestError();

  for (let i = 0; i < db.items.length; i++) {
    if (db.items[i].name === req.params.name) {
      db.items[i].name = req.body.name || db.items[i].name;
      db.items[i].price = req.body.price || db.items[i].price;
      return res.json({ updated: db.items[i] });
    }
  }
  throw new NotFoundError();
});

/** DELETE /items/:name: delete item */
router.delete("/:name", function (req, res) {
  //TODO: try to use a filter or findIndex, also allows you to fail fast
  for (let i = 0; i < db.items.length; i++) {
    if (db.items[i].name === req.params.name) {
      db.items.splice(i, 1);
      return res.json({ message: "Deleted" });
    }
  }
  throw new NotFoundError();
});

module.exports = router;