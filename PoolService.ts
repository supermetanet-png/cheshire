
import pg from 'pg';

/**
 * PoolService - Gerenciador de conexões com o Cofre (VPS 2)
 */
export class PoolService {
  private static pools: Map<string, pg.Pool> = new Map();

  public static getPool(dbName: string): pg.Pool {
    if (this.pools.has(dbName)) {
      return this.pools.get(dbName)!;
    }

    const pool = new pg.Pool({
      host: process.env.DB_DIRECT_HOST || 'localhost',
      port: parseInt(process.env.DB_DIRECT_PORT || '5432'),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: dbName,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    this.pools.set(dbName, pool);
    return pool;
  }

  public static async closeAll() {
    for (const pool of this.pools.values()) {
      await pool.end();
    }
    this.pools.clear();
  }
}
