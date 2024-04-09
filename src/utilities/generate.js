import dotenv from "dotenv";
import OpenAI from "openai";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,
});

export async function handler(diff) {
  try {
    const completion = await openai.chat.completions({
      model: "gpt-3.5-turbo-instruct",
      prompt: diff,
      max_tokens: 3500,
      temperature: 0.6,
    });
    return { result: completion.data.choices[0].text };
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
    }
  }
}
