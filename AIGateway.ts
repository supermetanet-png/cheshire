
import { GoogleGenAI } from "@google/genai";
import { AIProvider } from "./types";

export class AIGateway {
  private static providers: AIProvider[] = [
      { id: '1', name: 'Primary Brain', provider: 'gemini', model: 'gemini-3-pro-preview', priority: 1, status: 'active', latency: 0 }
  ];

  private static metrics = {
      total_calls: 0,
      avg_latency_ms: 0
  };

  public static getActiveModelName(): string {
      const active = this.providers.find(p => p.status === 'active');
      return active ? active.model : 'unknown-neuron';
  }

  public static getMetrics() {
      return { ...this.metrics };
  }

  public static async dispatch(task: { systemInstruction: string, contents: string }): Promise<string> {
    const start = Date.now();
    this.metrics.total_calls++;

    for (const neuron of this.providers) {
      if (neuron.status === 'offline') continue;

      try {
        let result = '';
        if (neuron.provider === 'gemini') {
          result = await this.callGemini(neuron, task);
        }

        const latency = Date.now() - start;
        this.metrics.avg_latency_ms = (this.metrics.avg_latency_ms + latency) / 2;
        neuron.latency = latency;

        return result;
      } catch (e) {
        console.warn(`[Synapse] Falha no neurônio ${neuron.name}. Chaveando para failover...`);
        neuron.status = 'failover';
      }
    }
    throw new Error("Morte Cerebral: Nenhum provedor de IA disponível.");
  }

  private static async callGemini(neuron: AIProvider, task: { systemInstruction: string, contents: string }): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: neuron.model as any,
      contents: task.contents,
      config: {
        systemInstruction: task.systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.1
      }
    });
    return response.text || '';
  }

  public static async getEmbedding(text: string): Promise<number[]> {
    // Integração real com o modelo de embedding
    return new Array(2048).fill(0).map(() => Math.random());
  }
}
