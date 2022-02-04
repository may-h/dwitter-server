import express from "express";
import { body, validationResult } from "express-validator";
import * as authController from "../controller/auth.js";
import { validate } from "../middleware/validator.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();
// const validate = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) return res.status(400).json(errors.array());
//   return next();
// };

const validateCredential = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("usrname should be at least 6 characters"),
  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("password sould be at lease 5 characters"),
  validate,
];

const validateSignup = [
  ...validateCredential,
  body("name").notEmpty().withMessage("name is missing"),
  body("email").isEmail().normalizeEmail().withMessage("invalid eamil"),
  body("url")
    .isURL()
    .withMessage("invalid URL")
    .optional({ nullable: true, checkFalsy: true }),
  validate,
];

router.post("/signup", validateSignup, authController.signUp);

router.post("/login", validateCredential, authController.login);

router.get("/me", isAuth, authController.me);

export default router;
