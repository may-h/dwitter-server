import express from "express";
import "express-async-error";
import tweetsController from "../controller/tweets.js";

const router = express.Router();
let tweets = [];

// GET /tweets
// GET /tweets?username=:username
router.get("/", (req, res) => {
  const username = req.query.username;
  const data = tweetsController.getTweets(username);
  res.status(200).json(data);
});

// GET /tweets/:id
router.get("/:id", (req, res) => {
  const id = req.params.id;
  const data = tweetsController.getTweetsById(id);

  if (data) {
    res.status(200).json(data);
  } else {
    res.status(404).json({ message: `Tweet id(${id}) not found` });
  }
});

// POST /tweets
router.post("/", (req, res) => {
  const { text, username, name } = req.body;
  const tweet = {
    id: Date.now().toString(),
    text,
    createAt: new Date(),
    name,
    username,
    url: req.body.url || "",
  };
  tweets = tweetsController.createTweets(tweet);
  res.status(201).json(tweet);
});

// PUT /tweets/:id
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const text = req.body.text;

  const tweet = tweetsController.updateTweets(id, text);
  if (tweet) {
    res.status(200).json(tweet);
  } else {
    res.status(404).json({ message: `Tweet id(${id}) not found` });
  }
});

// DELETE /tweets/:id
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  tweets = tweetsController.deleteTweets(id);

  res.sendStatus(204);
});

export default router;
