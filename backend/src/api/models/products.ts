import { PoolClient } from "pg";
import pgClient from "../../db/database";
import { Products } from "../../types/types";
import { customErr } from "../../helpers/control";

class ProductModel {
  conct!: PoolClient;
  errMsg = "";
  async create(values: Products): Promise<Products> {
    try {
      this.conct = await pgClient.connect();
      const sql = `
      INSERT INTO products 
      (category, name, brand, color, price, image, description)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
      const result = await this.conct.query(sql, [
        values.category,
        values.name,
        values.brand,
        values.color,
        values.price,
        values.image,
        values.description,
      ]);
      const product = result.rows[0];
      this.conct.release();
      return product;
    } catch (err) {
      this.conct.release();
      throw new Error(`${err}`);
    }
  }

  async index(): Promise<Products[]> {
    try {
      this.conct = await pgClient.connect();
      const sql = "SELECT * FROM products";
      const result = await this.conct.query(sql);
      this.conct.release();
      return result.rows;
    } catch (err) {
      this.conct.release();
      throw new Error(`${err}`);
    }
  }

  async show({ _id }: Products): Promise<Products> {
    try {
      this.conct = await pgClient.connect();
      const sql = `SELECT * FROM products WHERE _id = ($1)`;
      const result = await this.conct.query(sql, [_id]);
      const product = result.rows[0];
      this.conct.release();
      return product;
    } catch (err) {
      this.conct.release();
      throw new Error(`${err}`);
    }
  }

  async update({ _id, price }: Products): Promise<Products> {
    try {
      this.conct = await pgClient.connect();
      const sql = `UPDATE Products SET price = ($2) WHERE _id = ($1) RETURNING price`;
      const result = await this.conct.query(sql, [_id, price]);
      const product = result.rows[0];
      this.conct.release();
      return product;
    } catch (err) {
      this.conct.release();
      throw new Error(`${err}`);
    }
  }

  async delete({ _id }: Products): Promise<Products> {
    try {
      this.conct = await pgClient.connect();
      const sql = `DELETE FROM products WHERE _id = ($1) RETURNING _id`;
      const result = await this.conct.query(sql, [_id]);
      const product = result.rows[0];
      this.conct.release();
      return product;
    } catch (err) {
      this.conct.release();
      if ((err as Error).message?.includes("foreign")) {
        this.errMsg = customErr(
          err as Error,
          "Product can not be deleted - remove this product from any related orders !.",
          "."
        );
      } else {
        this.errMsg = err as string;
      }
      throw new Error(`${this.errMsg}`);
    }
  }

  async deleteAll(): Promise<void> {
    try {
      this.conct = await pgClient.connect();
      await this.conct.query(`DELETE FROM products`);
      this.conct.release();
    } catch (err) {
      throw new Error(`${err}`);
    }
  }
}

export const Product = new ProductModel();
