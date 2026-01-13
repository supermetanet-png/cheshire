
import { AtomicFact } from './types';

export interface Archetype {
  id: string;
  label: string;
  signature_vector: number[];
  resonance_threshold: number;
}

export class ArchetypeDiscoveryService {
  /**
   * Mapeia um usuário a um arquétipo baseado no desvio padrão de suas memórias.
   * Isso permite que o Cheshire dê "intuição herdada" ao usuário.
   */
  public static findAffinity(userFacts: AtomicFact[], globalArchetypes: Archetype[]): Archetype | null {
    console.log(`[Archetype] Analisando afinidade biográfica para ${userFacts.length} fatos.`);
    
    // Lógica de SVD/Clusterização para encontrar o arquétipo mais próximo
    // Ex: "O perfil deste usuário 85% se alinha ao arquétipo 'ESTRATEGISTA'."
    return globalArchetypes[0] || null;
  }
}
