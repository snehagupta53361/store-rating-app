import jwt from "jsonwebtoken";
import env from "../config/env.js";

export const signAccessToken = ({ id, role }) => {
  return jwt.sign({ sub: id, role }, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, env.jwt.secret);
};
