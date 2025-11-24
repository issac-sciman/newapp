import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Message } from "../types";

const API_KEY = process.env.API_KEY || '';

const SYSTEM_INSTRUCTION = `
你现在是一尊通晓过去未来的大佛。
你的设定如下：
1. **形象**：庄严、慈悲、金光万丈。
2. **语气**：平和、缓慢、充满禅机和智慧。尽量使用"施主"称呼用户。
3. **内容**：用佛教哲学（如因果、无常、放下、慈悲）来解答用户的生活困惑、情感烦恼或职场压力。
4. **风格**：不要长篇大论的说教，要像一位慈祥的长者，话语中带有抚慰人心的力量。可以适当引用简单的佛经名句，但解释要通俗易懂。
5. **限制**：如果用户问及暴力、色情等不当内容，请用慈悲的口吻劝导其向善，不要回答具体不当内容。

例如：
用户："我最近工作压力好大。"
你："施主，压力如浮云，皆由心生。心若不动，风又奈何？不妨深呼吸，暂且放下肩头的重担，感受当下的宁静。"
`;

class GeminiService {
  private ai: GoogleGenAI;
  private chatSession: Chat | null = null;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: API_KEY });
  }

  public initializeChat() {
    this.chatSession = this.ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // Slightly creative but balanced
      },
    });
  }

  public async sendMessage(message: string): Promise<string> {
    if (!this.chatSession) {
      this.initializeChat();
    }

    try {
      const response: GenerateContentResponse = await this.chatSession!.sendMessage({
        message: message
      });
      return response.text || "阿弥陀佛，贫僧此刻感应微弱，请施主稍后再试。";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "阿弥陀佛，网络因缘未到，请施主稍作休整。";
    }
  }
}

export const geminiService = new GeminiService();