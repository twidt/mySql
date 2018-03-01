-- Drop bamazon database if it exists
DROP DATABASE IF EXISTS bamazon;

-- Create database bamazon
CREATE DATABASE bamazon;

USE bamazon;

-- Create products table
CREATE TABLE products(
	item_id INTEGER(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER(10) NOT NULL
);

-- Add items to products table
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Headphones", "Electronics", 15, 45);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Shirt", "Clothing", 9.99, 33);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Ibuprofen", "Pharmacy", 6.99, 78);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Bananas(lb)", "Food", .89, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Microwave", "Appliances", 50, 6);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Watch", "Jewelry", 21, 9);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Tent", "Outdoors", 75, 4);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Milk", "Food", 2.99, 26);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Construction Paper", "Crafts", 7.31, 15);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Eyeliner", "Health and Beauty", 7.99, 62);

-- Display products table
SELECT * FROM products;