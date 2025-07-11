import express from "express";
import { config } from "dotenv";
import chat from "./chatgpt.js";
import cors from "cors";

config();

const app = express();
const port = process.env.PORT || 3000;
app.use(
  cors({
    origin: process.env.CLIENT,
  })
);

app.use(express.json());

app.post("/chat", async (req, res) => {
  const { input, history } = req.body;

  if (!input || typeof input !== "string") {
    return res
      .status(400)
      .json({ message: "Input is required and must be a string." });
  }

  try {
    const response = await chat(input, history ?? []);
    res.status(200).json({ response });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
