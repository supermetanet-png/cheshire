
import { AtomicFact, MemorySnapshot } from './types';
// Fix: Import AIGateway to resolve the current model signature
import { AIGateway } from './AIGateway';

export class TheseusMigrationService {
  /**
   * Monitora a "Deriva de Identidade" quando o cérebro é trocado.
   */
  public static calculateBrainIntegrity(facts: AtomicFact[]): number {
    // Fix: Use AIGateway.getActiveModelName() to retrieve current model signature instead of non-existent SynapticInterface.getActiveBrain()
    const currentBrain = AIGateway.getActiveModelName();
    const syncedFacts = facts.filter(f => f.metadata.brain_signature === currentBrain);
    
    return (syncedFacts.length / facts.length) || 1.0;
  }

  /**
   * Promove a re-materialização lenta (Lazy Sync) de memórias antigas.
   * "As tábuas do barco são trocadas uma a uma."
   */
  public static async syncFactToNewBrain(fact: AtomicFact): Promise<AtomicFact> {
    console.log(`[Theseus] Re-materializando memória "${fact.id}" para o novo cérebro.`);
    
    return {
        ...fact,
        metadata: {
            ...fact.metadata,
            // Fix: Use AIGateway.getActiveModelName() to set current model signature instead of non-existent SynapticInterface.getActiveBrain()
            brain_signature: AIGateway.getActiveModelName(),
            synapse_version: 2.0 // Evolução estrutural
        }
    };
  }
}
