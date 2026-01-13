
import { AtomicFact, FactType } from './types';

export class GuardianService {
  
  /**
   * Juiz de Dissonância (Camada 5)
   * Avalia conflitos biográficos aplicando a Lei da Recência Ponderada.
   */
  public static async evaluateDissonance(newFact: AtomicFact, existingFacts: AtomicFact[]): Promise<{ 
    action: 'persist' | 'scar_old' | 'flag_dissonance',
    targetId?: string 
  }> {
    
    // Busca colisão APENAS no mesmo escopo (Doutrina da Poli-Verdade)
    const collision = existingFacts.find(f => 
      f.subject === newFact.subject && 
      f.predicate === newFact.predicate && 
      f.scope === newFact.scope &&
      f.object !== newFact.object &&
      !f.isScar
    );

    if (!collision) {
        return { action: 'persist' };
    }

    // Fatos do tipo EVENT formam uma linha do tempo, não se anulam.
    if (newFact.factType === FactType.EVENT) {
      return { action: 'persist' };
    }

    // --- LEI DA RECÊNCIA PONDERADA ---
    // Peso = Confidence * Decay(tempo)
    const msPerDay = 86400000;
    const oldAge = (Date.now() - collision.validAt.getTime()) / msPerDay;
    const newAge = (Date.now() - newFact.validAt.getTime()) / msPerDay;

    // Fatos plásticos (preferências) perdem 5% de autoridade a cada dia sem reforço
    const oldWeight = collision.confidence * Math.pow(0.95, oldAge);
    const newWeight = newFact.confidence * Math.pow(0.95, newAge);

    console.log(`[Guardian] Conflito: Antigo(${oldWeight.toFixed(2)}) vs Novo(${newWeight.toFixed(2)})`);

    if (newWeight > oldWeight * 1.2) {
      // Se o novo fato for significativamente mais "quente" ou confiável, cicatriza o antigo
      return { action: 'scar_old', targetId: collision.id };
    }

    // Se houver empate técnico (Dissonância de 50/50), dispara alerta
    return { action: 'flag_dissonance', targetId: collision.id };
  }
}
