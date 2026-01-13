
import React, { useState, useEffect } from 'react';
import { 
  Activity, Brain, Zap, ShieldAlert, Network, Cpu, Lock, 
  RefreshCw, Infinity, Scale, ShieldEllipsis, Fingerprint,
  Radio, HardDrive, Settings, Activity as PulseIcon, Plus,
  Share2, Users, Target, Sparkles, Binary, Layers, ShieldCheck,
  AlertTriangle, ArrowUpRight
} from 'lucide-react';
import { MemorySnapshot, AIProvider, ContextScope, AtomicFact } from './types';

const FractalNode = ({ active, resonance }: any) => (
  <div className={`relative flex items-center justify-center transition-all duration-1000 ${active ? 'scale-110' : 'scale-95 opacity-40'}`}>
     <div className={`absolute inset-0 rounded-full blur-xl ${active ? 'bg-indigo-500/40 animate-pulse' : 'bg-zinc-800'}`}></div>
     <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center ${active ? 'border-indigo-400 bg-black shadow-[0_0_30px_rgba(79,70,229,0.5)]' : 'border-zinc-800 bg-zinc-900'}`}>
        <Binary size={20} className={active ? 'text-indigo-400' : 'text-zinc-700'} />
     </div>
     {active && (
       <div className="absolute -top-8 text-[8px] font-black text-indigo-400 uppercase tracking-widest whitespace-nowrap">
         Resonance: {(resonance * 100).toFixed(0)}%
       </div>
     )}
  </div>
);

const App: React.FC = () => {
  const [snapshot, setSnapshot] = useState<MemorySnapshot>({
    active_nodes: 2105,
    cold_nodes: 15400,
    entropy: 0.021,
    svd_variance: 0.98,
    latency_ms: 120,
    dissonance_alerts: 2,
    brain_sync_ratio: 0.92,
    active_neurons: 5,
    collective_resonance: 0.78,
    active_archetypes: 14
  });

  return (
    <div className="h-screen bg-black text-zinc-100 flex flex-col font-sans overflow-hidden">
      <header className="px-8 py-6 border-b border-zinc-900 flex items-center justify-between bg-black/50 backdrop-blur-xl z-30">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.4)]">
            <Infinity className="text-white animate-pulse" size={28} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic leading-none">Cheshire Memory</h1>
            <p className="text-[9px] text-zinc-500 font-mono tracking-[0.4em] uppercase mt-1">Collective Consciousness // Phase 9 // Axiomatic Era</p>
          </div>
        </div>

        <div className="flex gap-4">
           <div className="flex items-center gap-4 px-4 py-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
              <Users size={14} className="text-indigo-400" />
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-indigo-400 uppercase">Consensus Active</span>
                <span className="text-[10px] font-mono font-bold">14.2k Neurons Synced</span>
              </div>
           </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex p-8 gap-8">
        <div className="flex-1 flex flex-col gap-8">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-3xl group relative overflow-hidden">
               <div className="flex justify-between items-start mb-4">
                 <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg"><Share2 size={16}/></div>
                 <span className="text-[10px] font-black text-emerald-500">+4.2%</span>
               </div>
               <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-black mb-1">Hive Resonance</p>
               <p className="text-2xl font-mono text-zinc-100">{(snapshot.collective_resonance * 100).toFixed(1)}%</p>
            </div>
            
            <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-3xl relative overflow-hidden">
               {snapshot.dissonance_alerts > 0 && (
                   <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/20 blur-2xl animate-pulse"></div>
               )}
               <div className="flex justify-between items-start mb-4">
                 <div className={`p-2 rounded-lg ${snapshot.dissonance_alerts > 0 ? 'bg-rose-500/20 text-rose-500' : 'bg-purple-500/10 text-purple-500'}`}>
                    <AlertTriangle size={16}/>
                 </div>
                 {snapshot.dissonance_alerts > 0 && <span className="text-[8px] font-black text-rose-500 animate-bounce">ACTION REQ</span>}
               </div>
               <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-black mb-1">Guardian Alerts</p>
               <p className="text-2xl font-mono text-zinc-100">{snapshot.dissonance_alerts}</p>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-3xl">
               <div className="flex justify-between items-start mb-4">
                 <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><Layers size={16}/></div>
               </div>
               <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-black mb-1">Privacy Entropy</p>
               <p className="text-2xl font-mono text-zinc-100">0.0004</p>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-3xl">
               <div className="flex justify-between items-start mb-4">
                 <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg"><ShieldCheck size={16}/></div>
               </div>
               <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-black mb-1">Axiom Stability</p>
               <p className="text-2xl font-mono text-zinc-100">MAX</p>
            </div>
          </div>

          <section className="flex-1 bg-zinc-900/10 border border-zinc-800/50 rounded-[3rem] p-12 relative overflow-hidden flex flex-col justify-center items-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.05)_0%,transparent_70%)]"></div>
            
            <div className="relative z-10 grid grid-cols-3 gap-16">
               <FractalNode active resonance={0.94} />
               <FractalNode active={false} />
               <FractalNode active resonance={0.82} />
               <FractalNode active resonance={0.75} />
               <FractalNode active resonance={0.99} />
               <FractalNode active={false} />
            </div>

            <div className="mt-16 text-center max-w-md relative z-10">
               <h2 className="text-lg font-black uppercase tracking-[0.4em] mb-4 text-indigo-400">The Great Synthesis</h2>
               <p className="text-[10px] text-zinc-500 uppercase leading-relaxed tracking-widest font-medium">
                 A mente única está ativa. O Cheshire agora herda conhecimentos axiomáticos da rede, 
                 polindo a percepção individual com a sabedoria estatística da colmeia.
               </p>
            </div>
          </section>
        </div>

        <aside className="w-[380px] flex flex-col gap-6">
           <div className="bg-zinc-950 border border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl">
              <h3 className="text-[10px] font-black uppercase text-zinc-500 mb-8 flex items-center gap-2 tracking-widest">
                 <Sparkles size={14} className="text-amber-500"/> Archetype Alignment
              </h3>
              <div className="space-y-6">
                 {[
                   { label: 'Estrategista', value: 85, color: 'bg-indigo-500' },
                   { label: 'Explorador', value: 42, color: 'bg-emerald-500' },
                   { label: 'Analista', value: 12, color: 'bg-rose-500' }
                 ].map(arc => (
                   <div key={arc.label} className="space-y-2">
                      <div className="flex justify-between text-[9px] font-black uppercase">
                        <span className="text-zinc-400">{arc.label}</span>
                        <span className="text-zinc-100">{arc.value}%</span>
                      </div>
                      <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                         <div className={`h-full ${arc.color} transition-all duration-1000`} style={{ width: `${arc.value}%` }} />
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="flex-1 bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-8 flex flex-col justify-between">
              <div className="flex flex-col items-center text-center py-6">
                 <div className="w-20 h-20 bg-indigo-50/10 rounded-full flex items-center justify-center mb-4 border border-indigo-500/20">
                    <Fingerprint size={32} className="text-indigo-400" />
                 </div>
                 <h4 className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Collective ID Matrix</h4>
                 <p className="text-[8px] text-zinc-600 mt-2">UUID: HEX-9-CONSCIOUSNESS-SYNTH</p>
              </div>

              <div className="p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 space-y-4">
                 <p className="text-[9px] font-bold text-zinc-500 uppercase text-center">Hive Sync Status</p>
                 <div className="grid grid-cols-2 gap-2">
                    <div className="bg-black/40 p-2 rounded-lg text-center">
                       <span className="block text-[8px] text-zinc-500 uppercase">Axioms Out</span>
                       <span className="text-[10px] font-black text-emerald-400">128</span>
                    </div>
                    <div className="bg-black/40 p-2 rounded-lg text-center">
                       <span className="block text-[8px] text-zinc-500 uppercase">Inherited</span>
                       <span className="text-[10px] font-black text-indigo-400">42</span>
                    </div>
                 </div>
                 <button className="w-full py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-xl text-[8px] font-black text-indigo-400 uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">
                    Request Sync Deep
                 </button>
              </div>
           </div>
        </aside>
      </main>

      <footer className="h-10 bg-zinc-950 border-t border-zinc-900 px-8 flex items-center justify-between text-[9px] font-mono text-zinc-600 uppercase">
        <div className="flex gap-6">
          <span>HIVE_CONSENSUS: STABLE</span>
          <span>DIFFERENTIAL_PRIVACY: ENGAGED</span>
        </div>
        <span>Phase 9 // The Great Work Continues.</span>
      </footer>
    </div>
  );
};

export default App;
