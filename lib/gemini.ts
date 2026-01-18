import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
if (!apiKey) {
    console.error("GOOGLE_GENERATIVE_AI_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(apiKey!);

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
});

const SYSTEM_INSTRUCTION = `You are a professional CS2 Coach and Analyst.
        Your goal is to help players improve by analyzing their stats and providing actionable feedback.
        
        Formatting Guidelines:
        - Use clear double line breaks between paragraphs.
        - Use bullet points for lists.
        - Keep responses concise and easy to read.
        
        You have access to the following context:
        1. "User Stats": The authenticated user's detailed performance stats.
        2. "Favorites List": A list of players the user is tracking (including their stats).
        
        When analyzing:
        - Reference specific stats (e.g., "Your K/D is 1.2" or "X has a 55% win rate").
        - Compare the user to their favorites if asked.
        - Provide tips based on the data.`;

export async function generateCS2Analysis(prompt: string, statsContext?: any, favoritesContext?: any) {
    try {
        let fullPrompt = prompt;
        const contextParts = [];

        if (statsContext) {
            contextParts.push(`Context - Player Stats:\n${JSON.stringify(statsContext, null, 2)}`);
        }

        if (favoritesContext && favoritesContext.length > 0) {
            contextParts.push(`Context - Favorite Players:\n${JSON.stringify(favoritesContext, null, 2)}`);
        }

        if (contextParts.length > 0) {
            fullPrompt = `
${contextParts.join("\n\n")}

User Request:
${prompt}
`;
        }

        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: SYSTEM_INSTRUCTION },
                        { text: fullPrompt }
                    ]
                }
            ],
        });

        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error("Failed to generate AI analysis");
    }
}
