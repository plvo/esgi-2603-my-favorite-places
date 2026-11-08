import { Request } from "express";
import jwt from "jsonwebtoken";
import { User } from "../entities/User";

const tokenSecretKey = process.env.SESSION_SECRET || "superlongstring";

export async function getUserFromRequest(req: Request): Promise<User | null> {
  let token: null | string = null;
  const authorization = req.headers["authorization"];
  if (authorization && authorization.startsWith("Bearer ")) {
    token = authorization.split(" ").pop();
  } else if (req.cookies?.["token"]) {
    token = req.cookies["token"];
  }

  if (token) {
    try {
      const payload = jwt.verify(token, tokenSecretKey) as { userId: number };
      if (payload.userId) {
        const user = await User.findOneBy({ id: payload.userId });
        if (user) {
          return user;
        } else {
          return null;
        }
      }
    } catch {
      return null;
    }
  } else {
    return null;
  }
}
