import axios from "axios";

interface GenerateMessageResponse {
  success: boolean;
  message: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export const generateAIMessage = async (topic: string): Promise<string[]> => {
  const response = await axios.post<GenerateMessageResponse>(
    `${API_BASE_URL}/api/ai/generate`,
    { topic }
  );

  const { success, message } = response.data;

  if (!success) throw new Error("AI generation failed");

  return message
    .split(/\n+/)
    .map((msg) =>
      msg
        .replace(/^\d+\.\s*/, "") 
        .replace(/^[-•]\s*/, "") 
        .replace(/^[*"“”]+|[*"“”]+$/g, "") 
        .trim()
    )
    .filter(
      (msg) =>
        msg.length > 0 &&
        !msg.toLowerCase().includes("here are") &&
        !msg.includes(":") &&
        !msg.startsWith("**")
    );
};
