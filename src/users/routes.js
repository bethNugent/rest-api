const { Router } = require("express");

const userRouter = Router();

const { registerUser, login, getAllUsers } = require("./controllers");
const { hashPass, comparePass, tokenCheck } = require("../middlewear");


userRouter.post("/users/register", hashPass, registerUser);

userRouter.post("/users/login", comparePass, login);

userRouter.get("/users/getallusers", tokenCheck, getAllUsers);



module.exports = userRouter;