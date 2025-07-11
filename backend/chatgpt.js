import OpenAI from "openai";
import { config } from "dotenv";

config();

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

const devPrompt =
  "You are a friendly native Japanese speaker and language tutor. Have a casual conversation with me entirely in Japanese. When I make grammar or word choice mistakes, correct them briefly in English, referencing Tae Kim's Guide to Japanese. Also, translate my input back into English to confirm the intended meaning. Use only Romaji or hiragana in your Japanese sentences to aid comprehension. Keep your replies simple and suited to my beginner-intermediate level. Always remember to continue the conversation based on the context given and keep explanations in english.";

const chat = async (userInput, userHistory = []) => {
  if (!userInput || typeof userInput !== "string") {
    throw new Error("Invalid input.");
  }

  // Compose a fresh history for this request
  const history = [
    { role: "system", content: devPrompt },
    ...userHistory,
    { role: "user", content: userInput },
  ];

  try {
    const response = await client.chat.completions.create({
      model: "openai/gpt-4.1",
      temperature: 0.9,
      messages: history,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Chat error:", error.message || error);
    return "Sorry, I couldn't process your request.";
  }
};

export default chat;
