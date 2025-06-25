import express from "express";
import { config } from "dotenv";
import chat from "./chatgpt.js";
import cors from "cors";
import speech from "./speech.js";
import path from "path";

config();

const app = express();
const port = process.env.PORT || 3000;
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.get("/audio", (req, res) => {
  const filePath = path.resolve("./output.mp3"); 
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(500).send("Server error");
    }
  });
});

app.post("/chat", async (req, res) => {
  const { input, history } = req.body;

  if (!input || typeof input !== "string") {
    return res
      .status(400)
      .json({ message: "Input is required and must be a string." });
  }

  try {
    const response = await chat(input, history ?? []);
    const audio = await speech(response);
    res.status(200).json({ response });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
