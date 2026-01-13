
import { AtomicFact } from './types';
import { PoolService } from './PoolService';

export class KnowledgeService {
  
  /**
   * Spreading Activation (Camada 4)
   * Recupera vizinhos topológicos atravessando as arestas do grafo.
   */
  public static async getResonantContext(factIds: string[], projectId: string): Promise<string[]> {
    if (factIds.length === 0) return [];
    
    const dbName = `cascata_db_${projectId.replace(/-/g, '_')}`;
    const pool = PoolService.getPool(dbName);
    
    try {
        // Travessia de 2-hops: Busca fatos que se conectam aos fatos semente
        // A lógica de arestas (edges) reside na tabela knowledge_graph_edges da VPS 2
        const query = `
          SELECT target_node, weight 
          FROM system.knowledge_graph_edges 
          WHERE source_node = ANY($1) 
          AND weight > 0.6
          ORDER BY weight DESC
          LIMIT 50
        `;
        
        const result = await pool.query(query, [factIds]);
        
        // Poda Espectral: Mantém apenas os 50 links mais fortes para evitar explosão de vizinhança
        const topEdges = this.protectHubs(result.rows);
        
        console.log(`[GNN] Ressonância expandida: +${topEdges.length} conexões encontradas.`);
        return topEdges.map(r => r.target_node);
    } catch (e) {
        console.error("[GNN] Falha na ativação por vizinhança:", e);
        return [];
    }
  }

  /**
   * Poda Espectral (Hub Protection)
   * Impede que entidades genéricas (ex: "Trabalho") saturem o cérebro.
   */
  public static protectHubs(edges: any[]): any[] {
    const MAX_EDGES_PER_NODE = 50;
    if (edges.length > MAX_EDGES_PER_NODE) {
        console.warn(`[GNN] Saturação detectada. Podando hub topológico.`);
        return edges.sort((a, b) => b.weight - a.weight).slice(0, MAX_EDGES_PER_NODE);
    }
    return edges;
  }
}
