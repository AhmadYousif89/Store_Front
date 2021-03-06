import "dotenv/config";
import cors from "cors";
import { API_ROUTES } from "./api/routes";
import express, { Request, Response } from "express";
import serverErrors from "./middlewares/errors";
import notFound from "./middlewares/notFound";

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get("/", (_req: Request, res: Response) => {
  res.status(200).send(`
      <h2>TechStore API</h2>
      <p>Users : <a href="/api/users">Users Page</a></p>
      <p>Products : <a href="/api/products">Products Page</a></p>
  `);
});

app.use("/api", API_ROUTES);
app.use(serverErrors);
app.use(notFound);

const port = process.env.SERVER_PORT || 1000;
const testPort = process.env.TEST_PORT;

if (process.env.ENV === "test") {
  app.listen(testPort, () => {
    console.log(`server running on test port ${testPort}...\n`);
  });
} else
  app.listen(port, () => {
    console.log(`server running on port ${port}...\n`);
  });

export default app;
