import pgDB from "../../database";
import { Error, customErr, DbSchema } from "../../utils/control";

let errMsg: string | undefined;
// Building CRUD System for Product.
class ProductModel {
  // Create Product
  async create(values: DbSchema): Promise<DbSchema | null> {
    try {
      // openning connection with db.
      const conct = await pgDB.connect();
      // making query.
      const sql = `INSERT INTO products (category, p_name, brand, maker, price, popular) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
      // retrieving query result.
      const result = await conct.query(sql, [
        values.category,
        values.p_name,
        values.brand,
        values.maker,
        values.price,
        values.popular,
      ]);
      // check if row has been created.
      if (result.rows.length) {
        const product = result.rows[0];
        console.log(result.command, result.rows);
        // colsing connection with db.
        conct.release();
        return {
          message: `Product created successfully`,
          data: product,
        };
      }
      // colsing connection with db.
      conct.release();
      return null;
    } catch (err) {
      // handling error.
      // making my custom error syntax.
      if ((err as Error).message?.includes("enum category")) {
        errMsg = customErr(
          err as Error,
          "Please enter category between (electronics) and (mobiles) !.",
          "."
        );
      } else if ((err as Error).message?.includes("enum popular")) {
        errMsg = customErr(err as Error, "Please choose popularity between (yes) or (no) !.", ".");
      } else {
        errMsg = customErr(err as Error, "TABLE (products) does not exist !.", ".");
      }
      throw new Error(`Unable to create new Product - ${errMsg}`);
    }
  }
  // Get Products
  async index(): Promise<DbSchema[]> {
    try {
      const conct = await pgDB.connect();
      const sql = "SELECT * FROM products";
      const result = await conct.query(sql);
      conct.release();
      console.log(result.command, result.rowCount, result.rows, "\n");
      return result.rows;
    } catch (err) {
      errMsg = customErr(err as Error, "TABLE (products) does not exist !.", ".");
      throw new Error(`Unable to get data - ${errMsg}`);
    }
  }
  // Get one Product
  async show(id: string): Promise<DbSchema | null> {
    try {
      const conct = await pgDB.connect();
      const sql = `SELECT * FROM products WHERE p_id = ($1)`;
      const result = await conct.query(sql, [id]);
      if (result.rows.length) {
        const product = result.rows[0];
        console.log(result.command, result.rowCount, product);
        conct.release();
        return {
          message: `Product generated successfully`,
          data: product,
        };
      }
      conct.release();
      return null;
    } catch (err) {
      if ((err as Error).message?.includes("uuid")) {
        errMsg = customErr(err as Error, "Please enter a valid product id !.", ".");
      } else {
        errMsg = customErr(err as Error, "TABLE (products) does not exist !.", ".");
      }
      throw new Error(`Unable to get Product with id (${id}) - ${errMsg}`);
    }
  }
  // Update Product
  async update(id: string, price: number, popular: string): Promise<DbSchema | null> {
    try {
      const conct = await pgDB.connect();
      const sql = `UPDATE Products SET price = ($2), popular = ($3) WHERE p_id = ($1) RETURNING *`;
      const result = await conct.query(sql, [id, price, popular]);
      if (result.rows.length) {
        const product = result.rows[0];
        console.log(result.command, result.rowCount, product);
        conct.release();
        return {
          message: `Product updated successfully`,
          data: product,
        };
      }
      conct.release();
      return null;
    } catch (err) {
      if ((err as Error).message?.includes("uuid")) {
        errMsg = customErr(err as Error, "Please enter a valid product id !.", ".");
      } else if ((err as Error).message?.includes("enum")) {
        errMsg = customErr(
          err as Error,
          "Please enter a value between [ yes | no ] for popular !.",
          "."
        );
      } else {
        errMsg = customErr(err as Error, "TABLE (products) does not exist !.", ".");
      }
      throw new Error(`Unable to update Product with id (${id}) - ${errMsg}`);
    }
  }
  // Delete Product
  async delete(id: string): Promise<DbSchema | null> {
    try {
      const conct = await pgDB.connect();
      const sql = `DELETE FROM products WHERE p_id = ($1) RETURNING *`;
      const result = await conct.query(sql, [id]);
      if (result.rows.length) {
        const product = result.rows[0];
        console.log(result.command, result.rowCount, product);
        conct.release();
        return {
          message: `Product deleted successfully`,
          data: product,
        };
      }
      conct.release();
      return null;
    } catch (err) {
      if ((err as Error).message?.includes("uuid")) {
        errMsg = customErr(err as Error, "Please enter a valid product id !.", ".");
      } else if ((err as Error).message?.includes("foreign")) {
        errMsg = customErr(
          err as Error,
          "Product can not be deleted - remove this product from any related orders !.",
          "."
        );
      } else {
        errMsg = customErr(err as Error, "TABLE (products) does not exist !.", ".");
      }
      throw new Error(`Unable to delete Product with id (${id}) - ${errMsg}`);
    }
  }
}

export const productModel = new ProductModel();
