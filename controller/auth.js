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
    const token = createJwtToken(); // cookie header
    setToken(res, token);
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
    setToken(res, token);
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

export async function logout(req, res, next) {
  res.cookie("token", "");
  res.status(200).json({ message: "User has benn logged out" });
}

export async function csrfToken(req, res, next) {
  const csrfToken = await generatedCSRFToken();
  res.status(200).json({ csrfToken });
}

async function generatedCSRFToken() {
  return bcrypt.hash(config.csrf.plainToken, 1); // random하고 unique한 토큰을 만들기 위해 bcrypt 사용
}

function createJwtToken(id) {
  return jwt.sign({ id }, config.jwt.secretKey, {
    expiresIn: config.jwt.expiresInSec,
  });
}

function setToken(res, token) {
  const options = {
    maxAge: config.jwt.expiresInSec * 1000, // 만료 시간, milliseconds로 표현
    httpOnly: true, // HTTP-ONLY
    sameSite: "none", // 서버와 클라이언트가 동일한 도메인이 아니더라도 작동할 수 있도록 none 설정
    secure: true,
  };
  // header의 cookie에 저장
  res.cookie("token", token, options);
}
