import rateLimit from "express-rate-limit";
import { config } from "../config.js";

export default rateLimit({
  windowMs: config.rateLimit.windowMs, // fixed window (1min)
  max: config.rateLimit.maxRequest, // IP별로 1분동안 얼마나 받을 수 있는지.
  keyGenerator: (req, res) => "dwitter", // default는 ip, dwitter로 설정하면 global하게 limit 할 수 있다.
});
