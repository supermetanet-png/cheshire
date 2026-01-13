
import { AtomicFact, FactType } from "./types";
import { AIGateway } from "./AIGateway";

export class SynapticInterface {
  /**
   * Identifica o neurônio ativo e garante a assinatura correta das memórias.
   */
  public static getActiveBrainSignature(): string {
    return AIGateway.getActiveModelName();
  }

  public static async canonicalize(rawOutput: string): Promise<Partial<AtomicFact>[]> {
    const signature = this.getActiveBrainSignature();
    console.log(`[Synapse] Memória assinada pela era cognitiva: ${signature}`);
    
    try {
        const parsed = JSON.parse(rawOutput);
        return parsed.facts.map((f: any) => ({
            ...f,
            metadata: {
                brain_signature: signature,
                synapse_version: 1.0,
                is_anonymized: false
            }
        }));
    } catch (e) {
        console.error("[Synapse] Erro ao traduzir percepção sináptica.");
        return [];
    }
  }
}
