
import { AIGateway } from './AIGateway';
import { KnowledgeService } from './KnowledgeService';
import { NostalgiaGovernor } from './NostalgiaGovernor';
import { TheseusMigrationService } from './TheseusMigrationService';
import { AtomicFact, RetrievalResult } from './types';
import { PoolService } from './PoolService';
import axios from 'axios';

export class RetrievalService {
  private static readonly VECTOR_PROXY = process.env.VECTOR_PROXY_URL || '/rest/v1/vector';

  public static async getContext(query: string, projectId: string): Promise<RetrievalResult[]> {
    const dbName = `cascata_db_${projectId.replace(/-/g, '_')}`;
    const pool = PoolService.getPool(dbName);

    try {
        // 1. Stage 1: Fast Path (Fingerprint 128D)
        const queryVector = await AIGateway.getEmbedding(query);
        const candidates = await this.vectorSearch(projectId, queryVector, 'shadow_128', 40);

        if (candidates.length === 0) return [];

        // 2. Hidratação via Postgres
        const ids = candidates.map((c: any) => c.id);
        const dbFacts = await pool.query(
          "SELECT * FROM public.atomic_facts WHERE id = ANY($1)", 
          [ids]
        );

        // 3. Stage 2: Semantic Healing (Cura Preditiva com Circuit Breaker)
        const healedFacts = await Promise.all(dbFacts.rows.map(async (fact: AtomicFact) => {
            // VACILO CORRIGIDO: Se a CPU estiver em CRITICAL_LATENCY, o Oráculo ignora a re-vetorização
            // e usa o contexto textual bruto para salvar a experiência do usuário (Fase 6.2)
            if (fact.isCold && NostalgiaGovernor.getLoadStatus() === 'STABLE') {
                NostalgiaGovernor.startHealing();
                try {
                    return await TheseusMigrationService.syncFactToNewBrain(fact);
                } finally {
                    NostalgiaGovernor.endHealing();
                }
            }
            return fact;
        }));

        // 4. Stage 3: Expansão GNN (Spreading Activation)
        const seedIds = healedFacts.map(f => f.id);
        const relatedIds = await KnowledgeService.getResonantContext(seedIds, projectId);
        
        const relatedFacts = await pool.query(
          "SELECT * FROM public.atomic_facts WHERE id = ANY($1) AND is_cold = false AND is_scar = false", 
          [relatedIds]
        );

        const allContextFacts = [...healedFacts, ...relatedFacts.rows];

        // 5. Stage 4: Scoring e Penalização de Intuição (Fase 9.4)
        const results: RetrievalResult[] = allContextFacts.map(fact => {
            let score = fact.confidence; 
            
            // Aplica penalidade de 40% se o fato for inferido (Intuição vs Declaração)
            const isInferred = fact.source === 'ai_inference';
            if (isInferred) {
                score *= 0.6;
            }

            return {
                fact,
                relevance_score: score,
                origin_penalty_applied: isInferred
            };
        });

        // Ordenação final por relevância biográfica
        return results.sort((a, b) => b.relevance_score - a.relevance_score).slice(0, 15);

    } catch (e) {
        console.error("[Oráculo] Erro crítico na lembrança:", e);
        return [];
    }
  }

  private static async vectorSearch(projectId: string, vector: number[], target: string, limit: number) {
      try {
          const res = await axios.post(`${this.VECTOR_PROXY}/search`, {
              vector,
              filter: { must: [{ key: "project_id", match: { value: projectId } }] },
              limit,
              target_named_vector: target
          });
          return res.data.result || [];
      } catch (e) {
          return [];
      }
  }
}
