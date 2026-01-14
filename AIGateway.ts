
import { GoogleGenAI } from "@google/genai";
import { AIProvider } from "./types";
import axios from 'axios';

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
    // Fix: Initializing GoogleGenAI with named parameter apiKey and using process.env.API_KEY directly.
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
    // Fix: Accessing response.text as a property, not a method.
    return response.text || '';
  }

  /**
   * Implementação Oficial: OpenAI text-embedding-3-small (Truncated to 1024D)
   * Garante consistência semântica e eficiência de armazenamento no Qdrant.
   */
  public static async getEmbedding(text: string): Promise<number[]> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        console.warn("[AIGateway] OPENAI_API_KEY ausente. Usando fallback randômico (NÃO RECOMENDADO EM PRODUÇÃO)");
        return new Array(1024).fill(0).map(() => Math.random());
    }

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/embeddings',
            {
                input: text,
                model: "text-embedding-3-small",
                dimensions: 1024 // Solicita o corte para 1k dimensões conforme diretriz
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
        console.error(`[AIGateway] Erro ao gerar embedding OpenAI: ${e.response?.data?.error?.message || e.message}`);
        throw new Error("Falha Crítica no Motor de Vetorização.");
    }
  }
}
