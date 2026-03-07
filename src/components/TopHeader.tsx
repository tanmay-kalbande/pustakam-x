import React, { useState } from 'react';
import { Settings, User, LogOut, ChevronDown, BookOpen, Shield } from 'lucide-react';
import { APISettings, ModelProvider } from '../types';
import { BookProject } from '../types/book';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface TopHeaderProps {
    settings: APISettings;
    books: BookProject[];
    currentBookId: string | null;
    onModelChange: (model: string, provider: ModelProvider) => void;
    onOpenSettings: () => void;
    onSelectBook: (id: string | null) => void;
    onDeleteBook: (id: string) => void;
    onNewBook: () => void;
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
    onOpenAuth: () => void;
    isAuthenticated: boolean;
    user: SupabaseUser | null;
    userProfile: any | null;
    onSignOut: () => void;
    showModelSelector?: boolean;
    onOpenDocs?: () => void;
    onOpenAPIDocs?: () => void;
    centerContent?: React.ReactNode;
}

// All supported models configuration
const MODEL_OPTIONS: { provider: ModelProvider; model: string; name: string }[] = [
    // Cerebras Models
    { provider: 'cerebras', model: 'gpt-oss-120b', name: 'GPT-OSS 120B' },
    { provider: 'cerebras', model: 'qwen-3-235b-a22b-instruct-2507', name: 'Qwen 3 235B' },
    { provider: 'cerebras', model: 'zai-glm-4.7', name: 'ZAI GLM 4.7' },
    { provider: 'cerebras', model: 'llama-3.3-70b', name: 'Llama 3.3 70B' },
    { provider: 'cerebras', model: 'llama3.1-8b', name: 'Llama 3.1 8B' },
    // Google Gemini Models
    { provider: 'google', model: 'gemini-3-flash-preview', name: 'Gemini 3 Flash Preview' },
    { provider: 'google', model: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
    { provider: 'google', model: 'gemma-3-27b-it', name: 'Gemma 3 27B' },
    // Mistral Models
    { provider: 'mistral', model: 'mistral-small-latest', name: 'Mistral Small' },
    { provider: 'mistral', model: 'mistral-medium-latest', name: 'Mistral Medium' },
    { provider: 'mistral', model: 'mistral-large-latest', name: 'Mistral Large' },
    // xAI Grok Models
    { provider: 'xai', model: 'grok-4.1', name: 'Grok 4.1' },
    { provider: 'xai', model: 'grok-4.1-fast', name: 'Grok 4.1 Fast' },
    { provider: 'xai', model: 'grok-4-fast', name: 'Grok 4 Fast' },
    // Groq Models
    { provider: 'groq', model: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B' },
    { provider: 'groq', model: 'moonshotai/kimi-k2-instruct-0905', name: 'Kimi K2 Instruct' },
    { provider: 'groq', model: 'groq/compound', name: 'Groq Compound' },
    { provider: 'groq', model: 'openai/gpt-oss-20b', name: 'GPT-OSS 20B' },
    // OpenRouter Models
    { provider: 'openrouter', model: 'arcee-ai/trinity-large-preview:free', name: 'Trinity Large Preview' },
    { provider: 'openrouter', model: 'arcee-ai/trinity-mini:free', name: 'Trinity Mini' },
    { provider: 'openrouter', model: 'tngtech/deepseek-r1t2-chimera:free', name: 'DeepSeek R1 Chimera' },
    { provider: 'openrouter', model: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free', name: 'Dolphin Mistral 24B' },
    // Cohere Models
    { provider: 'cohere', model: 'command-a-03-2025', name: 'Cohere Command A' },
    { provider: 'cohere', model: 'command-r-plus-08-2024', name: 'Cohere Command R+' },
    // MiniMax Models
    { provider: 'minimax', model: 'MiniMax-M2.5', name: 'MiniMax M2.5' },
    { provider: 'minimax', model: 'MiniMax-M2.5-highspeed', name: 'MiniMax M2.5 Highspeed' },
    { provider: 'minimax', model: 'MiniMax-M2.1', name: 'MiniMax M2.1' },
];

export const TopHeader: React.FC<TopHeaderProps> = ({
    settings,
    onModelChange,
    onOpenSettings,
    theme,
    onToggleTheme,
    onOpenAuth,
    isAuthenticated,
    user,
    userProfile,
    onSignOut,
    onOpenDocs,
    onOpenAPIDocs,
    showModelSelector = true,
    centerContent
}) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showModelMenu, setShowModelMenu] = useState(false);

    const displayName = userProfile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

    const isProviderEnabled = (provider: ModelProvider) => {
        switch (provider) {
            case 'google': return !!settings.googleApiKey;
            case 'mistral': return !!settings.mistralApiKey;
            case 'groq': return !!settings.groqApiKey;
            case 'cerebras': return !!settings.cerebrasApiKey;
            case 'xai': return !!settings.xaiApiKey;
            case 'openrouter': return !!settings.openRouterApiKey;
            case 'cohere': return !!settings.cohereApiKey;
            case 'minimax': return !!settings.minimaxApiKey;
            default: return false;
        }
    };

    const availableModels = MODEL_OPTIONS.filter(m => {
        const hasKey = isProviderEnabled(m.provider);
        if (!hasKey) return false;

        if (settings.defaultGenerationMode === 'blackhole') {
            const allowedModels = [
                'grok-4.1', 'grok-4.1-fast', 'grok-4-fast',
                'mistral-large-latest', 'mistral-medium-latest',
                'llama-3.3-70b-versatile', 'groq/compound', 'openai/gpt-oss-20b', 'moonshotai/kimi-k2-instruct-0905',
                'qwen-3-235b-a22b-instruct-2507', 'zai-glm-4.7', 'llama-3.3-70b', 'llama3.1-8b',
                'gemma-3-27b-it',
                'arcee-ai/trinity-large-preview:free', 'arcee-ai/trinity-mini:free', 'tngtech/deepseek-r1t2-chimera:free', 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
                'command-a-03-2025', 'command-r-plus-08-2024',
                'MiniMax-M2.5', 'MiniMax-M2.5-highspeed', 'MiniMax-M2.1'
            ];
            return allowedModels.includes(m.model);
        }

        return true;
    });

    const currentModelName = MODEL_OPTIONS.find(m => m.model === settings.selectedModel)?.name || settings.selectedModel || 'Select Model';

    return (
        <header
            className={`top-header-shell fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl transition-colors duration-300 ${theme === 'light' ? 'border-black/10 bg-white/88' : 'border-white/12 bg-[#050505]/78'}`}
            style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
        >
            <div className="mx-auto flex h-[var(--header-height)] w-full max-w-[1440px] items-center gap-2 px-4 md:px-8">
                <div className="flex items-center gap-2.5 select-none">
                    <img src={theme === 'light' ? '/black-logo.png' : '/white-logo.png'} alt="Pustakam" className="h-8 w-8" />
                    <div className="flex flex-col leading-none">
                        <span
                            className={`text-[15px] sm:text-base font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}
                            style={{ fontFamily: "'Aptos-Mono', monospace" }}
                        >
                            Pustakam
                        </span>
                        <span
                            className={`text-[9px] tracking-[0.16em] uppercase ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}
                            style={{ fontFamily: "'Aptos-Mono', monospace" }}
                        >
                            Engine
                        </span>
                    </div>
                </div>

                <div className="hidden md:flex flex-1 items-center justify-center px-6">
                    {centerContent}
                </div>

                <div className="ml-auto flex items-center gap-2 md:gap-2.5">
                    {showModelSelector && (
                        <div className="relative">
                            <button
                                onClick={() => setShowModelMenu(!showModelMenu)}
                                className={`flex h-9 items-center gap-2 rounded-xl border px-3 text-xs sm:text-sm font-medium transition-all ${theme === 'light'
                                    ? 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                                    : 'border-white/10 bg-white/5 text-gray-200 hover:border-white/20 hover:bg-white/10'
                                    }`}
                            >
                                <span className="max-w-[130px] sm:max-w-[170px] truncate">{currentModelName}</span>
                                <ChevronDown size={14} className={`opacity-60 transition-transform ${showModelMenu ? 'rotate-180' : ''}`} />
                            </button>

                            {showModelMenu && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowModelMenu(false)} />
                                    <div
                                        className={`absolute right-0 top-[calc(100%+0.5rem)] z-50 w-[min(23rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border shadow-[0_28px_70px_-32px_rgba(0,0,0,0.75)] ${theme === 'light' ? 'border-gray-200 bg-white' : 'border-white/10 bg-[#101010]'
                                            }`}
                                        style={{
                                            animation: 'dropdownExpand 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                                            transformOrigin: 'top right'
                                        }}
                                    >
                                        <div className={`border-b px-4 py-2.5 ${theme === 'light' ? 'border-gray-100' : 'border-white/10'}`}>
                                            <p className={`text-[11px] font-semibold uppercase tracking-[0.12em] ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Model</p>
                                        </div>
                                        <div className="max-h-[320px] overflow-y-auto py-1.5">
                                            {availableModels.length === 0 ? (
                                                <div className={`px-4 py-7 text-center ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                                                    <p className="text-sm mb-3">No API keys configured</p>
                                                    <button
                                                        onClick={() => { onOpenSettings(); setShowModelMenu(false); }}
                                                        className="inline-flex items-center rounded-lg border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-xs font-semibold text-orange-500 hover:bg-orange-500/20"
                                                    >
                                                        Configure Keys
                                                    </button>
                                                </div>
                                            ) : (
                                                availableModels.map((option) => {
                                                    const isSelected = settings.selectedModel === option.model;
                                                    return (
                                                        <button
                                                            key={`${option.provider}-${option.model}`}
                                                            onClick={() => {
                                                                onModelChange(option.model, option.provider);
                                                                setShowModelMenu(false);
                                                            }}
                                                            className={`w-full px-4 py-2.5 text-left transition-colors ${isSelected
                                                                ? (theme === 'light' ? 'bg-gray-50 text-gray-900' : 'bg-white/8 text-white')
                                                                : (theme === 'light' ? 'text-gray-600 hover:bg-gray-50 hover:text-gray-900' : 'text-gray-300 hover:bg-white/6 hover:text-white')
                                                                }`}
                                                        >
                                                            <div className="flex items-center justify-between gap-3">
                                                                <div className="min-w-0">
                                                                    <div className="truncate text-sm font-medium">{option.name}</div>
                                                                    <div className="mt-0.5 text-[10px] uppercase tracking-[0.12em] opacity-60">{option.provider}</div>
                                                                </div>
                                                                {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />}
                                                            </div>
                                                        </button>
                                                    );
                                                })
                                            )}
                                        </div>
                                        <div className={`border-t p-2 ${theme === 'light' ? 'border-gray-100' : 'border-white/10'}`}>
                                            <button
                                                onClick={() => {
                                                    onOpenSettings();
                                                    setShowModelMenu(false);
                                                }}
                                                className={`w-full rounded-lg px-3 py-2 text-xs font-medium transition-colors ${theme === 'light' ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' : 'text-gray-300 hover:bg-white/8 hover:text-white'
                                                    }`}
                                            >
                                                Manage Models
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    <button
                        onClick={() => onOpenDocs?.()}
                        className={`h-9 w-9 rounded-lg border transition-colors ${theme === 'light' ? 'border-gray-200 text-gray-500 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-500' : 'border-white/10 text-gray-400 hover:border-orange-500/30 hover:bg-orange-500/10 hover:text-orange-400'}`}
                        title="Usage Guide"
                    >
                        <BookOpen size={17} className="mx-auto" />
                    </button>

                    <button
                        onClick={() => onOpenAPIDocs?.()}
                        className={`h-9 w-9 rounded-lg border transition-colors ${theme === 'light' ? 'border-gray-200 text-gray-500 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-500' : 'border-white/10 text-gray-400 hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400'}`}
                        title="API Documentation"
                    >
                        <Shield size={17} className="mx-auto" />
                    </button>

                    {isAuthenticated ? (
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className={`flex h-9 items-center gap-2 rounded-xl border px-2.5 transition-all ${theme === 'light'
                                    ? 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                                    : 'border-white/10 bg-white/5 text-gray-200 hover:border-white/20 hover:bg-white/10'
                                    }`}
                            >
                                <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${theme === 'light' ? 'bg-gray-200 text-gray-600' : 'bg-white/20 text-white'}`}>
                                    {displayName.charAt(0).toUpperCase()}
                                </div>
                                <span className="hidden max-w-[96px] truncate text-sm font-medium sm:block">{displayName}</span>
                                <ChevronDown size={15} className="opacity-60" />
                            </button>

                            {showUserMenu && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                                    <div
                                        className={`absolute right-0 top-[calc(100%+0.5rem)] z-50 w-56 overflow-hidden rounded-xl border shadow-[0_24px_60px_-32px_rgba(0,0,0,0.75)] ${theme === 'light' ? 'border-gray-200 bg-white' : 'border-white/10 bg-[#101010]'
                                            }`}
                                        style={{
                                            animation: 'dropdownExpand 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                                            transformOrigin: 'top right'
                                        }}
                                    >
                                        <div className={`border-b px-4 py-3 ${theme === 'light' ? 'border-gray-100' : 'border-white/10'}`}>
                                            <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Signed in as</p>
                                            <p className={`mt-0.5 truncate text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{user?.email}</p>
                                        </div>
                                        <div className="py-1.5">
                                            <button
                                                onClick={() => {
                                                    onOpenSettings();
                                                    setShowUserMenu(false);
                                                }}
                                                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${theme === 'light' ? 'text-gray-700 hover:bg-gray-50' : 'text-gray-300 hover:bg-white/6'
                                                    }`}
                                            >
                                                <Settings size={16} />
                                                Settings
                                            </button>
                                            <button
                                                onClick={() => {
                                                    onSignOut();
                                                    setShowUserMenu(false);
                                                }}
                                                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-400 transition-colors hover:bg-red-500/10"
                                            >
                                                <LogOut size={16} />
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={onOpenAuth}
                            className="inline-flex h-9 items-center gap-2 rounded-xl bg-orange-500 px-3.5 text-sm font-semibold text-white transition-all hover:bg-orange-600"
                        >
                            <User size={16} />
                            <span className="hidden sm:inline">Sign In</span>
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};


