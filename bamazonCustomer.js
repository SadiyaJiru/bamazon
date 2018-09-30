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
  database: "Bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log(`connection with ID ${connection.threadId}`);
  //call the functions
  runSearch();
  inventory();
});
  // displayInventory will retrieve the current inventory 
  //from the database and output it to the console
  function inventory() {
    // Construct the db query string
    query = 'SELECT * FROM products';
  
    // Make the db query
    connection.query(query, function(err, res) {
      if (err) throw err;
  
      console.log('............Existing Inventory................\n');
  
      var stringOutput = '';
      for (var i = 0; i < res.length; i++) {
        stringOutput = '';
        stringOutput += 'Item ID: ' + res[i].item_id + ' || ';
        stringOutput += 'Product Name: ' + res[i].product_name + ' || ';
        stringOutput += 'Department: ' + res[i].department_name + ' || ';
        stringOutput += 'Price: $' + res[i].price + '\n';
        stringOutput += 'Quantity In Stock: ' + res[i].stock_quantity + '\n';
        console.log(stringOutput);
      } console.log("---------------------------------------------------------------------\n");
    })
   

  }
function runSearch() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "Welcome to bamazon, what would you like to do",
      choices: ["Find product by ID", "Find product by name \n"] 
    })
.then(function(answer) {
  switch (answer.action) {
    case "Find product by ID":
    searchByID();
    break;
    case "Find product by name":
    productSearch();
    break;
  }
});}
//Finds the item by the Item ID / product ID
function searchByID() {
  var customerTotal;

  //ask for the product id the user wants to search for
  inquirer
    .prompt([
      {
        name: "itemID",
        type: "input",
        message: "Enter the Product ID",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          } return false;
        }
      },{
        name: "quantity",
        type: "input",
        message: "Enter quantity: ",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }  return false;
        }
      }
    ])
    .then(function(answer){
      connection.query('SELECT * FROM products WHERE item_id = ?', [answer.itemID], function(err, res){

        for (var i = 0; i < res.length; i++) {
          console.log('\nYour Cart [$]');
          console.log("Item ID: " + res[i].item_id + " || Product Name: " + res[i].product_name + " || price: $" + res[i].price + " || Order Quantity "+ answer.quantity);
        }

        if(answer.quantity > res[0].stock_quantity){
        console.log('\n Sorry Item Is Out Of Stock');
        checkout();
      }else{
        customerTotal = res[0].price * answer.quantity;
        currentDepartment = res[0].department_name;
        console.log('\nThanks for your order');
        console.log('You owe $' + customerTotal);
        console.log('');
        //update products table
        connection.query('UPDATE products SET ? Where ?', [{
          stock_quantity: res[0].stock_quantity - answer.quantity
        },{
          item_id: answer.itemID
        }], function(err, res){});
        //update departments table
        // logSaleToDepartment();
        checkout();
      }
    })})}
    function checkout(){
      inquirer.prompt([{
        type: 'confirm',
        name: 'choice',
        message: 'Would you like to place another order?'
      }]).then(function(answer){
        if(answer.choice){
          searchByID();
        }
        else{
          console.log('Thank you for shopping at Bamazon!');
          connection.end();
        }
      })
    };
    