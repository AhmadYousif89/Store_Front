type Users = {
  _id?: string;
  name?: string;
  email?: string;
  password?: string;
  token?: string;
  isadmin?: boolean;
};
type Products = {
  _id?: string;
  category?: string;
  name?: string;
  brand?: string;
  color?: string;
  price?: number;
  image?: string | object;
  description?: string;
};
type Orders = {
  _id?: string;
  order_status?: string;
  user_id?: string;
  stripe_customerId?: string;
  created_at?: string;
  updated_at?: string | null;
};
type OrderDetail = {
  _id?: string;
  customerId?: string;
  order_info?: object;
  created_at?: string;
  updated_at?: string | null;
};
type Error = {
  name?: string;
  message?: string;
  stack?: string;
  status?: number;
};

export { Users, Orders, Products, OrderDetail, Error };
