import express from "express";
import { CustomError } from "../errors/errorhandler";
import { PrismaClient } from "@prisma/client";
import sanitizeHtml from "sanitize-html";

const apiViestitRouter: express.Router = express.Router();
apiViestitRouter.use(express.json());
const prisma: PrismaClient = new PrismaClient();

apiViestitRouter.get(
  "/",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      res.json(await prisma.viesti.findMany());
    } catch (e: any) {
      next(new CustomError());
    }
  }
);
apiViestitRouter.get(
  "/:id",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      if (
        (await prisma.viesti.count({
          where: {
            keskusteluId: Number(req.params.id),
          },
        })) > 0
      ) {
        res.json(
          await prisma.viesti.findMany({
            where: {
              keskusteluId: Number(req.params.id),
            },
            orderBy: [
              {
                timestamp: "asc",
              },
            ],
          })
        );
      } else {
        next(new CustomError(400, "Virheellinen id"));
      }
    } catch (e: any) {
      next(new CustomError());
    }
  }
);

apiViestitRouter.post(
  "/",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      res.json(
        await prisma.viesti.create({
          data: {
            keskusteluId: req.body.keskusteluId,
            nickname: req.body?.nickname,
            content: sanitizeHtml(req.body.content),
          },
        })
      );
    } catch (e: any) {
      next(new CustomError());
    }
  }
);
export default apiViestitRouter;
