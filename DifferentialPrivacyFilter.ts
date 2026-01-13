
import { AtomicFact, ContextScope } from './types';

export class DifferentialPrivacyFilter {
  /**
   * Anonimiza um fato atômico antes de submetê-lo ao pool de consenso.
   * "Remove o João da frase, mantém a lição aprendida."
   */
  public static anonymize(fact: AtomicFact): Partial<AtomicFact> | null {
    // 1. Core Identity NUNCA sai da esfera privada
    if (fact.scope === ContextScope.CORE_IDENTITY || fact.scope === ContextScope.KINSHIP_LINEAGE) {
        return null;
    }

    // 2. Substitui o sujeito real por um token de arquétipo ou placeholder estatístico
    return {
        ...fact,
        subject: 'ABSTRACT_AGENT',
        metadata: {
            ...fact.metadata,
            is_anonymized: true
        }
    };
  }
}
