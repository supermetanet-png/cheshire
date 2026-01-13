
import { AIGateway } from "./AIGateway";
import { PoolService } from "./PoolService";
import axios from 'axios';

export class VectorService {
  private static readonly QDRANT_PROXY = process.env.VECTOR_PROXY_URL || '/rest/v1/vector';

  /**
   * Persiste o Dual-Mapping no Qdrant com verificação de amadurecimento.
   */
  public async persist(projectId: string, factId: string, content: string, metadata: any) {
    try {
        const coreVector = await AIGateway.getEmbedding(content);
        
        // Recuperar matriz e metadados de treino
        const projectRes = await PoolService.getPool('cascata_system').query(
            "SELECT metadata->'projection_matrix' as matrix, metadata->'facts_count' as count FROM system.projects WHERE slug = $1", 
            [projectId]
        );
        
        const matrix = projectRes.rows[0]?.matrix;
        const count = projectRes.rows[0]?.count || 0;

        // Se tivermos matriz, projetamos o shadow_128 (O Vulto)
        const shadowVector = matrix ? this.project(coreVector, matrix) : coreVector.slice(0, 128);

        await axios.put(`${VectorService.QDRANT_PROXY}/points`, {
            points: [{
                id: factId,
                vectors: {
                    core_2048: coreVector,
                    shadow_128: shadowVector
                },
                payload: {
                    project_id: projectId,
                    ...metadata
                }
            }]
        });

        // Trigger de Re-treinamento (Dívida Técnica: Mover para Job assíncrono)
        if (count > 0 && count % 500 === 0) {
            this.triggerSVDRetraining(projectId);
        }

        return { status: 'synced' };
    } catch (e: any) {
        console.error(`[VectorMirror] Erro: ${e.message}`);
        return { status: 'local_only' };
    }
  }

  private project(vector: number[], matrix: number[][]): number[] {
      return matrix.map(row => 
          row.reduce((acc, val, idx) => acc + (val * (vector[idx] || 0)), 0)
      );
  }

  private async triggerSVDRetraining(projectId: string) {
      console.log(`[SVD] Threshold atingido para ${projectId}. Solicitando novo mapeamento dimensional.`);
      // Aqui o Cheshire chama um script Python/Tensorflow isolado para recalcular PCA
  }
}
