import express from 'express';
import dotenv from 'dotenv';
import { IngestionService } from './IngestionService';
import { RetrievalService } from './RetrievalService';
import { DreamerWorker } from './DreamerWorker';
import { PoolService } from './PoolService';
import { AIGateway } from './AIGateway';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005; // Porta distinta para o Cérebro

// Fix: Cast middleware to any to resolve 'PathParams' overload mismatch in some type versions
app.use(express.json() as any);

// --- ENDPOINTS NEURAIS (Sistema 2) ---

/**
 * Endpoint de Ingestão: Recebe dados normalizados da VPS 1 (n8n)
 */
app.post('/api/psyche/ingest', async (req: any, res: any) => {
  const projectSlug = req.headers['x-project-slug'] as string;
  if (!projectSlug) return res.status(400).json({ error: 'Project ID required' });

  const service = new IngestionService(projectSlug);
  const result = await service.process(req.body);
  res.status(result.status).json(result);
});

/**
 * Endpoint do Oráculo: Fornece contexto biográfico profundo
 */
app.post('/api/psyche/retrieve', async (req: any, res: any) => {
  const { query, project_id } = req.body;
  const context = await RetrievalService.getContext(query, project_id);
  res.json({ context });
});

// --- BOOTSTRAP DO ORGANISMO ---

const boot = async () => {
  console.log("--------------------------------------------------");
  console.log("CHESHIRE MEMORY CORE v7 - INITIALIZING NEURONS");
  console.log("--------------------------------------------------");

  try {
    // 1. Iniciar loops de introspecção (Sleep Mode / Workers)
    DreamerWorker.start();

    // 2. Escutar na porta definida
    app.listen(PORT, () => {
      console.log(`[Organismo] Pulso detectado na porta ${PORT}`);
      console.log(`[Organismo] AIGateway configurado via Slot 1`);
    });
  } catch (e) {
    console.error("[Fatal] Falha no transplante cerebral:", e);
    process.exit(1);
  }
};

boot();