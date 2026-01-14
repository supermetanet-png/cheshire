
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { IngestionService } from './IngestionService.js';
import { RetrievalService } from './RetrievalService.js';
import { DreamerWorker } from './DreamerWorker.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.json({ limit: '50mb' }) as any);

// --- API NEURAL ---
app.post('/api/psyche/ingest', async (req: any, res: any) => {
    const projectSlug = req.headers['x-project-slug'];
    if (!projectSlug) return res.status(400).json({ error: 'Missing x-project-slug' });

    try {
        const service = new IngestionService(projectSlug as string);
        const result = await service.process(req.body);
        res.status(result.status).json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/psyche/retrieve', async (req: any, res: any) => {
    const { query, project_id } = req.body;
    if (!query || !project_id) return res.status(400).json({ error: 'Payload incomplete' });

    try {
        const context = await RetrievalService.getContext(query, project_id);
        res.json({ context });
    } catch (error: any) {
        res.status(500).json({ error: 'Retrieval failed' });
    }
});

app.get('/api/health', (req: any, res: any) => {
    res.json({ 
        status: 'ALIVE', 
        pulse: new Date().toISOString(),
        system: 'Cheshire V7 Core'
    });
});

// --- FRONTEND SERVING ---
// Garantia de caminho absoluto para o dist em qualquer ambiente Docker
const distPath = path.resolve(process.cwd(), 'dist');

app.use(express.static(distPath) as any);

app.get('*', (req: any, res: any) => {
    // Se não for rota de API, serve o frontend
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(distPath, 'index.html'));
    } else {
        res.status(404).json({ error: 'Neural endpoint not found' });
    }
});

// --- BOOTSTRAP RESILIENTE ---
const startBrain = async () => {
    try {
        console.log(`[CHESHIRE CORE] Iniciando pulso neural na porta ${PORT}...`);
        
        // Iniciamos o servidor ANTES dos workers pesados para satisfazer o healthcheck do Docker
        app.listen(PORT, () => {
            console.log(`[CHESHIRE CORE] Servidor HTTP pronto.`);
            
            // Inicia processos de background de forma assíncrona para não bloquear o boot
            setTimeout(() => {
                try {
                    DreamerWorker.start();
                    console.log(`[CHESHIRE CORE] Ciclo circadiano DreamerWorker iniciado.`);
                } catch (e) {
                    console.error(`[Aviso] Falha ao iniciar DreamerWorker:`, e);
                }
            }, 1000);
        });

    } catch (error) {
        console.error("[FATAL] Falha catastrófica no bootstrap:", error);
        // Em produção, queremos que o Docker reinicie em caso de erro fatal real
        process.exit(1);
    }
};

startBrain();
