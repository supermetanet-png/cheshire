
import { AtomicFact, FactType } from './types';

export class DecayEngine {
  /**
   * Calcula o Peso Termodinâmico (W) de um fato.
   * W(t) = Gravity * (1 / (1 + exp(k * (t - t_half))))
   */
  public static calculateVitality(fact: AtomicFact): number {
    const now = Date.now();
    const ageInDays = (now - fact.lastReinforcedAt.getTime()) / (1000 * 60 * 60 * 24);
    
    // Fatos do tipo EVENT ou CORE_IDENTITY são resistentes à erosão
    if (fact.factType === FactType.EVENT) return fact.gravity;

    // Fix: erosion_rate is now an optional property in AtomicFact.metadata
    const k = fact.metadata.erosion_rate || 0.15; // Volatilidade
    const tHalf = 30; // Meia-vida padrão de 30 dias para fatos plásticos

    const vitality = fact.gravity * (1 / (1 + Math.exp(k * (ageInDays - tHalf))));
    
    return Number(vitality.toFixed(4));
  }

  /**
   * Identifica fatos que devem ser movidos para o Inconsciente Digital (Cold Storage)
   */
  public static shouldArchive(fact: AtomicFact): boolean {
    const vitality = this.calculateVitality(fact);
    return vitality < 0.1; // Threshold de esquecimento
  }
}
