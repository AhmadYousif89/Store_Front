import { Request, Response, NextFunction } from "express";
import { orderModel } from "../models/orders";
import { Error } from "../../utils/control";

let error;
// method => POST /user/account/orders
// desc   => Create new Order data.
const createOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  const userId = req.body.user_id;
  const status = req.body.status.toLowerCase();
  console.log(
    `params:
      ${userId} 
      ${status}`
  );
  // validating values before submitting.
  if (!userId || !status) {
    res
      .status(400)
      .json({ status: "Error", message: "Please provide correct details before submiting !" });
    return;
  }
  try {
    const data = await orderModel.create({
      order_status: status,
      u_id: userId,
    });
    res.status(201).json(data);
  } catch (err) {
    error = {
      message: `Request Failed ! ${(err as Error).message}`,
    };
    next(error);
  }
};

// method => GET /user/account/orders
// desc   => Return all Orders data.
const getOrders = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await orderModel.index();
    if (data.length === 0) {
      res.status(404).json({ message: `No Orders Were Found !` });
      return;
    }
    res.status(200).json({ message: "Data generated successfully", data });
  } catch (err) {
    error = {
      message: `Request Failed ! ${(err as Error).message}`,
    };
    next(error);
  }
};

// method => GET /user/account/orders/:id
// desc   => Return a specific Order.
const getOrderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const oid = parseInt(req.params.id);
  console.log("data: \n", oid);
  if (!oid || oid <= 0) {
    res.status(400).json({ status: "Error", message: "Please enter a valid order id !" });
    return;
  }
  try {
    const data = await orderModel.show(oid);
    if (!data) {
      res
        .status(404)
        .json({ message: "Request failed !", data: `Order with id (${oid}) doesn't Exist !` });
      return;
    }
    res.status(200).json(data);
  } catch (err) {
    error = {
      message: `Request Failed ! ${(err as Error).message}`,
    };
    next(error);
  }
};

// method => PUT /user/account/orders
// desc   => Update a specific Order .
const updateOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const id = parseInt(req.body.order_id);
  const status = req.body.status.toLowerCase();
  console.log(
    `data: 
      ${id} 
      ${status}`
  );
  if (!id || id <= 0 || !status) {
    res
      .status(400)
      .json({ status: "Error", message: "Please provide a valid order status and id !" });
    return;
  }
  try {
    const data = await orderModel.update(id, status);
    // safety net
    if (!data) {
      res.status(404).json({
        message: "Update failed !",
        data: `Order with id (${id}) doesn't exist`,
      });
      return;
    }
    res.status(200).json(data);
  } catch (err) {
    error = {
      message: `Request Failed ! ${(err as Error).message}`,
    };
    next(error);
  }
};

// method => DELETE /user/account/order/:id
// desc   => Delete a specific Order.
const deleteOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const id = parseInt(req.params.id);
  console.log("data: \n", id);
  if (!id || id <= 0) {
    res.status(400).json({ status: "Error", message: "Please enter a valid order id !" });
    return;
  }
  try {
    const data = await orderModel.delete(id);
    if (!data) {
      res.status(404).json({
        message: "Delete failed !",
        data: `Order with id (${id}) doesn't exist`,
      });
      return;
    }
    res.status(200).json(data);
  } catch (err) {
    error = {
      message: `Request Failed ! ${(err as Error).message}`,
    };
    next(error);
  }
};

export { createOrders, getOrders, getOrderById, updateOrder, deleteOrder };
