// src/lib/auth.js
import { hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";

export async function hashPassword(password) {
  return await hash(password, 12); // 12 est le coût de hachage
}

export async function comparePassword(password, hashedPassword) {
  return await compare(password, hashedPassword);
}

export function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
}
