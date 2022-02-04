// import 순서 : 외부 library -> 프로젝트에서 사용하는 것을 import
import express from "express";
import "express-async-error";
import { body } from "express-validator";
import * as tweetsController from "../controller/tweets.js";
import { validate } from "../middleware/validator.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

// validation 유효성 검사가 중요한 이유!
// 1. 데이터베이스에 읽고 쓰고 하는 것은 네트워크 비용이 발생하기 때문에 저장하기 전에 유효성 검사를 하는 것이 좋다.
// 2. sanitization, nomalization을 해서 데이터를 일관성있게 확인/저장
// Contract Testing : Client-Serer 통신할때 규격을 맞춰가는지 테스트 하는 방법
const validateTweet = [
  // body("username").isEmpty().trim().isString().isLength({ min: 2, max: 10 }),
  body("text")
    .trim()
    .isLength({ min: 2 })
    .withMessage("texh should be at least 2 charactor"),
  // body("name").isEmpty().trim().isString().isLength({ min: 3, max: 10 }),
  validate,
];

// GET /tweets
// GET /tweets?username=:username
router.get("/", isAuth, tweetsController.getTweets); // 주의 : 함수를 호출()하지 않고 연결해준다.

// GET /tweets/:id
router.get("/:id", isAuth, tweetsController.getTweet);

// POST /tweets
router.post("/", isAuth, validateTweet, tweetsController.createTweet);

// PUT /tweets/:id
router.put("/:id", isAuth, validateTweet, tweetsController.updateTweet);

// DELETE /tweets/:id
router.delete("/:id", isAuth, tweetsController.deleteTweet);

export default router;
