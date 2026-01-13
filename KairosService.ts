
import axios from 'axios';
import { PoolService } from './PoolService';

export class KairosService {
  private static WEBHOOK_URL = process.env.KAIROS_WEBHOOK_URL || 'https://n8n.seusistema.com/webhook/cheshire-arauto';

  /**
   * Gap Hunter: Identifica o que o Cheshire "quase" sabe
   */
  public static async huntGaps(projectId: string) {
    console.log(`[Kairos] Caçando lacunas biográficas para ${projectId}...`);
    
    // Lógica simulada: Procura sujeitos sem determinados predicados essenciais
    const gaps = [
        { subject: 'USER', missing_predicate: 'data_aniversario', context: 'Social' }
    ];

    for (const gap of gaps) {
        await this.dispatchProactiveTrigger(projectId, {
            type: 'GAP_FOUND',
            priority: 'medium',
            payload: gap,
            suggested_prompt: `Pergunte sutilmente sobre o aniversário de ${gap.subject}.`
        });
    }
  }

  private static async dispatchProactiveTrigger(projectId: string, data: any) {
    try {
        console.log(`[Kairos] Disparando gatilho proativo via Webhook...`);
        await axios.post(this.WEBHOOK_URL, {
            project_id: projectId,
            timestamp: new Date().toISOString(),
            ...data
        });
    } catch (e) {
        console.error(`[Kairos] Falha ao notificar n8n. Verifique o endpoint ou .env`);
    }
  }
}
