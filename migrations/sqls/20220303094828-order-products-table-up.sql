CREATE TABLE IF NOT EXISTS order_products (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) NOT NULL ,
    product_id UUID REFERENCES products(p_uid) NOT NULL,
    quantity INTEGER NOT NULL
);