
import { GoogleGenAI } from "@google/genai";
import { AtomicFact } from './types';

export class BiographicalArcService {
  /**
   * Transforma uma sequência de fatos em um Insight Consolidado.
   * Ex: "Usuário visitou academia 20 vezes" -> "Usuário possui rotina ativa de exercícios".
   */
  public static async generateArc(facts: AtomicFact[]): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const factSummary = facts.map(f => `${f.subject} ${f.predicate} ${f.object}`).join('\n');

    try {
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Consolide estes fatos atômicos em um único arco biográfico de alto nível:\n\n${factSummary}`,
          config: { 
              systemInstruction: "Seja um biógrafo sutil e observador. Retorne apenas a frase consolidada.",
              temperature: 0.3 
          }
        });

        return response.text || "Arc consolidation failed.";
    } catch (e) {
        return "Consolidation offline.";
    }
  }
}
