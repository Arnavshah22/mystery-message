import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

export async function POST(request:Request) {
    try {
        const prompt="Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";
        
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log(text)

        return text;

    } catch (error) {
        console.error('Error while Suggesting messages:', error);
        return Response.json(
          { success: false, message: 'Something went Wrong' },
          { status: 500 }
        );
        
    }
  }

  
