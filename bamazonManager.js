const Table = require("cli-table2");
const colors = require("colors");
const fuzzy = require("fuzzy");
const inquirer = require("inquirer");
const mysql = require("mysql");
const Promise = require("promise");

const connection = mysql.createConnection(require("./host.json"));

const commandList = {
    "View Products for Sale":displayProducts,
    "View Low Inventory":displayLowInventory,
    "Add to Inventory":addInventory,
    "Add new Product":addProduct
};

let products = [];

function displayProducts() {
    // Grabbing all product information from database
    connection.query(
    "SELECT item_id, product_name, price, stock_quantity FROM products", 
    function(err, res) {
        if (err) throw err;
        // Reset products list
        products = [];
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
    "SELECT item_id, product_name, stock_quantity FROM products",
    function(err,res){
        promptCommands();
    });
};

function addProduct() {
    promptCommands();
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
    console.log("Now quitting, goodbye!".yellow);
    connection.end();
}

console.log("Now connecting to Bamazon Management System".green);

connection.connect(function(err) {
    if (err) throw err;
    promptCommands();
});

// * Create a new Node application called `bamazonManager.js`. Running this application will:
//   * If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.

//   * If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.

//   * If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.

//   * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.