
export enum ContextScope {
  CORE_IDENTITY = 'core_identity',       
  KINSHIP_LINEAGE = 'kinship_lineage',   
  AFFINITY_CIRCLE = 'affinity_circle',   
  PROFESSIONAL_NET = 'professional_net', 
  VITAL_STATE = 'vital_state',           
  AMBITION_DRIVE = 'ambition_drive',     
  EXTERNAL_CONTEXT = 'external_context',
  COLLECTIVE_AXIOM = 'collective_axiom' 
}

export enum FactType {
  EVENT = 'event',       
  STATE = 'state',       
  PREFERENCE = 'preference', 
  RELATION = 'relation',   
  INFERENCE = 'inference'  
}

export interface AIProvider {
  id: string;
  name: string;
  provider: string;
  model: string;
  priority: number;
  status: 'active' | 'offline' | 'failover';
  latency: number;
}

export interface FactMetadata {
  hash: string;              // SHA-256 do conteúdo
  platform: string;          // whatsapp, instagram, etc
  brain_signature: string;   // Modelo que gerou
  synapse_version: number;   // Versão do protocolo Cheshire
  is_anonymized: boolean;    // Flag para o Hive
  erosion_rate: number;      // Constante k de volatilidade
  reality_weight: number;    // Wc (Peso de Consenso)
  scar_depth?: number;       // Profundidade da ferida se for um "Scar"
  superseded_by?: string;    // ID do fato que o substituiu
  projection_matrix_id?: string; // ID da matriz SVD usada no shadow_128
}

export interface Plutchik512 {
  base: {
    joy: number; sadness: number; anger: number; fear: number;
    disgust: number; surprise: number; anticipation: number; trust: number;
  };
  latent_dimensions: Record<string, number>; 
}

export interface AtomicFact {
  id: string;
  projectId: string;
  subject: string;      
  predicate: string;    
  object: string;
  factType: FactType;
  confidence: number;   
  gravity: number;      
  plutchik: Plutchik512;
  scope: ContextScope;
  source: 'user' | 'ai_inference' | 'system' | 'collective_consensus';
  isCold: boolean;      
  isScar: boolean;      
  metadata: FactMetadata; 
  validAt: Date;         
  createdAt: Date;
  lastReinforcedAt: Date;
}

export interface MemorySnapshot {
  active_nodes: number;
  cold_nodes: number;
  entropy: number;
  svd_variance: number;
  latency_ms: number;
  dissonance_alerts: number;
  brain_sync_ratio: number;
  active_neurons: number;
  collective_resonance: number; 
  active_archetypes: number;
}

export interface RetrievalResult {
  fact: AtomicFact;
  relevance_score: number;
  origin_penalty_applied: boolean;
}

export interface IngestionPayload {
  platform: string;
  timestamp: number; 
  user: { id: string; };
  semantic_text: string;
}
