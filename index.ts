import express from "express";
import path from "path";
import errorhandler from "./errors/errorhandler";
import apiKeskusteluRouter from "./routes/apiKeskustelut";
import apiViestiRouter from "./routes/apiViestit";

const app: express.Application = express();
const port: number = Number(process.env.PORT || 3107);

app.use(express.static(path.resolve(__dirname, "./public")));
app.use("/api/keskustelut", apiKeskusteluRouter);
app.use("/api/viestit", apiViestiRouter);
app.use(errorhandler);

app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!res.headersSent) {
      res.status(404).json({ viesti: "Virheellinen reitti" });
    }
    next();
  }
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
