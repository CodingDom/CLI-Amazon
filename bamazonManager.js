const Table = require("cli-table2");
const colors = require("colors");
const fuzzy = require("fuzzy");
const inquirer = require("inquirer");
const mysql = require("mysql");
const Promise = require("promise");

const connection = mysql.createConnection(require("./mysql-config.json"));

const commandList = {
    "View Products for Sale":displayProducts,
    "View Low Inventory":displayLowInventory,
    "Add to Inventory":addInventory,
    "Add new Product":addProduct
};

function displayProducts() {
    // Grabbing all product information from database
    connection.query(
    "SELECT item_id, product_name, price, stock_quantity FROM products", 
    function(err, res) {
        if (err) throw err;
        // Setting up products list
        const products = [];
        // Create new table for output
        const table = new Table({
            head : ["ID","QUANTITY","PRICE","ITEM"]
        });
        // Loop through data to store information
        res.forEach(function(data) {
            table.push([colors.yellow(data.item_id),colors.magenta(data.stock_quantity),colors.green(data.price.toFixed(2)),colors.blue(data.product_name)]);
            products.push(data.product_name + " | ".red + "id:"+data.item_id);
        });
        // Display table of products
        console.log(table.toString());
        promptCommands(1.5)
    });
};

function displayLowInventory() {
    // Grabbing all low stocked products' information from database
    connection.query(
    "SELECT item_id, product_name, stock_quantity FROM products HAVING stock_quantity < 6", 
    function(err, res) {
        if (err) throw err;
        // Create new table for output
        const table = new Table({
            head : ["ID","QUANTITY","ITEM"]
        });
        // Loop through data to add to table
        res.forEach(function(data) {
            table.push([colors.yellow(data.item_id),colors.magenta(data.stock_quantity),colors.blue(data.product_name)]);
        });
        // Display table of products
        console.log(table.toString());
        promptCommands(1.5)
    });
};

function addInventory() {
    connection.query(
    "SELECT item_id, product_name, stock_quantity FROM products ORDER BY stock_quantity ASC",
    function(err,res){
        if (err) throw err;
        const products = [];
        res.forEach(function(item) {
            products.push(item.product_name + " | ".red + "Quantity: ".yellow + item.stock_quantity + " | ".red + "id:" + item.item_id)
        });
        inquirer.prompt([
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
                message : "How many would you like to add to the inventory?",
                name : "quantity",
            }
        ]).then(function(resp) {
            const id = resp.product.split("id:")[1];
            const quantity = parseInt(resp.quantity);
            if (isNaN(quantity) || quantity <= 0) {
                console.log("Invalid number, cancelling request..".red);
                return promptCommands(0.75);
            };
            connection.query(
            `UPDATE products SET stock_quantity=stock_quantity+${quantity} WHERE item_id=${id}`,
            function(err,res) {
                if (err) throw err;
                console.log(colors.green("Successfully added " + quantity + " more to the stock!\n"));
                promptCommands();
            });
        });
    });
};

function addProduct() {
    inquirer.prompt([
        {
            message : "Enter the name of product",
            name : "product"
        },
        {
            type : "number",
            message : "Enter price",
            name : "price"
        },
        {
            type : "number",
            message : "Enter in amount of stock",
            name : "quantity"
        }
    ]).then(function(resp) {
        const product = resp.product.trim();
        const price = parseFloat(resp.price);
        const quantity = parseInt(resp.quantity);
        if (!product || product == "") {
            console.log("Invalid product name!".red);
            return promptCommands();
        } else if (!price || isNaN(price) || price < 0) {
            console.log("Invalid price!".red);
            return promptCommands();
        } else if (!quantity || isNaN(quantity) || quantity < 0) {
            console.log("Invalid quantity!".red);
            return promptCommands();
        };
        connection.query(
        `INSERT INTO products(product_name,price,stock_quantity) VALUES(?,?,?)`,
        [
            product,
            price,
            quantity
        ],
        function(err,res){
            if (err) throw err;
            console.log("Successfully added product to database!\n".green);
            promptCommands();
        });
    });
};

function promptCommands(wait=0) {
    setTimeout(function() {
        inquirer.prompt([
            {
                type : "list",
                message : "Select An Action",
                choices : Object.keys(commandList),
                name : "command"
            }
        ]).then(function(resp) {
            commandList[resp.command]();
        });
    },wait*1000);
};

commandList["Exit".red] = function() {
    console.log("Now quitting, goodbye!\n".yellow);
    connection.end();
}

console.log("\nNow connecting to Bamazon Management System\n".green);

// Adding search to inquirer prompt method
inquirer.registerPrompt('search', require('inquirer-autocomplete-prompt'));

connection.connect(function(err) {
    if (err) throw err;
    promptCommands();
});