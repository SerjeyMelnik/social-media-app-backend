import { Router } from "express";
import PostController from "./Endpoints/Post/PostController.js";
import { createProxyMiddleware } from 'http-proxy-middleware';
import UserController from "./Endpoints/User/UserController.js";

import { body } from "express-validator"
import authMiddleware from "./middlewares/auth-middleware.js";

const router = new Router();





//posts
router.post("/posts", PostController.create)
router.get("/posts", PostController.getAll)
router.get("/posts/:id", PostController.getById)
router.put("/posts", PostController.update)
router.delete("/posts/:id", PostController.delete)


//user
router.post("/registration",
	body('email').isEmail(),
	body('name').isLength({ min: 3, max: 32 }),
	body('password').isLength({ min: 3, max: 32 }),
	UserController.registration)

router.post("/login", UserController.login)
router.post("/logout", UserController.logout)


router.get("/activate/:link", UserController.activate)
router.get("/refresh", UserController.refresh)

router.get("/users", authMiddleware, UserController.getAllUsers)
router.get("/users/:id", UserController.getUserById)
router.put("/users", UserController.update)
router.delete("/users/:id", UserController.delete)

export default router;