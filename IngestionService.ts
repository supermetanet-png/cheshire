
import { IngestionPayload, AtomicFact, FactType, ContextScope, FactMetadata } from './types';
import { OntologyService } from './OntologyService';
import { VectorService } from './VectorService';
import { AIGateway } from './AIGateway';
import { GuardianService } from './GuardianService';
import { PoolService } from './PoolService';

export class IngestionService {
  private projectSlug: string;
  private vectorService: VectorService;

  constructor(projectSlug: string) {
    this.projectSlug = projectSlug;
    this.vectorService = new VectorService();
  }

  public async process(payload: IngestionPayload): Promise<{ status: number, facts: AtomicFact[] }> {
    const dbName = `cascata_db_${this.projectSlug.replace(/-/g, '_')}`;
    const pool = PoolService.getPool(dbName);

    const systemInstruction = `
      Você é o Arquiteto de Ontologia do Cheshire System. 
      Extraia fatos atômicos SPO. Tokens canônicos: ${OntologyService.getCanonicalTokens().join(', ')}.
      Analise Plutchik (0.0 a 1.0).
    `;

    try {
      const responseText = await AIGateway.dispatch({
        systemInstruction,
        contents: `Interação: ${payload.semantic_text}`
      });

      const data = JSON.parse(responseText || '{"facts":[]}');
      const atomicFacts: AtomicFact[] = [];

      for (const f of data.facts) {
        const factId = Math.random().toString(36).substr(2, 9);
        
        const metadata: FactMetadata = {
            hash: `sha256-${factId}`, 
            platform: payload.platform,
            brain_signature: AIGateway.getActiveModelName(),
            synapse_version: 1.0,
            is_anonymized: false,
            erosion_rate: f.factType === 'state' ? 0.25 : 0.05,
            reality_weight: 0.1
        };

        const newFact: AtomicFact = {
          id: factId,
          projectId: this.projectSlug,
          subject: f.subject,
          predicate: OntologyService.normalizePredicate(f.predicate),
          object: f.object,
          factType: f.factType as FactType || FactType.STATE,
          confidence: f.confidence,
          gravity: f.confidence > 0.8 ? 1.0 : 0.3,
          scope: f.scope as ContextScope || ContextScope.EXTERNAL_CONTEXT,
          source: 'user',
          isCold: false,
          isScar: false,
          plutchik: { base: f.emotions || { joy: 0, trust: 0, anger: 0, fear: 0, sadness: 0, surprise: 0, disgust: 0, anticipation: 0 }, latent_dimensions: {} },
          metadata: metadata,
          validAt: new Date(payload.timestamp),
          createdAt: new Date(),
          lastReinforcedAt: new Date()
        };

        // CAMADA 5: DETECÇÃO DE DISSONÂNCIA (VACILO CORRIGIDO)
        // Antes de salvar, buscamos colisão no banco para aplicar a Lei da Recência
        const existingRes = await pool.query(
            "SELECT * FROM public.atomic_facts WHERE subject = $1 AND predicate = $2 AND is_scar = false",
            [newFact.subject, newFact.predicate]
        );
        
        const evaluation = await GuardianService.evaluateDissonance(newFact, existingRes.rows);

        if (evaluation.action === 'scar_old' && evaluation.targetId) {
            await pool.query("UPDATE public.atomic_facts SET is_scar = true, confidence = confidence * 0.2 WHERE id = $1", [evaluation.targetId]);
            console.log(`[Tálamo] Fato ${evaluation.targetId} cicatrizado por dissonância.`);
        }

        // Persistência Híbrida
        await this.vectorService.persist(this.projectSlug, factId, `${f.subject} ${f.predicate} ${f.object}`, metadata);
        
        // Persistência SQL (Mock - assumindo que o pool lida com o save)
        atomicFacts.push(newFact);
      }

      return { status: 201, facts: atomicFacts };
    } catch (e) {
      console.error("[Tálamo] Erro na ingestão:", e);
      return { status: 500, facts: [] };
    }
  }
}
