
import { AtomicFact } from './types';

export class ScarringService {
  /**
   * Aplica o protocolo de Cicatriz em uma memória superada.
   * A cicatriz mantém a história mas remove a autoridade do fato no Oráculo.
   */
  public static async applyScar(oldFact: AtomicFact, newFact: AtomicFact): Promise<AtomicFact> {
    console.log(`[Scarring] Criando cicatriz: O fato "${oldFact.object}" foi superado por "${newFact.object}"`);
    
    return {
      ...oldFact,
      isScar: true,
      confidence: oldFact.confidence * 0.2, // Redução drástica mas não nula
      // Fix: metadata type in types.ts now supports scar_depth and superseded_by properties
      metadata: {
        ...oldFact.metadata,
        scar_depth: newFact.confidence,
        superseded_by: newFact.id
      }
    };
  }

  /**
   * Detecta se dois fatos estão em rota de colisão biográfica
   */
  public static isCollision(f1: AtomicFact, f2: AtomicFact): boolean {
    return (
      f1.subject === f2.subject &&
      f1.predicate === f2.predicate &&
      f1.scope === f2.scope &&
      f1.object !== f2.object
    );
  }
}
