import express, { Response, NextFunction, Request } from "express";
import apisRouter from "./apis";

const router = express.Router();
// import { requiresAuth } from "express-openid-connect";
import viewsRouter from "./views";

router.use(viewsRouter);
router.use('/api', apisRouter);

export default router;
