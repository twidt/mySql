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

// Total cost of items purchased by user
var totalCost = 0;

// FUNCTIONS =====================================================

// Displays list of products and then prompts user to select product's id 
// and the quantity they want to purchase
function customerMenu(){
	console.log("Take a look! Products are listed as ID#) ITEM | PRICE($)");

	// Query: Reads list of products
	connection.query("SELECT * FROM products", function(menuErr, menuRes){
		if (menuErr) throw menuErr;

		var ids = [];

		for (var i = 0; i < menuRes.length; i++){
			var itemDisplay = menuRes[i].item_id + ") " + menuRes[i].product_name + " | price: " + menuRes[i].price;
			ids.push(menuRes[i].item_id);
			console.log(itemDisplay);
			console.log("----------------------------------------------");
		}

		// Prompts user to enter id and quantity
		inquirer.prompt([{
			type: "input",
			message: "Select a product by entering its id: ",
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
			message: "Enter the number of units you want to purchase: ",
			name: "quantityEntered",
			validate: function(quantity){
				// If the entry is a number and an integer
				if (isNaN(quantity) === false && Number.isInteger(Number(quantity)) === true) {
					return true;
				}
				return false;
			}
		}]).then(function(selectionAnswers){
	
			var product = parseInt(selectionAnswers.itemEntered);
			var quantity = parseInt(selectionAnswers.quantityEntered);
			var chosenItem;

			// Match user's entry to item in products table
			for (var j = 0; j < menuRes.length; j++) {
				if (product === menuRes[j].item_id) {
					chosenItem = menuRes[j];
				}
			}

			// If there aren't sufficient items in stock...
			if (quantity > chosenItem.stock_quantity) {
				console.log("Insufficient Quantity");
			}
			else {
				var new_stock_quantity = chosenItem.stock_quantity - quantity;
				totalCost += (quantity * chosenItem.price);

				// Query: update stock quantity after items purchased
				connection.query("UPDATE products SET ? WHERE ?", [{
					stock_quantity: new_stock_quantity
				},{
					item_id: chosenItem.item_id
				}], function(updateErr, updateRes){
					if (updateErr) throw updateErr;

					// Prompts user to continue shopping or end application
					restartMenu();
				});
			}
		});
	});
}

// MAIN PROCESSES =====================================================

// Establish connection
connection.connect(function(connectErr){
	if (connectErr) throw connectErr;

	console.log("~~~~~~~~~~~WELCOME TO BAMAZON~~~~~~~~~~~");

	// Display Main Menu
	customerMenu();
});

// Returns to Main Menu or ends application by displaying total cost of session
function restartMenu(){
	inquirer.prompt([{
		type: "confirm",
		name: "restartSelection",
		message: "Would you like to continue shopping?"
	}]).then(function(restartAnswer){
		if (restartAnswer.restartSelection === true) {
			customerMenu();
		}
		else {
			console.log("Thank you for shopping!\nYour total is $" + totalCost); 
		}
	});
}