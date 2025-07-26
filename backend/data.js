const fs = require("fs");
const { parse } = require("csv-parse");

let products = [];
let orders = [];
let sales = [];

// Load products.csv
fs.createReadStream("./products.csv")
  .pipe(parse({ columns: true }))
  .on("data", (row) => products.push(row))
  .on("end", () => console.log("Products loaded:", products.length));

// Load orders.csv
fs.createReadStream("./orders.csv")
  .on("data", (row) => orders.push(row))
  .on("end", () => console.log("Orders loaded:", orders.length));

// Load sales.csv
fs.createReadStream("./sales.csv")
  .pipe(parse({ columns: true }))
  .on("data", (row) => sales.push(row))
  .on("end", () => console.log("Sales loaded:", sales.length));

module.exports = { products, orders, sales };