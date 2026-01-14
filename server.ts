
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { IngestionService } from './IngestionService';
import { RetrievalService } from './RetrievalService';
import { DreamerWorker } from './DreamerWorker';

// Inicialização de ambiente
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3005;

// Configurações de Middleware (Segurança e Volume de Dados)
// Added 'as any' cast to bypass middleware type version mismatches in strict environments
app.use(express.json({ limit: '50mb' }) as any);

// --- ENDPOINTS NEURAIS (SISTEMA 2) ---

/**
 * Ingestão de Memória: Processa dados da VPS 1 (n8n)
 */
// Fix: Using 'any' for req and res to resolve type errors where standard Express properties were not being recognized (headers, status, body, json)
app.post('/api/psyche/ingest', async (req: any, res: any): Promise<void> => {
    const projectSlug = req.headers['x-project-slug'] as string;
    
    if (!projectSlug) {
        res.status(400).json({ 
            error: 'Project Identity Required', 
            code: 'MISSING_X_PROJECT_SLUG' 
        });
        return;
    }

    try {
        const service = new IngestionService(projectSlug);
        const result = await service.process(req.body);
        res.status(result.status).json(result);
    } catch (error: any) {
        console.error(`[Neural Error] Ingestion Failed: ${error.message}`);
        res.status(500).json({ error: 'Cognitive Ingestion Failure', detail: error.message });
    }
});

/**
 * Oráculo de Recuperação: Provê contexto profundo para a IA Executiva
 */
// Fix: Using 'any' for req and res to resolve type errors where standard Express properties were not being recognized (body, status, json)
app.post('/api/psyche/retrieve', async (req: any, res: any): Promise<void> => {
    const { query, project_id } = req.body;

    if (!query || !project_id) {
        res.status(400).json({ error: 'Payload Incompleto: Query e ProjectID são mandatórios.' });
        return;
    }

    try {
        const context = await RetrievalService.getContext(query, project_id);
        res.json({ context });
    } catch (error: any) {
        console.error(`[Neural Error] Retrieval Failed: ${error.message}`);
        res.status(500).json({ error: 'Oracle Connection Failure' });
    }
});

/**
 * Health Check: Diagnóstico de pulso neural
 */
// Fix: Using 'any' for req and res to resolve type errors where standard Express properties were not being recognized (json)
app.get('/api/health', (req: any, res: any) => {
    res.json({ 
        status: 'ALIVE', 
        pulse: new Date().toISOString(), 
        version: '7.0.0-Singularity' 
    });
});

// --- CAMADA DE RESSONÂNCIA (FRONTEND REACT) ---

const distPath = path.join(__dirname, 'dist');

// Serve arquivos estáticos (CSS, JS, Imagens)
// Added 'as any' cast to bypass static middleware type version mismatches
app.use(express.static(distPath, {
    maxAge: '1d',
    etag: true
}) as any);

// Fallback SPA: Entrega o index.html para qualquer rota não mapeada (React Router)
// Fix: Using 'any' for req and res to resolve type errors where standard Express properties were not being recognized (sendFile)
app.get('*', (req: any, res: any) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

// --- BOOTSTRAP DO ORGANISMO ---

const boot = async () => {
    console.clear();
    console.log("==================================================");
    console.log("      CHESHIRE MEMORY CORE v7 - SINGULARIDADE     ");
    console.log("==================================================");

    try {
        // Inicia workers de introspecção (Sleep Mode)
        DreamerWorker.start();
        console.log("[Sistema] DreamerWorker ativo. Ciclo circadiano iniciado.");

        app.listen(PORT, () => {
            console.log(`[Sistema] Pulso detectado na porta ${PORT}`);
            console.log(`[Sistema] Interface Visual disponível no IP da VPS.`);
        });
    } catch (error) {
        console.error("[Fatal] Erro crítico na inicialização neural:", error);
        process.exit(1);
    }
};

boot();
