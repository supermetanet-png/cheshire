
/**
 * CHESHIRE MEMORY - ONTOLOGY GUARDRAIL HIERÁRQUICO
 */

export interface OntologyDomain {
  category: string;
  predicates: Record<string, string>;
}

export class OntologyService {
  private static readonly DOMAINS: OntologyDomain[] = [
    {
      category: 'IDENTIDADE',
      predicates: {
        'chama_se': 'possui_nome_legal',
        'conhecido_como': 'possui_apelido',
        'nasceu_em': 'data_nascimento'
      }
    },
    {
      category: 'LOCALIZAÇÃO',
      predicates: {
        'está_em': 'localizado_atualmente_em',
        'mora_em': 'reside_em',
        'visitando': 'em_transito_por'
      }
    },
    {
      category: 'AFETIVIDADE',
      predicates: {
        'gosta': 'tem_afinidade_com',
        'ama': 'tem_afinidade_com',
        'odeia': 'tem_aversao_a'
      }
    }
    // ... expansível para 150+
  ];

  public static normalizePredicate(raw: string): string {
    const clean = raw.toLowerCase().trim().replace(/\s+/g, '_');
    for (const domain of this.DOMAINS) {
      if (domain.predicates[clean]) return domain.predicates[clean];
    }
    return clean;
  }

  public static getCategories(): string[] {
    return this.DOMAINS.map(d => d.category);
  }

  public static getPredicatesForCategory(cat: string): string[] {
    const domain = this.DOMAINS.find(d => d.category === cat);
    return domain ? Object.values(domain.predicates) : [];
  }

  // Fix: Added missing getCanonicalTokens method to expose all normalized predicates to the extraction engine
  public static getCanonicalTokens(): string[] {
    return this.DOMAINS.flatMap(d => Object.values(d.predicates));
  }
}
