import Mongoose from "mongoose";
import { config } from "../config.js";

export async function connectDB() {
  return Mongoose.connect(config.db.host);
}

export function useVirtualId(schema) {
  // db 에서는 _id로 저장 되지만, 읽어올때는 id로 추가되도록 변환
  schema.virtual("id").get(function () {
    return this._id.toString();
  });

  schema.set("toJSON", { virtuals: true }); // json, object에 포함하도록 한다.
  schema.set("toObject", { virtuals: true });
}

// TODO (May): Delete blow
let db;

export function getTweets() {
  return db.collection("tweets");
}
