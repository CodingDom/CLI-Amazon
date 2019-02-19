const Table = require("cli-table2");
const colors = require("colors");
const fuzzy = require("fuzzy");
const inquirer = require("inquirer");
const mysql = require("mysql");
const Promise = require("promise");

const connection = mysql.createConnection(require("./mysql-config.json"));

const commandList = {
    "View Product Sales by Department":displayProducts,
    "Create New Department":addDepartment,
};

function displayProducts() {
    // Grabbing all product information from database
    connection.query(
    "SELECT *,(product_sales - over_head_costs) AS total_profits FROM departments", 
    function(err, res) {
        if (err) throw err;
        // Setting up products list
        const products = [];
        // Create new table for output
        const table = new Table({
            head : ["ID","DEPARTMENT","OVER HEAD COST","PRODUCT SALES","TOTAL PROFITS"],
            style : {head: ["cyan"]},
        });
        // Loop through data to store information
        res.forEach(function(data) {
            let profit;
            if (data.total_profits < 0) {
                profit = colors.red("-$"+Math.abs(data.total_profits));
            } else {
                profit = colors.green("$"+data.total_profits);
            }
            table.push([colors.yellow(data.department_id),colors.blue(data.department_name),colors.magenta("$"+data.over_head_costs.toFixed(2)),colors.green("$"+data.product_sales),profit]);
            products.push(data.product_name + " | ".red + "id:"+data.item_id);
        });
        // Display table of products
        console.log(table.toString());
        promptCommands(0.75)
    });
};

function addDepartment() {

}

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

function addDepartment() {
    inquirer.prompt([
        {
            message : "Enter the name of department",
            name : "department"
        },
        {
            type : "number",
            message : "Enter over head cost",
            name : "cost"
        }
    ]).then(function(resp) {
        const department = resp.department.trim();
        const cost = parseFloat(resp.cost);
        const quantity = parseInt(resp.quantity);
        if (!department || department == "") {
            console.log("Invalid department name!".red);
            return promptCommands();
        } else if (!cost || isNaN(cost) || cost < 0) {
            console.log("Invalid over head cost!".red);
            return promptCommands();
        };
        connection.query(
        `INSERT INTO departments(department_name,over_head_costs) VALUES(?,?)`,
        [
            department,
            cost,
        ],
        function(err,res){
            if (err) throw err;
            console.log("\nSuccessfully added department to database!\n".green);
            promptCommands();
        });
    });
};

commandList["Exit".red] = function() {
    console.log("Now quitting, goodbye!\n".yellow);
    connection.end();
}

console.log("\nNow connecting to Bamazon Supervisor System\n".green);
connection.connect(function(err) {
    if (err) throw err;
    promptCommands();
});

