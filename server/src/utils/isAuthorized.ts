import { Response, Request, NextFunction } from "express";
import { getUserFromRequest } from "./getUserFromRequest";

export async function isAuthorized(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const user = await getUserFromRequest(req);

  if (user) {
    next();
  } else {
    return res.status(403).json({ message: `access denied` });
  }
}
