import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as userRepository from "../data/auth.js";
import { config } from "../config.js";

export async function signUp(req, res, next) {
  // POST /auth/signup
  try {
    const { username, name, email, url, password } = req.body;
    const member = await userRepository.findByUsernmae(username);
    if (member)
      return res.status(409).json({ message: `${username} already exists` });

    const hashedPassword = await bcrypt.hashSync(
      password,
      config.bcrypt.saltRounds
    );
    const userId = await userRepository.createUser({
      username,
      name,
      email,
      url,
      password: hashedPassword,
    });
    const token = createJwtToken(userId);
    return res.status(201).json({ token, username });
  } catch (error) {
    console.error(error);
    return res.status(404).json({ message: error.message });
  }
}

export async function login(req, res, next) {
  // POST /auth/login
  try {
    const { username, password } = req.body;
    const user = await userRepository.findByUsernmae(username);
    if (!user)
      return res.status(401).json({ message: "Invalid user or password" });
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return res.status(401).json({ message: "Invalid user or password" });
    const token = createJwtToken(user.id);
    return res.status(200).json({ token, username });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}

export async function me(req, res, next) {
  const user = await userRepository.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({ token: req.token, username: user.username });
}

function createJwtToken(id) {
  console.log(config.jwt.secretKey);
  return jwt.sign({ id }, config.jwt.secretKey, {
    expiresIn: config.jwt.expiresInSec,
  });
}
