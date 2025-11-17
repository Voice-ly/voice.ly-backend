import express, { Request, Response } from "express";
import dotenv from "dotenv";

const app = express();
dotenv.config();

app.get("/", (_req: Request, res: Response) => {
    res.send("App funcionando");
});

app.listen(3000, () => {
    console.log("App funcionando");
});
