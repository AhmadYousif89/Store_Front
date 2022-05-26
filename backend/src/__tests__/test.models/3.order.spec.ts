import { userModel } from "../../api/models/users";
import { orderModel } from "../../api/models/orders";
import { schema } from "../test.server.routes/server.spec";
import pgDB from "../../db/database";

let userId = "";
let time = "";
const date = new Date().toISOString();

describe("Order Model functions: \n", () => {
  it("should be a method to get all orders", () => {
    expect(orderModel.index).toBeDefined();
  });

  it("should be a method to get an order by id", () => {
    expect(orderModel.show).toBeDefined();
  });

  it("should be a method to create orders", () => {
    expect(orderModel.create).toBeDefined();
  });

  it("should be method an update orders", () => {
    expect(orderModel.update).toBeDefined();
  });

  it("should be a method to delete orders", () => {
    expect(orderModel.delete).toBeDefined();
  });
  describe("Testing SQL functions: \n ", () => {
    it("should create a user and extract its id", async () => {
      await userModel.create(schema);
      const user = await userModel.index();
      userId = user[0].user_id as string;
      console.log("order has been created");
    });

    it(`should create new order`, async () => {
      await orderModel.create({
        order_status: schema.order_status,
        user_id: userId,
      });
    });

    it(`should get all orders`, async () => {
      const order = await orderModel.index();
      time = order[0].created_at as string;
      expect(order).toEqual([
        {
          order_id: schema.order_id,
          order_status: schema.order_status,
          user_id: userId,
          created_at: time,
          updated_at: null,
        },
      ]);
      console.log("all order");
    });

    it(`should get one order by id`, async () => {
      const order = await orderModel.show({ order_id: schema.order_id });
      expect(order).toEqual({
        order_id: schema.order_id,
        order_status: schema.order_status,
        user_id: userId,
        created_at: time,
        updated_at: null,
      });
      console.log("one order");
    });

    it(`should update the status of one order by id`, async () => {
      const order = await orderModel.update({
        order_id: schema.order_id,
        order_status: "active",
        updated_at: date,
      });
      expect(order).toEqual({
        order_id: schema.order_id,
        order_status: "active",
        user_id: userId,
        created_at: time,
        updated_at: date,
      });
      console.log("update order");
    });

    it(`should delete one order by id`, async () => {
      const order = await orderModel.delete({ order_id: schema.order_id });
      expect(order).toEqual({
        order_id: schema.order_id,
        order_status: "active",
        user_id: userId,
        created_at: time,
        updated_at: date,
      });
      console.log("delete order");
    });

    afterAll(async () => {
      const conct = await pgDB.connect();
      await conct.query("DELETE FROM users");
      await conct.query("ALTER SEQUENCE orders_order_id_seq RESTART WITH 1");
      console.log("Sequence altered successfully");
      conct.release();
    });
  });
});
