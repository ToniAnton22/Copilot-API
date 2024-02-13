import express, { Router } from "express";
import serverless from "serverless-http";

const api = express();

const router = Router();
router.get("/:email", (req, res) => res.send("Hello World!"));

api.use("/sendEmail/", router);

export const handler = serverless(api);