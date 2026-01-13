
import { AtomicFact, ContextScope } from './types';

export class CollectiveConsensusEngine {
  /**
   * Calcula o Wc (Weight of Consensus)
   * Quanto mais usuários validam um padrão, mais ele se torna um Axioma.
   */
  public static calculateRealityWeight(occurrences: number, avgConfidence: number, globalEntropy: number): number {
    // Wc = (Sum(Confidence) * Resonance) / ln(1 + Entropy)
    const resonance = 1.2; // Coeficiente de cinergia
    const weight = (occurrences * avgConfidence * resonance) / Math.log(1 + globalEntropy + 1.1);
    
    return Number(Math.min(weight, 1.0).toFixed(4));
  }

  /**
   * Promove um fato privado a Axioma Coletivo se atingir o threshold de realidade.
   */
  public static shouldPromoteToAxiom(realityWeight: number): boolean {
    return realityWeight > 0.85;
  }
}
