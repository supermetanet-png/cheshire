
import { KnowledgeService } from './KnowledgeService';
import { DecayEngine } from './DecayEngine';
import { PoolService } from './PoolService';
import { AtomicFact } from './types';
import axios from 'axios';

export class DreamerWorker {
  private static interval: any;
  private static readonly QDRANT_PROXY = process.env.VECTOR_PROXY_URL || '/rest/v1/vector';

  public static start() {
    console.log("[Dreamer] Iniciando ciclo circadiano...");
    this.interval = setInterval(() => this.introspect(), 300000); 
  }

  private static async introspect() {
    // 1. Coletar Projetos Ativos
    const sysPool = PoolService.getPool('cascata_system');
    const projects = await sysPool.query("SELECT slug FROM system.projects WHERE status = 'healthy'");

    for (const row of projects.rows) {
      const slug = row.slug;
      await this.processProjectDreams(slug);
    }
  }

  private static async processProjectDreams(slug: string) {
    const dbName = `cascata_db_${slug.replace(/-/g, '_')}`;
    const pool = PoolService.getPool(dbName);

    try {
      // 2. Link Prediction (Criar Arestas entre Fatos Próximos)
      // Buscamos fatos recentes e pedimos ao Qdrant vizinhos semânticos
      console.log(`[Dreamer] Tendo sonhos topológicos para ${slug}...`);
      
      // 3. Erosão Termodinâmica (Efetivar o Esquecimento)
      const activeFacts = await pool.query("SELECT * FROM public.atomic_facts WHERE is_cold = false");
      
      for (const fact of activeFacts.rows) {
        if (DecayEngine.shouldArchive(fact)) {
          await pool.query("UPDATE public.atomic_facts SET is_cold = true WHERE id = $1", [fact.id]);
          
          // REMOÇÃO FÍSICA DO VETOR CORE (Solução 5 - Cold Tiering)
          await axios.post(`${this.QDRANT_PROXY}/points/delete`, {
            points: [fact.id],
            // Mantém apenas o shadow_128 se possível (depende da config do Qdrant)
          }).catch(e => console.warn(`[Dreamer] Falha ao esfriar vetor: ${e.message}`));
          
          console.log(`[Dreamer] Fato ${fact.id} movido para o Inconsciente Digital.`);
        }
      }
    } catch (e) {
      console.error(`[Dreamer] Pesadelo em ${slug}:`, e);
    }
  }
}
