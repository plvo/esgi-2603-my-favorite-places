import { Router } from "express";
import usersRouter from "./controllers/Users";
import addressesRouter from "./controllers/Addresses";

const apiRouter = Router();

apiRouter.use("/users", usersRouter);
apiRouter.use("/addresses", addressesRouter);

export default apiRouter;
