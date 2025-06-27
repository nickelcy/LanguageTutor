import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import fs from "fs/promises";
import { config } from "dotenv";

config();

const speech = async (input) => {
  const elevenlabs = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY,
  });
  try {
    const audio = await elevenlabs.textToSpeech.convert(
      "JBFqnCBsd6RMkjVDRZzb",
      {
        text: input,
        modelId: "eleven_multilingual_v2",
        outputFormat: "mp3_44100_128",
      }
    );
    await fs.writeFile("output.mp3", audio);
    return 
  } catch (error) {
    console.log(error);
    console.log(process.env.ELEVENLABS_API_KEY)
    return;
  }
};

export default speech;
