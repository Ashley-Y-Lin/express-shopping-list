"use strict";

const request = require("supertest");

const app = require("./app");
const { shoppingCart } = require("./fakeDb");

beforeEach(function () {
  shoppingCart.add({ name: "popsicle", price: 1.45 });
});

afterEach(function () {
  shoppingCart.items = [];
});


/** GET /items - returns `{ items: [
  { name: "popsicle", price: 1.45 },
  { name: "cheerios", price: 3.40 }
]}` */

describe("GET /items", function () {
  it("Gets a list of items", async function () {
    const resp = await request(app).get(`/items`);

    expect(resp.body).toEqual({ items: [{ name: "popsicle", price: 1.45 }] });
  });
});

/** POST /items - adds an item to db.items, and returns the item upon success.
 * If no item is given, it throws BadRequestError.
 */

describe("POST /items", function () {
  it("Returns the created item with a valid item", async function () {
    const resp = await request(app)
      .post(`/items`)
      .send({
        name: "cheerios",
        price: 3.40
      });
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      added: { name: "cheerios", price: 3.40 }
    });
  });

  it("Adds the item to the database", async function () {
    const resp = await request(app)
      .post(`/items`)
      .send({
        name: "cheerios",
        price: 3.40
      });
    expect(resp.statusCode).toEqual(201);
    expect(shoppingCart.items).toEqual([
      { name: "popsicle", price: 1.45 },
      { name: "cheerios", price: 3.40 }
    ]);
  });

  it("Throws a BadRequestError when the body is empty", async function () {
    const resp = await request(app)
      .post(`/items`)
      .send();
    expect(resp.statusCode).toEqual(400);
    expect(shoppingCart.items).toEqual([
      { name: "popsicle", price: 1.45 },
    ]);
  });

  it("Returns a BadRequestError with an invalid item", async function () {
    const resp = await request(app)
      .post(`/items`)
      .send({
        ducks: "cheerios",
        price: "lots of money"
      });
    expect(resp.statusCode).toEqual(400);
  });
});


/** GET /items/:names: returns a single item {name: "popsicle", "price": 1.45}.
 * Throws a NotFoundError if the item doesn't exist.
 */

describe("GET /items/:name", function () {
  it("Gets a single item", async function () {
    const resp = await request(app).get(`/items/popsicle`);

    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({ name: "popsicle", price: 1.45 });
  });

  it("Throws a NotFoundError when the item doesn't exist", async function () {
    const resp = await request(app).get(`/items/randomitem`);

    expect(resp.statusCode).toEqual(404);
  });
});


/** PATCH /items/:name - modifies the item; returns the updated item
 *  `{updated: {name: "new popsicle", price: 2.45}}`
 *
 * If item is not found, throws a NotFoundError. */

describe("PATCH /items/:name", function () {
  it("Returns the single updated item, when given valid name and price", async function () {
    const resp = await request(app)
      .patch(`/items/popsicle`)
      .send({
        name: "new popsicle",
        price: 100.0
      });
    expect(resp.body).toEqual({ updated: { name: "new popsicle", price: 100.0 } });
  });

  it("Returns the single updated item, when given only a valid name", async function () {
    const resp = await request(app)
      .patch(`/items/popsicle`)
      .send({
        name: "new popsicle",
      });
    expect(resp.body).toEqual({ updated: { name: "new popsicle", price: 1.45 } });
  });

  it("Throws a NotFoundError when the item doesn't exist", async function () {
    const resp = await request(app)
      .patch(`/items/randomitem`)
      .send({
        name: "nice snack",
        price: 100.0
      });

    expect(resp.statusCode).toEqual(404);
  });
});

/** DELETE /items/:name - delete item,
 *  return `{message: "Deleted"}` */

describe("DELETE /items/:name", function() {
  it("Deletes a single item", async function() {
    const resp = await request(app)
      .delete(`/items/popsicle`);
    expect(resp.body).toEqual({ message: "Deleted" });
    expect(shoppingCart.items.length).toEqual(0);
  });

  it("Throws a NotFoundError when the item doesn't exist", async function () {
    const resp = await request(app).delete(`/items/randomitem`);

    expect(resp.statusCode).toEqual(404);
  });
});