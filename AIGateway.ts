
import { GoogleGenAI } from "@google/genai";
import { AIProvider } from "./types";
import axios from 'axios';

export class AIGateway {
  private static providers: AIProvider[] = [
      { id: '1', name: 'Primary Brain', provider: 'gemini', model: 'gemini-3-pro-preview', priority: 1, status: 'active', latency: 0 }
  ];

  public static getActiveModelName(): string {
      return this.providers[0].model;
  }

  public static async dispatch(task: { systemInstruction: string, contents: string }): Promise<string> {
    try {
        // Criando instância a cada chamada para garantir o uso da chave mais recente do env
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: task.contents,
            config: {
                systemInstruction: task.systemInstruction,
                responseMimeType: "application/json",
                temperature: 0.1
            }
        });
        
        return response.text || '{}';
    } catch (e: any) {
        console.error("[AIGateway] Falha crítica no provedor primário:", e.message);
        throw new Error("Morte Cerebral: IA indisponível.");
    }
  }

  public static async getEmbedding(text: string): Promise<number[]> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY is required for Vectorization.");

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/embeddings',
            {
                input: text,
                model: "text-embedding-3-small",
                dimensions: 1024
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data.data[0].embedding;
    } catch (e: any) {
        throw new Error(`Embedding Error: ${e.message}`);
    }
  }
}
