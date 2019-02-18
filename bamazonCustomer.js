const Table = require("cli-table2");
const colors = require("colors");
const fuzzy = require("fuzzy");
const inquirer = require("inquirer");
const mysql = require("mysql");
const Promise = require("promise");

const connection = mysql.createConnection(require("./host.json"));

// Storing gathered products
let products = [];

function displayProducts() {
    // Grabbing all product information from database
    connection.query(
    "SELECT item_id, product_name, price FROM products", 
    function(err, res) {
        if (err) throw err;
        // Reset products list
        products = [];
        // Create new table for output
        const table = new Table({
            head : ["ID","PRICE","ITEM"]
        });
        // Loop through data to store information
        res.forEach(function(data) {
            table.push([colors.yellow(data.item_id),"$"+colors.green(data.price),colors.blue(data.product_name)]);
            products.push(data.product_name + " | ".red + "id:"+data.item_id);
        });
        // Display table of products
        console.log(table.toString());
        products.sort();
        // Prompt user to make a purchase
        promptPurchase();
    });
};

function promptPurchase(origin,prompt) {
    // Allow user to search for product
    inquirer.prompt(prompt || [
        {
            type: "search",
            message : "Enter an item you would like to purchase",
            name : "product",
            source : function(answers, input) {
                // If no search input, don't show products
                input = input || '--starting with an empty search!--';
                return new Promise(function(resolve) {
                // Display "searching.." for a short period of time then show results
                setTimeout(function() {
                    // Use fuzzy to filter search results
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
            message : "How many would you like to purchase?",
            name : "quantity",
        }
    ]).then(function(resp) {
        const id = origin || resp.product.split("id:")[1];
        const quantity = parseInt(resp.quantity);
        makePurchase(id,quantity);
    });
}

function makePurchase(id,quantity) {
    // Validating entered quantity
    if (isNaN(quantity)) {
        // Re-prompt the user's purchase
        promptPurchase(id,[{type:"number",message:"Please enter a valid quantity:".yellow,name:"quantity"}]);
        return;
    } else if (quantity <= 0) {
        // If no quantity present, cancel request
        console.log("Cancelling purchase request".yellow);
        return connection.end();
    };
    // Checking how many products are in stock
    connection.query(
    `SELECT stock_quantity,price FROM products WHERE item_id = ${id}`,
    function(err, res) {
        if (err) throw err;
        const inStock = parseInt(res[0].stock_quantity);
        // Checking if there are enough of the product in stock
        if (quantity <= inStock) {
            // Calculating total price
            const price = (parseFloat(res[0].price)*quantity).toFixed(2);
            // Removing stock from database
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
    });
};

// Adding search to inquirer prompt method
inquirer.registerPrompt('search', require('inquirer-autocomplete-prompt'));

// Starting connection to database
connection.connect(function(err) {
    if (err) throw err;
    displayProducts();
});