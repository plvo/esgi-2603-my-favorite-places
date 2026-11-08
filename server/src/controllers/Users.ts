import { Router } from "express";
import { User } from "../entities/User";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { isAuthorized } from "../utils/isAuthorized";
import { getUserFromRequest } from "../utils/getUserFromRequest";

const tokenSecretKey = process.env.SESSION_SECRET || "superlongstring";

const usersRouter = Router();

usersRouter.post("/", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({ message: `email and password are required` });
  }

  try {
    const user = new User();
    user.email = email;
    user.hashedPassword = await argon2.hash(password);
    await user.save();
    return res.json({ item: user });
  } catch (e) {
    console.error(`🆘 got error: ${JSON.stringify(e)}`, e);
    return res.status(500).json({ message: `unable to create user` });
  }
});

usersRouter.get("/me", isAuthorized, async (req, res) => {
  const user = await getUserFromRequest(req);
  return res.json({ item: user });
});

usersRouter.post("/tokens", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({ message: `email and password are required` });
  }

  const user = await User.findOneBy({ email });

  if (!user) {
    return res.status(400).json({ message: `wrong credentials` });
  }

  try {
    if (await argon2.verify(user.hashedPassword, password)) {
      const token = jwt.sign({ userId: user.id }, tokenSecretKey);
      res.cookie("token", token, {
        httpOnly: true,
      });
      return res.json({ token: token });
    } else {
      return res.status(400).json({ message: `wrong credentials` });
    }
  } catch (err) {
    return res.status(400).json({ message: `wrong credentials` });
  }
});

export default usersRouter;
