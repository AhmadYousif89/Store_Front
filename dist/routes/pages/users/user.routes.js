"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = require("../../../models/users");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_middleware_1 = __importDefault(require("../../middlewares/auth.middleware"));
let error;
// method => POST /users
// desc   => Create new user data.
const createUser = (0, express_1.Router)().post("/users/sign-up", async (req, res, next) => {
    const { name, password } = req.body;
    console.log(`data:
      ${name}
      ${password}`);
    // validating values before submitting.
    if (!name || !password) {
        res.status(400).json({ status: "Error", message: "Please provide user name and password !" });
        return;
    }
    try {
        const data = await users_1.userModel.createUser({ u_name: name, password: password });
        res.status(201).json(data);
    }
    catch (err) {
        error = {
            message: `Request Failed ! ${err.message}`,
        };
        next(error);
    }
});
// method => POST /users/login
// desc   => Authenticate user data.
const loginUser = (0, express_1.Router)().post("/users/login", async (req, res, next) => {
    const { name, password } = req.body;
    console.log(`data:
      ${name}
      ${password}`);
    const { SECRET_TOKEN } = process.env;
    try {
        if (!name || !password) {
            res
                .status(400)
                .json({ status: "Error", message: "Please provide user name and password !" });
            return;
        }
        const user = await users_1.userModel.authenticateUser(name, password);
        if (!user) {
            res
                .status(401)
                .json({ msg: "Authentication failed !", data: "Invalid password or User Name" });
            return;
        }
        // creating token based on user credentials and my secret token.
        const token = jsonwebtoken_1.default.sign({ user }, SECRET_TOKEN);
        res.status(200).json({
            msg: "User authenticated successfully",
            data: user,
            token,
        });
    }
    catch (err) {
        error = {
            message: `Request Failed ! ${err.message}`,
        };
        next(error);
    }
});
// method => GET /users
// desc   => Return all users data.
const getUsers = (0, express_1.Router)().get("/users", async (_req, res, next) => {
    try {
        const data = await users_1.userModel.getAllUsers();
        if (data.length === 0) {
            res.status(404).json({ msg: `No Users Were Found !` });
            return;
        }
        res.status(200).json({ msg: "Data generated successfully", data });
    }
    catch (err) {
        error = {
            message: `Request Failed ! ${err.message}`,
        };
        next(error);
    }
});
// method => GET /users/id
// desc   => Return a specific user.
const getUserById = (0, express_1.Router)().get("/users/id", auth_middleware_1.default, async (req, res, next) => {
    const { uid } = req.body;
    console.log("data: ", uid);
    if (!uid) {
        res.status(400).json({ status: "Error", message: "Please provide user id !" });
        return;
    }
    try {
        const data = await users_1.userModel.getUserById(uid);
        if (!data) {
            res.status(404).json({
                msg: "Request failed !",
                data: `User with id (${uid}) doesn't exist`,
            });
            return;
        }
        res.status(200).json(data);
        return;
    }
    catch (err) {
        error = {
            message: `Request Failed ! ${err.message}`,
        };
        next(error);
    }
});
// method => PUT /users
// desc   => Update a specific user .
const updateUser = (0, express_1.Router)().put("/users", async (req, res, next) => {
    const { uid, password } = req.body;
    console.log(`data: 
      ${uid} 
      ${password}`);
    try {
        if (!uid || !password) {
            res.status(400).json({ status: "Error", message: "Please provide user id and password !" });
            return;
        }
        const data = await users_1.userModel.updateUser(uid, password);
        if (!data) {
            res.status(404).json({
                msg: "Update failed !",
                data: `User with id (${uid}) doesn't exist`,
            });
            return;
        }
        res.status(200).json(data);
    }
    catch (err) {
        error = {
            message: `Request Failed ! ${err.message}`,
        };
        next(error);
    }
});
// method => DELETE /users/id
// desc   => Delete a specific user.
const deleteUser = (0, express_1.Router)().delete("/users/id", async (req, res, next) => {
    const { uid } = req.body;
    console.log("params: \n", uid);
    try {
        if (!uid) {
            res.status(400).json({ status: "Error", message: "Please provide user id !" });
            return;
        }
        const data = await users_1.userModel.delUser(uid);
        if (!data) {
            res.status(404).json({
                msg: "Delete failed !",
                data: `User with id (${uid}) doesn't exist`,
            });
            return;
        }
        res.status(200).json(data);
    }
    catch (err) {
        error = {
            message: `Request Failed ! ${err.message}`,
        };
        next(error);
    }
});
exports.default = { createUser, loginUser, getUsers, getUserById, updateUser, deleteUser };