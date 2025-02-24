import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI with API key
const genAI = new GoogleGenerativeAI("AIzaSyCY8P8v3RR7D7T0csc2OF7bAF6xZMnJ18A");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Use latest version

async function generateAIResponse() {
  try {
    const prompt = "Explain how AI works";

    // Generate content
    const result = await model.generateContent(prompt);

    // Extract text from response
    const response = await result.response;
    const text = response.text();

    console.log(text);
  } catch (error) {
    console.error("Error generating AI response:", error);
  }
}

// Call the function
generateAIResponse();
