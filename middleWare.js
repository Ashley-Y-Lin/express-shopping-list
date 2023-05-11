"use strict"
const express = require("express");
const { ExpressError,
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
  ForbiddenError, } = require("./expressError");

function checkValidItem(req, res, next) {
  if (req.body === undefined) throw new BadRequestError();
  const item = req.body;
  if (!item.name || !(typeof item.name === 'string') ||
    !item.price || !(typeof item.price === 'number')) {
    throw new BadRequestError();
  }
  return next();
}

module.exports = {checkValidItem}