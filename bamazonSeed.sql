DROP DATABASE IF EXISTS Bamazon;

CREATE DATABASE Bamazon;

USE Bamazon;

CREATE TABLE products (
item_id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(255) NULL,
price DECIMAL(10,2) NULL,
department_name VARCHAR(255) NULL,
stock_quantity INT NOT NULL,
 PRIMARY KEY (item_id)
);

INSERT INTO products (product_name,department_name ,price, stock_quantity)
VALUES ("Socks", "Clothes", 5.50, 200);

INSERT INTO products (product_name,department_name ,price, stock_quantity)
VALUES ("Chapstick", "Health",1.10, 800);

INSERT INTO products (product_name,department_name ,price, stock_quantity)
VALUES ("Headphones", "Electronics", 85.50, 300);

INSERT INTO products (product_name,department_name ,price, stock_quantity)
VALUES ("Toothbrush", "Health", 2, 500);

UPDATE products
SET product_name = 'Baby Bed'
WHERE item_id = 4;

--Update the price of Item ID 5
UPDATE products
SET price = 8.99
WHERE item_id = 5;
---Delete the rows of the tiem ID 19 & 20
DELETE FROM products
WHERE item_id IN (19, 20)





--The WHERE clause specifies which record(s) should be deleted. 
--If you omit the WHERE clause, all records in the table will be deleted!