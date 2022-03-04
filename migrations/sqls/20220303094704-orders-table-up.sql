DROP TYPE IF EXISTS status;
CREATE TYPE status AS ENUM ('active','complete');
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_status status NOT NULL,
    user_id uuid REFERENCES users(u_uid)  NOT NULL
);