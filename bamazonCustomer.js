var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});
connection.connect(function(err) {
  if (err) throw err;
  console.log(`connection with ID ${connection.threadId}`);
  //call the functions
  runSearch();
  Inventory();
});

function runSearch() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "Welcome to bamazon, what would you like to do",
      choices: ["Find product by ID", "Find product by name"]
    })

.then(function(answer) {
  switch (answer.action) {
    case "Find product by ID":
    ProductIDSearch();
    break;

    case "Find product by name":
    productSearch();
    break;
  }
});
}
//Finds the item by the Item ID / product ID
function ProductIDSearch() {
  //ask for the product id the user wants to search for
  inquirer
    .prompt([
      {
        name: "productID",
        type: "input",
        message: "Enter the Product ID",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
        
      },
      {
        name: "quantity",
        type: "input",
        message: "Enter quantity: ",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer){
      var query = "SELECT item_id, product_name, price FROM products WHERE item_id = ?";

      //Display the Product ID, Product name, Price, and the quantity the user wants to buy
        connection.query(query, [answer.productID, answer.quantity], function(err, res){
        for (var i = 0; i < res.length; i++) {
          console.log("Product ID: " + res[i].item_id + " || Product Name: " + res[i].product_name + " || price: $" + res[i].price + " || Quantity "+ answer.quantity);
        }
        runSearch();
      });})}

      

//find product my product name, not a good search since name has to match exactly
function productSearch(){
  inquirer
  .prompt({
  name: "product",
  type:"input",
  message: "Enter product name?"

})
.then(function(answer){
  var query = "SELECT item_id, product_name, price, stock_quantity FROM products WHERE ?";

  connection.query(query, {product_name: answer.product}, function(err, res){

    for (var i = 0; i < res.length; i++) {
      console.log("Item ID: " + res[i].item_id + " || Product Name: " + res[i].product_name + " || price: $" + res[i].price + " || stock_quantity "+ res[i].stock_quantity);
    }
    runSearch();
  });})}



  // displayInventory will retrieve the current inventory 
  //from the database and output it to the console
function Inventory() {
	// console.log('___ENTER displayInventory___');

	// Construct the db query string
	query = 'SELECT * FROM products';

	// Make the db query
	connection.query(query, function(err, res) {
		if (err) throw err;

		console.log('Existing Inventory: ');
		console.log('...................\n');

		var stringOutput = '';
		for (var i = 0; i < res.length; i++) {
			stringOutput = '';
			stringOutput += 'Item ID: ' + res[i].item_id + '  //  ';
			stringOutput += 'Product Name: ' + res[i].product_name + '  //  ';
			stringOutput += 'Department: ' + res[i].department_name + '  //  ';
      stringOutput += 'Price: $' + res[i].price + '\n';
      stringOutput += 'Available Quantity: ' + res[i].stock_quantity + '\n';


			console.log(stringOutput);
		}

	  	console.log("---------------------------------------------------------------------\n");

	  	//Prompt the user for item/quantity they would like to purchase
	  	ProductIDSearch();
	})
}