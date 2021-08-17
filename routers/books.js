//Load express and create router
const express = require("express");
const router = express.Router();

//Load Ajv a validation library and define schema for book
const Ajv = require("ajv");
const ajv = new Ajv();

//Create a framework for schema validation which reads (and caches) schemas read from files
//and validates the same for all POST/PUT calls. Also include a standard response structure that
//can wrap the validation errors

const schema = {
  type: "object",
  properties: {
    name: { type: "string" },
    description: { type: "string" },
  },
  required: ["name"],
  additionalProperties: false,
};

// Book storage array
var books = [
  { id: "100", name: "The Alchemist", description: "Paulo Coelho's classic" },
  {
    id: "101",
    name: "The Fountainhead",
    description: "Ayn Rand's controversial novel",
  },
  {
    id: "102",
    name: "A Brief History of Time",
    description: "Stephen Hawking's popular legacy",
  },
  {
    id: "103",
    name: "Principia Mathematica",
    description: "When Sir Isaac Newton invented calculus",
  },
];
var indexCount = 104;

router.get("/", (req, res) => {
  res.status(200).send(books);
});

router.post("/", (req, res) => {
  var book = JSON.parse(JSON.stringify(req.body));
  const valid = ajv.validate(schema, book);
  if (valid) {
    book.id = indexCount + "";
    books.push(book);
    indexCount++;
    res.status(201).send(book);
  } else {
    res.status(400).send(ajv.errors);
  }
});

router.get("/:id", (req, res) => {
  var book = books.find(findBook, req.params);
  res.status(200).send(book);
});

router.delete("/:id", (req, res) => {
  var index = books.findIndex(findBook, req.params);
  if (index >= 0) {
    books.splice(index, 1);
    res.status(200).send("Removed book successfully!");
  } else {
    res.status(404).send("Book not found!");
  }
});

var findBook = function (book) {
  if (this.id === book.id) return true;
};

module.exports = router;
