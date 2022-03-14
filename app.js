import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import "express-async-error";
import yaml from "yamljs";
import swaggerUI from "swagger-ui-express";
import * as OpenAPIValidator from "express-openapi-validator";
import * as apis from "./controller/index.js";
import { config } from "./config.js";
import tweetsRouter from "./router/tweets.js";
import authRouter from "./router/auth.js";
import { initSocket } from "./connection/socket.js";
import { connectDB } from "./database/database.js";
import { csrfCheck } from "./middleware/csrf.js";
// import { authHandler } from "./middleware/auth.js";
import rateLimit from "./middleware/rate-limiter.js";

const app = express();
const openAPIDocument = yaml.load("./api/openapi.yaml");

const corsOption = {
  origin: config.cors.allowedOrigin,
  optionsSuccessStatus: 200,
  credentials: true, // allow the Access-Control-Allow-Credentials
};

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors(corsOption));
app.use(morgan("tiny"));
app.use(rateLimit);
app.use(csrfCheck);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(openAPIDocument));
app.use("/tweets", tweetsRouter);
app.use("/auth", authRouter);
/** TODO - openapi.yaml에 정의한 api를 middleware에서 자동으로 routing, validation 처리하도록 한다.
app.use(
  OpenAPIValidator.middleware({
    apiSpec: "./api/openapi.yaml",
    validateResponses: true,

    operationHandlers: {
      resolver: modulePathResolver, // 유효한 api요청을 어떤 함수로 호출할건지 설정
    },
    validateSecurity: {
      handlers: {
        jwt_auth: authHandler,
      },
    },
  })
);

function modulePathResolver(_, route, apiDoc) {
  // OpenAPIValidator가 자동으로 route, apiDoc을 인자로 전달해준다.
  const pathKey = route.openApiRoute.substring(route.basePath.length);
  const operation = apiDoc.paths[pathKey][route.method.toLowerCase()];
  const methodName = operation.operationId;
  return apis[methodName];
}
*/

// Not Found Middleware
app.use((req, res, next) => {
  res.status(404);
});

// Error Handler
app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json({
    message: error.message,
  });
});

connectDB()
  .then(() => {
    const server = app.listen(process.env.PORT || config.host.port, () => {
      console.log(`port listening ${config.host.port}...`);
    });
    initSocket(server);
  })
  .catch(console.error);
