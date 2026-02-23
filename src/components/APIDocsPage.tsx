import React from 'react';
import { ArrowLeft, Shield, AlertTriangle, ExternalLink, Zap, Lock, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMotionPolicy } from '../hooks/useMotionPolicy';
import OverlayScaffold from './OverlayScaffold';
import { elevationTokens, providerCardStyles, typographyTokens } from '../styles/designTokens';

interface APIDocsPageProps {
    onClose: () => void;
}

const APIDocsPage: React.FC<APIDocsPageProps> = ({ onClose }) => {
    const { shouldReduceMotion } = useMotionPolicy();
    const providers = [
        { name: 'Cerebras', desc: 'Wafer-scale speed.', link: 'https://cloud.cerebras.ai/platform' },
        { name: 'Google', desc: 'Gemini - High versatility.', link: 'https://aistudio.google.com/app/apikey' },
        { name: 'Mistral', desc: 'Large - EU Efficiency.', link: 'https://console.mistral.ai/api-keys' },
        { name: 'xAI', desc: 'Grok - Real-time pulse.', link: 'https://console.x.ai/' },
        { name: 'Groq', desc: 'LPU™ - Maximum velocity.', link: 'https://console.groq.com/keys' }
    ];

    return (
        <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0 }}
            className="font-sans selection:bg-emerald-500/30"
        >
            <OverlayScaffold>
            {/* Header */}
            <header className="overlay-top-header relative z-[60] py-4">
                <div className="flex items-center justify-between">
                    <button
                        onClick={onClose}
                        className="focus-ring flex items-center gap-2 meta-secondary hover:text-white transition-all duration-300 group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Exit Docs</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] meta-secondary">Version 2.7.0</span>
                    </div>
                </div>
                <div className="overlay-top-header-fade" />
            </header>

            {/* Content */}
            <main className="py-16 md:py-24 density-prose">
                <motion.div
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.1 }}
                    className="mb-20 text-center md:text-left"
                >
                    <span className="text-[11px] font-mono tracking-[0.4em] uppercase text-emerald-500 mb-6 block font-bold">The Intelligence Protocol</span>
                    <h1 className={`${typographyTokens.display} font-bold text-white mb-8 tracking-tighter leading-none`}>
                        API <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Documentation</span>
                    </h1>
                    <p className="meta-primary text-xl leading-relaxed max-w-2xl">
                        A developer's guide to AI providers, token utilization, and the Zero-Middleman security architecture.
                    </p>
                </motion.div>

                <div className="space-y-24">
                    {/* Section 1: API Security & Assurance (MOVED TO TOP) */}
                    <motion.section
                        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div className="flex items-center gap-4 text-white">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                                <Shield className="text-emerald-500" size={24} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight text-white uppercase">Zero-Middleman Protocol</h2>
                                <p className="meta-secondary text-sm">Pure client-side autonomy</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="panel-primary p-10 relative overflow-hidden group border-emerald-500/20 bg-emerald-500/[0.03]">
                                <Lock className="absolute -bottom-6 -right-6 text-emerald-500/10 group-hover:text-emerald-500/20 transition-all duration-500" size={140} />
                                <h3 className="text-2xl font-bold text-white mb-6 relative z-10">Client-Side Vault</h3>
                                <p className="text-white/60 text-base leading-relaxed mb-8 relative z-10">
                                    Pustakam operates as a <strong>standalone entity</strong>. Your cryptographic keys never touch external servers because we function entirely within your browser environment.
                                </p>
                                <ul className="space-y-5 relative z-10">
                                    <li className="flex items-start gap-3 text-sm text-white/70">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                                        <span><strong>Direct Tunneling:</strong> Peer-to-peer browser-to-API communication.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-white/70">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                                        <span><strong>Local Persistence:</strong> Keys stored in local encrypted memory only.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm text-white/70">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                                        <span><strong>Full Purge:</strong> Instant wipe capability for all stored intelligence.</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="flex flex-col gap-6">
                                <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 transition-all duration-500 group">
                                    <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-[0.2em] mb-4">Traffic Transparency</h4>
                                    <p className="text-white/40 text-sm leading-relaxed">
                                        Monitor the <strong>Network Stack (F12)</strong> during generation. You'll observe outbound traffic reaching only official endpoints like <code>groq.com</code> or <code>google.com</code>.
                                    </p>
                                </div>
                                <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 transition-all duration-500 group">
                                    <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-[0.2em] mb-4">Privacy Immutable</h4>
                                    <p className="text-white/40 text-sm leading-relaxed">
                                        <strong>End-to-End Privacy:</strong> Your creative output remains 100% local. We utilize anonymized analytics for performance, and encrypted account records for profile persistence—never at the cost of your intellectual privacy.
                                    </p>
                                </div>
                                <div className="mt-auto p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                                    <p className="text-[11px] text-emerald-400/60 font-mono text-center italic tracking-wider">
                                        "Architecture is the strongest form of security."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Token Estimation Note */}
                    <motion.section
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="p-10 rounded-[2.5rem] bg-orange-500/[0.03] border border-orange-500/20"
                    >
                        <h3 className="text-orange-400 text-xl font-bold mb-6 flex items-center gap-3">
                            <AlertTriangle size={24} /> Token Economics
                        </h3>
                        <p className="text-white/60 text-base leading-relaxed mb-8">
                            For a <strong className="text-white">30,000-word volume</strong>, context builds progressively.
                            Each module incorporates preceding knowledge, resulting in <strong className="text-orange-400 italic">progressive context stacking</strong>:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                            <div className="p-6 rounded-2xl bg-black/40 border border-white/5">
                                <p className="text-white/40 font-mono uppercase tracking-widest text-[10px] mb-2">Output Ceiling</p>
                                <p className="text-white font-bold text-3xl mb-1">~40,000</p>
                                <p className="text-white/30 text-xs">Generated tokens for core content</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-black/40 border border-white/5">
                                <p className="text-orange-400/40 font-mono uppercase tracking-widest text-[10px] mb-2">Input Cumulative</p>
                                <p className="text-orange-400 font-bold text-3xl mb-1">~200,000</p>
                                <p className="text-white/30 text-xs">Full-history context stacked across all generated modules</p>
                            </div>
                        </div>
                    </motion.section>

                    {/* Providers & Use Cases sections follow with same styling... */}

                    {/* Section 2: Provider Overview */}
                    <section className="space-y-10">
                        <div className="flex items-center gap-4 text-white">
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                                <Zap className="text-purple-500" size={24} />
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight uppercase">AI Infrastructure</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {providers.map((provider) => {
                                const styles = providerCardStyles[provider.name] ?? { card: '', link: '' };
                                return (
                                <div key={provider.name} className={`panel-primary ${elevationTokens.low} p-8 transition-all duration-300 ${styles.card}`}>
                                    <h3 className="text-white font-bold text-lg mb-2">{provider.name}</h3>
                                    <p className="meta-secondary text-sm mb-6">{provider.desc}</p>
                                    <a href={provider.link} target="_blank" rel="noopener noreferrer" className={`focus-ring text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 ${styles.link}`}>
                                        Access Portal <ExternalLink size={12} />
                                    </a>
                                </div>
                            )})}
                        </div>
                    </section>

                    {/* Section 4: Model Strategy */}
                    <section className="space-y-10">
                        <div className="flex items-center gap-4 text-white">
                            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                                <BookOpen size={24} />
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight uppercase">Intelligence Strategy</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-orange-500/20 transition-all">
                                <h4 className="text-xs font-bold text-orange-400 uppercase mb-4 tracking-widest">Fiction & Narrative</h4>
                                <p className="text-[14px] text-white/50 leading-relaxed">
                                    Prioritize <strong>GLM-4.7</strong> or <strong>Mistral Large</strong> for deep world-building and characteristic dialogue flow.
                                </p>
                            </div>
                            <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 transition-all">
                                <h4 className="text-xs font-bold text-emerald-400 uppercase mb-4 tracking-widest">Technical & Deep Logic</h4>
                                <p className="text-[14px] text-white/50 leading-relaxed">
                                    Deploy <strong>Gemma 3 27B</strong> or <strong>GPT-120B</strong> for rigorous structural accuracy and system architecture.
                                </p>
                            </div>
                            <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-cyan-500/20 transition-all">
                                <h4 className="text-xs font-bold text-cyan-400 uppercase mb-4 tracking-widest">Multilingual King</h4>
                                <p className="text-[14px] text-white/50 leading-relaxed">
                                    Utilize <strong>Qwen-3-235B</strong> for the absolute peak of Marathi, Hindi, and regional dialect reasoning.
                                </p>
                            </div>
                            <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-purple-500/20 transition-all">
                                <h4 className="text-xs font-bold text-purple-400 uppercase mb-4 tracking-widest">Structured Pedagogy</h4>
                                <p className="text-[14px] text-white/50 leading-relaxed">
                                    Select <strong>Gemini 2.0</strong> or <strong>Llama 3.3</strong> for high-fidelity educational frameworks and logic.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="pt-12 border-t border-white/10 text-center">
                        <p className="text-white/30 text-xs font-mono tracking-widest uppercase">
                            Architecture by Pustakam Engine • Support: hello@tanmaysk.in
                        </p>
                    </section>
                </div>
            </main>
            </OverlayScaffold>
        </motion.div>
    );
};

export default APIDocsPage;
