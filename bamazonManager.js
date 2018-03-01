// GLOBAL VARIABLES =====================================================

// npm packages to be used
var inquirer = require("inquirer");
var mysql = require("mysql");

// Connection settings
var connection = mysql.createConnection({
	host: "localhost",
  	port: 3306,

  	// username
  	user: "root",

  	// password
  	password: "root",
  	database: "bamazon"
});

// FUNCTIONS =====================================================

// Displays Main Menu
// Options: View Products for Sale, View Low Inventory, Add to Inventory, Add New Inventory
function managerMenu(){
	inquirer.prompt([{
		type: "list",
		name: "mainSelection",
		message: "Please make a selection: ",
		choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
	}]).then(function(selection){

		// Call a particular function depending on user's selection
		switch(selection.mainSelection){
			case "View Products for Sale":
				viewProducts();
				break;
			case "View Low Inventory":
				viewLowInventory();
				break;
			case "Add to Inventory":
				addInventory();
				break;
			case "Add New Product":
				addProduct();
		}
	});
}

// Displays a list of ALL items included in the products table
function viewProducts(){

	// Query: Read information from the products list
	connection.query("SELECT * FROM products", function(viewAllErr, viewAllRes){
		if (viewAllErr) throw viewAllErr;

		for (var i = 0; i < viewAllRes.length; i++){
			console.log("Id: " + viewAllRes[i].item_id + " | Name: " + viewAllRes[i].product_name +
						" | Price: " + viewAllRes[i].price + " | Quantity: " + viewAllRes[i].stock_quantity);
			console.log("-------------------------------------------------------------------");
		}

		// Prompts user to return to Main Menu or end application
		restartMenu();
	});
}

// Displays a list of items with a quantity lower than 5 units
function viewLowInventory(){

	// Query: Read products with stock_quantity < 5
	connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(viewLowErr, viewLowRes){
		if (viewLowErr) throw viewLowErr;

		for (var j = 0; j < viewLowRes.length; j++){
			console.log("Id: " + viewLowRes[j].item_id + " | Name: " + viewLowRes[j].product_name +
						" | Price: " + viewLowRes[j].price + " | Quantity: " + viewLowRes[j].stock_quantity);
			console.log("-------------------------------------------------------------------");
		}

		// Prompts user to return to Main Menu or end application
		restartMenu();
	});
}

// Displays list of items and prompts user to select a product and the amount of 
// units they would like to add to the product's stock
function addInventory(){
	console.log("Take a look! Products are listed as ID#) ITEM | QUANTITY(#)");

	var ids = [];

	// Query: Read information from the products table
	connection.query("SELECT * FROM products", function(itemsErr, itemsRes){
		if (itemsErr) throw itemsErr;

		for (var k = 0; k < itemsRes.length; k++){
			var itemsDisplay = itemsRes[k].item_id + ") " + itemsRes[k].product_name + " | quantity: " + itemsRes[k].stock_quantity;
			ids.push(itemsRes[k].item_id);
			console.log(itemsDisplay);
		}

		// Prompt user to select an item by id and to enter the units they want
		// to add to the stock
		inquirer.prompt([{
			type: "input",
			message: "Enter the id of the product you want to stock: ",
			name: "itemEntered",
			validate: function(value){
				// If the entry is a product that is listed...
				if (ids.indexOf(parseInt(value)) > -1) {
					return true;
				}
				
				return false;
			}
		},{
			type: "input",
			message: "Enter the number of units you want to stock: ",
			name: "quantityEntered",
			validate: function(stock){
				// If the entry is a number and an integer...
				if (isNaN(stock) === false && Number.isInteger(Number(stock)) === true) {
					return true;
				}
				return false;
			}
		}]).then(function(selectionAnswers){
			var product = parseInt(selectionAnswers.itemEntered);
			var quantity = parseInt(selectionAnswers.quantityEntered);
			var chosenItem;

			// Match user's selection to product from the bamazon table
			for (var l = 0; l < itemsRes.length; l++) {
				if (product === itemsRes[l].item_id) {
					chosenItem = itemsRes[l];
				}
			}

			// New quantity reflecting stock added
			var updatedQuantity = quantity + chosenItem.stock_quantity;

			// Query: Updates the stock_quantity to reflect the stock changes
			connection.query("UPDATE products SET ? WHERE ?", [{
				stock_quantity: updatedQuantity
			},{
				item_id: chosenItem.item_id
			}], function(addStockErr, addStockRes){
				if (addStockErr) throw addStockErr;

				console.log(quantity + " unit(s) was added to " + chosenItem.product_name);

				// Asks user if they want to continue adding inventory or return
				// to Main Menu
				inquirer.prompt([{
					type: "confirm",
					name: "restartAddStock",
					message: "Would you like to continue adding inventory?"
				}]).then(function(restartStock){
					if (restartStock.restartAddStock === true) {
						addInventory();
					}
					else {
						restartMenu(); 
					}
				});
			});
		});
	});
}

// Prompts user to add a new product by entering name,department,price,and quantity
function addProduct(){
	inquirer.prompt([{
		type: "input",
		name: "newName",
		message: "Enter new product's name: "
	},{
		type: "input",
		name: "newDepartment",
		message: "Enter new product's deparment: "
	},{
		type: "input",
		name: "newPrice",
		message: "Enter new product's price: ",
		validate: function(price){
			// If the entry is a number...
			if (isNaN(price) === false){
				return true;
			}
			return false;
		}
	},{
		type: "input",
		name: "newQuantity",
		message: "Enter new product's quantity: ",
		validate: function(quantity){
			// If the entry is a number and a integer...
			if (isNaN(quantity) === false && Number.isInteger(Number(quantity)) === true){
				return true;
			}
			return false;
		}
	}]).then(function(newInventory){

		// Query: Create new row in the products table with the information entered
		connection.query("INSERT INTO products SET ?", {
			product_name: newInventory.newName,
			department_name: newInventory.newDepartment,
			price: newInventory.newPrice,
			stock_quantity: newInventory.newQuantity,
		}, function(newItemErr){
			if (newItemErr) throw err;

			console.log(newInventory.newName + " was added to the inventory");

			// Prompts user to enter a new product or return to Main Menu
			inquirer.prompt([{
				type: "confirm",
				name: "restartAddProduct",
				message: "Would you like to continue adding inventory?"
			}]).then(function(restartProduct){
				if (restartProduct.restartAddProduct === true) {
					addProduct();
				}
				else {
					restartMenu(); 
				}
			});
		});
	})
}

// MAIN PROCESSES =====================================================

// Establish connection
connection.connect(function(connectErr){
	if (connectErr) throw connectErr;

	console.log("~~~~~~~~~~~WELCOME TO BAMAZON~~~~~~~~~~~");

	// Display Main Menu
	managerMenu();
});

// Prompts user to return to Main Menu or end application
function restartMenu(){
	inquirer.prompt([{
		type: "confirm",
		name: "restartSelection",
		message: "Would you like to return to the main menu?"
	}]).then(function(restartAnswer){
		if (restartAnswer.restartSelection === true) {
			managerMenu();
		}
		else {
			console.log("Good bye!"); 
		}
	});
}
