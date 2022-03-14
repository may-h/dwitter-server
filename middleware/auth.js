import jwt, { decode } from "jsonwebtoken";
import { config } from "../config.js";
import * as userRepository from "../data/auth.js";

const AUTH_ERROR = {
  message: "Authentication Error",
};

export async function isAuth(req, res, next) {
  //1. Cookie (for Browser)
  // 2. Header (for None-Browser Clinet)

  let token;
  //click the header first
  const authHeader = req.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // if no token in the header, check the cookie
  if (!token) {
    token = req.cookies["token"];
  }

  if (!token) {
    return res.status(401).json(AUTH_ERROR);
  }

  jwt.verify(token, config.jwt.secretKey, async (error, decoded) => {
    if (error) {
      return res.status(401).json(AUTH_ERROR);
    }
    const user = await userRepository.findById(decoded.id);
    if (!user) {
      return res.status(401).json(AUTH_ERROR);
    }
    req.userId = user.id;
    req.token = token;
    next();
  });
}

/* TODO - swagger openapi에서 사용
export const authHandler = async (req) => {
  const authHeader = req.get("Authorization");
  const token = authHeader.split(" ")[1];
  try {
    const decode = jwt.verify(token, config.jwt.secretKey);
    const user = await userRepository.findById(decode.id);
    if (!user) {
      throw { status: 401, ...AUTH_ERROR };
    }
    req.userId = user.id;
    req.token = decode;
    return true;
  } catch (err) {
    console.log(err);
    throw { status: 401, ...AUTH_ERROR };
  }
};
*/
