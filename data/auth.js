import { useVirtualId } from "../database/database.js";
import Mongoose from "mongoose";

const userSchema = new Mongoose.Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  url: String,
});

useVirtualId(userSchema); // 가상의 id를 추가해주는 함수
const User = Mongoose.model("User", userSchema);

export async function findByUsernmae(username) {
  return User.findOne({ username });
}

export async function findById(id) {
  return User.findById(id);
}

export async function createUser(user) {
  return new User(user).save().then((data) => data.id);
}
