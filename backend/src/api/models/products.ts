import { PoolClient } from "pg";
import pgDB from "../../database";
import { Error, customErr, DbSchema } from "../../utils/control";

let conct: PoolClient;
let errMsg: string | undefined;
class ProductModel {
  async create(values: DbSchema): Promise<DbSchema | null> {
    try {
      conct = await pgDB.connect();
      const sql = `INSERT INTO products (category, p_name, brand, price, image_url, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
      const result = await conct.query(sql, [
        values.category,
        values.p_name,
        values.brand,
        values.price,
        values.imageUrl,
        values.description,
      ]);
      if (result.rows.length) {
        const product = result.rows[0];
        conct.release();
        return {
          message: `Product created successfully`,
          data: product,
        };
      }
      conct.release();
      return null;
    } catch (err) {
      conct.release();
      if ((err as Error).message?.includes("enum category")) {
        errMsg = customErr(
          err as Error,
          "Please enter category between (electronics) and (mobiles) !.",
          "."
        );
      } else if ((err as Error).message?.includes("not exist")) {
        errMsg = customErr(err as Error, "TABLE (products) does not exist !.", ".");
      } else {
        errMsg = err as string;
      }
      throw new Error(`Unable to create new Product - ${errMsg}`);
    }
  }

  // Get Products
  async index(): Promise<DbSchema[]> {
    try {
      conct = await pgDB.connect();
      const sql = "SELECT * FROM products";
      const result = await conct.query(sql);
      conct.release();
      return result.rows;
    } catch (err) {
      conct.release();
      if ((err as Error).message?.includes("not exist")) {
        errMsg = customErr(err as Error, "TABLE (products) does not exist !.", ".");
      } else {
        errMsg = err as string;
      }
      throw new Error(`Unable to get data - ${errMsg}`);
    }
  }

  // Get one Product
  async show(id: string): Promise<DbSchema | null> {
    try {
      conct = await pgDB.connect();
      const sql = `SELECT * FROM products WHERE p_id = ($1)`;
      const result = await conct.query(sql, [id]);
      if (result.rows.length) {
        const product = result.rows[0];
        conct.release();
        return {
          message: `Product generated successfully`,
          data: product,
        };
      }
      conct.release();
      return null;
    } catch (err) {
      conct.release();
      if ((err as Error).message?.includes("uuid")) {
        errMsg = customErr(err as Error, "Please enter a valid product id !.", ".");
      } else if ((err as Error).message?.includes("not exist")) {
        errMsg = customErr(err as Error, "TABLE (products) does not exist !.", ".");
      } else {
        errMsg = err as string;
      }
      throw new Error(`Unable to get Product with id (${id}) - ${errMsg}`);
    }
  }

  // Update Product
  async update(id: string, price: number): Promise<DbSchema | null> {
    try {
      conct = await pgDB.connect();
      const sql = `UPDATE Products SET price = ($2) WHERE p_id = ($1) RETURNING *`;
      const result = await conct.query(sql, [id, price]);
      if (result.rows.length) {
        const product = result.rows[0];
        conct.release();
        return {
          message: `Product updated successfully`,
          data: product,
        };
      }
      conct.release();
      return null;
    } catch (err) {
      conct.release();
      if ((err as Error).message?.includes("uuid")) {
        errMsg = customErr(err as Error, "Please enter a valid product id !.", ".");
      } else if ((err as Error).message?.includes("not exist")) {
        errMsg = customErr(err as Error, "TABLE (products) does not exist !.", ".");
      } else {
        errMsg = err as string;
      }
      throw new Error(`Unable to update Product with id (${id}) - ${errMsg}`);
    }
  }

  // Delete Product
  async delete(id: string): Promise<DbSchema | null> {
    try {
      conct = await pgDB.connect();
      const sql = `DELETE FROM products WHERE p_id = ($1) RETURNING *`;
      const result = await conct.query(sql, [id]);
      if (result.rows.length) {
        const product = result.rows[0];
        conct.release();
        return {
          message: `Product deleted successfully`,
          data: product,
        };
      }
      conct.release();
      return null;
    } catch (err) {
      conct.release();
      if ((err as Error).message?.includes("uuid")) {
        errMsg = customErr(err as Error, "Please enter a valid product id !.", ".");
      } else if ((err as Error).message?.includes("foreign")) {
        errMsg = customErr(
          err as Error,
          "Product can not be deleted - remove this product from any related orders !.",
          "."
        );
      } else if ((err as Error).message?.includes("not exist")) {
        errMsg = customErr(err as Error, "TABLE (products) does not exist !.", ".");
      } else {
        errMsg = err as string;
      }
      throw new Error(`Unable to delete Product with id (${id}) - ${errMsg}`);
    }
  }
}

export const productModel = new ProductModel();
