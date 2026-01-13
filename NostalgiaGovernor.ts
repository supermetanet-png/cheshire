
/**
 * NostalgiaGovernor (Fase 6.2)
 * Protege a CPU contra explosão de re-vetorização durante picos de nostalgia.
 */
export class NostalgiaGovernor {
  private static activeHealingProcesses = 0;
  private static readonly MAX_CONCURRENT_HEALING = 5;

  public static canStartHealing(): boolean {
    return this.activeHealingProcesses < this.MAX_CONCURRENT_HEALING;
  }

  public static startHealing() {
    this.activeHealingProcesses++;
  }

  public static endHealing() {
    this.activeHealingProcesses = Math.max(0, this.activeHealingProcesses - 1);
  }

  public static getLoadStatus(): string {
    const usage = (this.activeHealingProcesses / this.MAX_CONCURRENT_HEALING) * 100;
    return usage > 80 ? 'CRITICAL_LATENCY' : 'STABLE';
  }
}
