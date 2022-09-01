import express from "express";
import { CustomError } from "../errors/errorhandler";
import { PrismaClient } from "@prisma/client";
import sanitizeHtml from "sanitize-html";

const apiKeskustelutRouter: express.Router = express.Router();
apiKeskustelutRouter.use(express.json());
const prisma: PrismaClient = new PrismaClient();

apiKeskustelutRouter.get(
  "/",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      res.json(
        await prisma.keskustelu.findMany({
          include: {
            _count: {
              select: { viestit: true },
            },
          },
          orderBy: [
            {
              timestamp: "desc",
            },
          ],
        })
      );
    } catch (e: any) {
      next(new CustomError());
    }
  }
);
apiKeskustelutRouter.post(
  "/",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      res.json(
        await prisma.keskustelu.create({
          data: {
            header: req.body.header,
            authorNickname: req.body?.authorNickname,
            content: sanitizeHtml(req.body.content),
          },
        })
      );
    } catch (e: any) {
      next(new CustomError());
    }
  }
);

export default apiKeskustelutRouter;
