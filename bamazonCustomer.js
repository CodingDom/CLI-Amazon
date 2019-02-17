const Table = require("cli-table2");
const colors = require("colors");
const fuzzy = require("fuzzy");
const inquirer = require("inquirer");
const mysql = require("mysql");
const Promise = require("promise");

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

const connection = mysql.createConnection({
    host: "localhost",

    port : 3306,

    user : "test",

    password : "Testing123",

    database : "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    showItems();
});

function showItems() {
    connection.query("SELECT item_id, product_name, price FROM products", function(err, res) {
        if (err) throw err;
        const products = [];
        const table = new Table({
            head : ["ID","PRICE","ITEM"]
        });
        res.forEach(function(data) {
            table.push([colors.yellow(data.item_id),colors.green(data.price),colors.blue(data.product_name)]);
            products.push(data.product_name + " | ".red + "id:"+data.item_id);
        });
        products.sort();
        console.log(table.toString());
        inquirer.prompt([
            {
                type: "autocomplete",
                message : "Enter an item you would like to purchase",
                name : "product",
                source : function(answers, input) {
                    input = input || 'zzzzz';
                    return new Promise(function(resolve) {
                      setTimeout(function() {
                        var fuzzyResult = fuzzy.filter(input, products);
                        resolve(
                          fuzzyResult.map(function(el) {
                            return el.original;
                          })
                        );
                      }, Math.floor(Math.random()*250)+50);
                    });
                }
            },
            {
                type: "number",
                message : "How many would you like purchase?",
                name : "quantity",
                default : 1
            }
        ]).then(function(resp) {
            const id = resp.product.split("id:")[1];
            const quantity = parseInt(resp.quantity);
            makePurchase(id,quantity);
        });
    });
};

function makePurchase(id,quantity) {
    connection.query(
        `SELECT stock_quantity,price FROM products WHERE item_id = ${id}`,
        function(err, res) {
            if (err) throw err;
            const inStock = parseInt(res[0].stock_quantity);
            if (quantity <= inStock) {
                const price = (parseFloat(res[0].price)*quantity).toFixed(2);
                connection.query(
                    `UPDATE products SET stock_quantity=stock_quantity-${quantity} WHERE item_id=${id}`,
                    function(err2,res2) {
                        if (err2) throw err2;
                        console.log(`Purchase successful!\nTotal Cost: $${price}`.green);
                        connection.end();
                });
            } else {
                console.log("Sorry, we don't have enough in stock to fulfill your order..".red);
                connection.end();
            }
        },
    );
};