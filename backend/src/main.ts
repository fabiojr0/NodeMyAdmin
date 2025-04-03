import express, { Application, Request, Response } from "express";
import cors from "cors";
import dbRoutes from "./routes/dbRoutes";

const app: Application = express();
const port: number = 3000;

app.use(cors());
app.use(express.json());

app.use("/", dbRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
