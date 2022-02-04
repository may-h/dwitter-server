import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import "express-async-error";
import { config } from "./config.js";

import tweetsRouter from "./router/tweets.js";
import authRouter from "./router/auth.js";
import { initSocket } from "./connection/socket.js";
import { sequelize } from "./db/database.js";
import { connectDB } from "./database/database.js";

const app = express();

const corsOption = {
  origin: config.cors.allowedOrigin,
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan("tiny"));
app.use(cors(corsOption));
// app.use(
//   cors({
//     origin: "*", // 해당하는 도메인에서만 데이터를 볼 수 있다.
//     optionsSuccessStatus: 200,
//     credentials: true, // Access-Control-Allow-Credentials - 로그인 정보 포함?
//   })
// );
app.use(helmet());

app.use("/tweets", tweetsRouter);
app.use("/auth", authRouter);

// Not Found Middleware
app.use((req, res, next) => {
  res.status(404);
});

// Error Handler
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500);
});

connectDB()
  .then(() => {
    const server = app.listen(process.env.PORT || config.host.port, () => {
      console.log(`port listening ${config.host.port}...`);
    });
    initSocket(server);
  })
  .catch(console.error);
