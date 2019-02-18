-- Drops the bamazon database if it already exists --
DROP DATABASE IF EXISTS bamazon;
-- Create a database called bamazon --
CREATE DATABASE bamazon;

-- Use bamazon database for the following statements --
USE bamazon;

CREATE TABLE products (
    -- Create a numeric column called "id" which will automatically increment its default value as we create new rows. --
    item_id INTEGER AUTO_INCREMENT,
    -- Create a required string column called "product_name" --
    product_name VARCHAR(100) NOT NULL,
    -- Create a required string column called "department_name" --
    department_name VARCHAR(50) default "Miscellaneous" NOT NULL,
    -- Create a required numeric column called "price" --
    price FLOAT(9,2) NOT NULL,
    -- Create a numeric column called "stock_quantity" --
    stock_quantity INTEGER(10) default 0,
    -- Set the item_id as this table's primary key --
    PRIMARY KEY (item_id)
);