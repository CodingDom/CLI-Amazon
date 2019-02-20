Use bamazon;

-- Create mock products to populate table
INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Samsung 52-inch Television","Electronics",300,20);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Logictech Wireless Mouse","Electronics",13,30);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Echo (2nd Generation) - Smart speaker with Alexa","Electronics",85,75);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Anker Powerline II Lightning Cable","Cell Phones & Accessories",12,500);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("iPhone 6 Otter Box Case","Cell Phones & Accessories",15,300);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Samsung Galaxy J7 Perx","Cell Phones & Accessories",200,75);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Alex and Ani Womens Charity by Design Heart of Strength Bangle","Jewelry",30,100);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Pandora Cassic Elegane Earrings","Jewelry",85,60);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Trumbone","Musical Instruments",700,5);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Drum Set","Musical Instruments",550,2);

SELECT * FROM products;

-- Create mock departments to populate database
INSERT INTO departments (department_name,over_head_costs)
VALUES ("Cell Phones & Accessories",10000);

INSERT INTO departments (department_name,over_head_costs)
VALUES ("Electronics",8000);

INSERT INTO departments (department_name,over_head_costs)
VALUES ("Furniture",10000);

INSERT INTO departments (department_name,over_head_costs)
VALUES ("Jewelry",3000);

INSERT INTO departments (department_name,over_head_costs)
VALUES ("Musical Instruments",1500);

INSERT INTO departments (department_name,over_head_costs)
VALUES ("Miscellaneous",5000);

INSERT INTO departments (department_name,over_head_costs)
VALUES ("Toys",2000);

SELECT *,(product_sales-over_head_costs) AS total_profits FROM departments;
