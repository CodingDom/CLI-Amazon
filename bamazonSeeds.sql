Use bamazon;

-- Create mock products to populate table
INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Samsung 52-inch Television","Electronics",300,12);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Logictech Wireless Mouse","Electronics",13,30);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Echo (2nd Generation) - Smart speaker with Alexa","Electronics",85,60);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Anker Powerline II Lightning Cable","Cell Phones & Accessories",12,500);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("iPhone 6 Otter Box Case","Cell Phones & Accessories",15,300);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Samsung Galaxy J7 Perx","Cell Phones & Accessories",200,75);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Alex and Ani Womens Charity by Design Heart of Strength Bangle","Jewlry",30,100);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Pandora Cassic Elegane Earrings","Jewlry",85,60);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Trumbone","Musical Instruments",700,5);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Drum Set","Musical Instruments",550,2);

SELECT * FROM products;