import { getSocketIO } from "../connection/socket.js";
import * as tweetRepository from "../data/tweets.js";

export async function getTweets(req, res) {
  const username = req.query.username;
  const data = await (username
    ? tweetRepository.getAllByUsername(username)
    : tweetRepository.getAll());

  res.status(200).json(data);
}

export async function getTweet(req, res) {
  const id = req.params.id;
  const data = await tweetRepository.getById(id);
  if (data) {
    res.status(200).json(data);
  } else {
    res.status(404).json({ message: `Tweet id(${id}) not found` });
  }
}

export async function createTweet(req, res) {
  const { text } = req.body;
  const tweet = await tweetRepository
    .create(text, req.userId)
    .catch((e) => console.log(e));
  res.status(201).json(tweet);
  getSocketIO().emit("tweet", { tweet }); // broad cast | 수정하고 싶으면 여기서!
}

export async function updateTweet(req, res) {
  const id = req.params.id;
  const text = req.body.text;
  const tweet = await tweetRepository.getById(id);

  if (!tweet) {
    return res.sendStatus(404).json({ message: `Tweet id(${id}) not found` });
  }

  if (tweet.userId !== req.userId) {
    return res.sendStatus(403); //401은 로그인이 필요한 서비스인데 로그인 안되어있을 떄, 403은 로그인된 사용자지만 권한이 없을 때
  }

  const updated = await tweetRepository.update(id, text);
  res.status(200).json(updated);
}

export async function deleteTweet(req, res) {
  const id = req.params.id;
  const tweet = await tweetRepository.getById(id);
  if (!tweet) {
    return res.sendStatus(404).json({ message: `Tweet id(${id}) not found` });
  }
  if (tweet.userId !== req.userId) {
    res.sendStatus(403);
  }
  await tweetRepository.remove(id);
  res.sendStatus(204);
}
