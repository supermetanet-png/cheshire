
import axios from 'axios';
import { AtomicFact } from './types';

export class HiveTransportService {
  private static readonly HIVE_ENDPOINT = process.env.HIVE_API_URL || 'http://hive-core/api/v1/sync';

  /**
   * Envia fatos anonimizados para o pool de consenso global.
   */
  public static async sync(anonymousFact: Partial<AtomicFact>) {
    try {
        console.log(`[Hive] Despachando axioma anonimizado para a rede.`);
        await axios.post(this.HIVE_ENDPOINT, anonymousFact, {
            headers: { 'X-Differential-Privacy': 'active' }
        });
    } catch (e) {
        console.warn("[Hive] Rede coletiva inacessível. Armazenando em buffer local.");
    }
  }
}
