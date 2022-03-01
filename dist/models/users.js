"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userStore = void 0;
const database_1 = __importDefault(require("../database"));
const control_1 = require("./../utils/control");
// Building CRUD System for Users
class UsersStore {
    // Create user
    async createUser(values) {
        try {
            // openning connection with db.
            const conct = await database_1.default.connect();
            // making query.
            const sql = `INSERT INTO users (u_name, u_password) VALUES ($1, $2) RETURNING u_uid , u_name`;
            // encrypting password.
            const hash = (0, control_1.encrypt)(values.u_password);
            // retrieving query result.
            const result = await conct.query(sql, [values.u_name, hash]);
            // check if row has been created.
            if (result.rows.length) {
                const user = result.rows[0];
                console.log(result.command, result.rows);
                conct.release();
                return {
                    msg: `User created successfuly`,
                    data: user,
                };
            }
            // colsing connection with db.
            conct.release();
            return {
                msg: "Request failed !",
            };
        }
        catch (err) {
            // handling error.
            throw new Error(`Unable to create new User (${values.u_name}) \n ${err.message}`);
        }
    }
    // Get users without their password. (as it consider sensitive information)
    async getAllUsers() {
        try {
            const conct = await database_1.default.connect();
            const sql = `SELECT u_uid , u_name FROM users `;
            const result = await conct.query(sql);
            conct.release();
            console.log(result.command, result.rowCount, result.rows, "\n");
            return result.rows;
        }
        catch (err) {
            throw new Error(`can't get data from table users \n ${err.message}`);
        }
    }
    // Get one user
    async getUserById(u_uid) {
        try {
            const conct = await database_1.default.connect();
            const sql = `SELECT u_uid , u_name FROM users WHERE u_uid = ($1) `;
            const result = await conct.query(sql, [u_uid]);
            if (result.rows.length) {
                const user = result.rows[0];
                console.log(result.command, result.rowCount, user);
                conct.release();
                return {
                    msg: `User generated successfully`,
                    data: user,
                };
            }
            conct.release();
            return {
                msg: "Request failed !",
                data: `User with id (${u_uid}) doesn't exist`,
            };
        }
        catch (err) {
            throw new Error(`can't get user with id ${u_uid} from table users \n ${err.message}`);
        }
    }
    // Update user
    async updateUser(u_uid, u_password) {
        try {
            const conct = await database_1.default.connect();
            const sql = `UPDATE users SET u_password = ($2) WHERE u_uid = ($1) RETURNING u_uid , u_name`;
            const hash = (0, control_1.encrypt)(u_password);
            const result = await conct.query(sql, [u_uid, hash]);
            if (result.rows.length) {
                const user = result.rows[0];
                console.log(result.command, result.rowCount, user);
                conct.release();
                return {
                    msg: `User updated successfuly`,
                    data: user,
                };
            }
            conct.release();
            return {
                msg: "Update failed !",
                data: `User with id (${u_uid}) doesn't exist`,
            };
        }
        catch (err) {
            throw new Error(`Can't update user with id (${u_uid}) from table Users \n\n ${err.message}`);
        }
    }
    // Delete user
    async delUser(u_uid) {
        try {
            const conct = await database_1.default.connect();
            const sql = `DELETE FROM users WHERE u_uid = ($1) RETURNING u_uid , u_name`;
            const result = await conct.query(sql, [u_uid]);
            if (result.rows.length) {
                const user = result.rows[0];
                console.log(result.command, result.rowCount, user);
                conct.release();
                return {
                    msg: `User deleted successfuly`,
                    data: user,
                };
            }
            conct.release();
            return {
                msg: "Delete failed !",
                data: `User with id (${u_uid}) doesn't exist`,
            };
        }
        catch (err) {
            throw new Error(`can't delete user with id ${u_uid} from table users \n ${err.message}`);
        }
    }
    // Authentication function.
    async validateUser(u_name, u_password) {
        try {
            const conct = await database_1.default.connect();
            const sql = `SELECT u_uid, u_name, u_password  FROM users WHERE u_name = ($1) `;
            const result = await conct.query(sql, [u_name]);
            // checking for data.
            if (result.rows.length) {
                const user = result.rows[0];
                // checking user password authenticity.
                if ((0, control_1.isPwValide)(u_password, user.u_password)) {
                    return user;
                }
            }
            conct.release();
            return null;
        }
        catch (err) {
            // handling error
            throw new Error(`Can't validate user with name |${u_name}| from table Users \n ${err.message}`);
        }
    }
}
exports.userStore = new UsersStore();
