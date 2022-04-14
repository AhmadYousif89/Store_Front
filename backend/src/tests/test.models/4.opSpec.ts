import { schema } from "../test.server.routes/serverSpec";
import { productModel } from "../../api/models/products";
import { OPT } from "../../api/models/ordered_products";
import { orderModel } from "../../api/models/orders";
import { userModel } from "../../api/models/users";
import pgDB from "../../database";

let pId: string | undefined;
let userId: string | undefined;

describe("OrderedProducts Model functions: \n", () => {
  it("should be a method to get all data", () => {
    expect(OPT.index).toBeDefined();
  });

  it("should be a method to get one row by id", () => {
    expect(OPT.show).toBeDefined();
  });

  it("should be a method to add products to existing orders", () => {
    expect(OPT.addProducts).toBeDefined();
  });

  it("should be method an update for product quantity", () => {
    expect(OPT.update).toBeDefined();
  });

  it("should be a method to delete a row by id", () => {
    expect(OPT.delete).toBeDefined();
  });

  describe("Testing op SQL functions: \n ", () => {
    it("should create user and a product and extract their ids", async () => {
      await userModel.create(schema);
      const user = await userModel.index();
      userId = user[0].user_id;

      await productModel.create(schema);
      const product = await productModel.index();
      pId = product[0].p_id;
      console.log("product added to order");
    });

    it(`should create new order`, async () => {
      const order = await orderModel.create({
        user_id: userId,
        order_status: schema.order_status,
      });
      expect(order?.message).toEqual("Order created successfully");
    });

    it(`should add product to order`, async () => {
      const op = await OPT.addProducts({
        product_id: pId,
        order_id: schema.order_id,
        quantity: schema.quantity,
      });
      expect(op?.message).toEqual(
        `Product has been added successfully to order number (${schema.order_id})`
      );
    });

    it(`should get all ordered products`, async () => {
      const op = await OPT.index();
      expect(op[0].op_id).toEqual(schema.op_id);
      expect(op[0].order_id).toEqual(schema.order_id);
      expect(op[0].product_id).toEqual(pId);
      expect(op[0].quantity).toEqual(schema.quantity);
      console.log("all ordered product");
    });

    it(`should get one ordered product by id`, async () => {
      const op = await OPT.show({ op_id: schema.op_id });
      expect(op?.message).toEqual("Data generated successfully");
      console.log("one ordered product");
    });

    it(`should update the quantity of one ordered products by id`, async () => {
      const op = await OPT.update({ product_id: pId, quantity: 50 });
      expect(op?.message).toEqual("Product quantity updated successfully");
      console.log("update ordered product");
    });

    it(`should delete one ordered products by id`, async () => {
      const op = await OPT.delete({ op_id: schema.op_id });
      expect(op?.message).toEqual(`Row number ${schema.op_id} was deleted successfully`);
      console.log("delete ordered product");
    });

    afterAll(async () => {
      const conct = await pgDB.connect();
      await conct.query("DELETE FROM ordered_products");
      await conct.query("DELETE FROM orders");
      await conct.query("DELETE FROM products");
      await conct.query("DELETE FROM users");
      await conct.query("ALTER SEQUENCE orders_order_id_seq RESTART WITH 1");
      await conct.query("ALTER SEQUENCE ordered_products_op_id_seq RESTART WITH 1");
      console.log("Sequence altered successfully");
      conct.release();
    });
  });
});
