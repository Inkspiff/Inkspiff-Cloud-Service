import dotenv from "dotenv";
import OpenAI from "openai";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,
});

export async function generateMd(diff, content) {
  const prompt = `generate an update for the markdown attached below base on the git diff provided. 
  \nTHE ORIGINAL MARKDOWN: 
  \n ${content}
  \nTHE GIT DIFF:
  \n ${diff}`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      model: "gpt-3.5-turbo",
      max_tokens: 3500,
      temperature: 0.6,
    });
    return { result: completion.choices[0] };
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
    }
  }
}
