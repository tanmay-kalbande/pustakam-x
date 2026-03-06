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

    // Check if provider has API key configured
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

    // Filter models to only show those with configured API keys
    const availableModels = MODEL_OPTIONS.filter(m => {
        const hasKey = isProviderEnabled(m.provider);
        if (!hasKey) return false;

        // Strict filtering for Blackhole/Desi modes (Multilingual Giants)
        if (settings.defaultGenerationMode === 'blackhole') {
            const allowedModels = [
                'grok-4.1', 'grok-4.1-fast', 'grok-4-fast', // xAI (Real-time chaos)
                'mistral-large-latest', 'mistral-medium-latest', // Mistral (Creative hooks)
                'llama-3.3-70b-versatile', 'groq/compound', 'openai/gpt-oss-20b', 'moonshotai/kimi-k2-instruct-0905', // Groq (Speed + Indic tunes)
                'qwen-3-235b-a22b-instruct-2507', 'zai-glm-4.7', 'llama-3.3-70b', 'llama3.1-8b', // Cerebras (Multilingual Kings / Raw)
                'gemma-3-27b-it', // Google Gemma (Multilingual Beast)
                'arcee-ai/trinity-large-preview:free', 'arcee-ai/trinity-mini:free', 'tngtech/deepseek-r1t2-chimera:free', 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free', // OpenRouter Models
                'command-a-03-2025', 'command-r-plus-08-2024', // Cohere Models
                'MiniMax-M2.5', 'MiniMax-M2.5-highspeed', 'MiniMax-M2.1' // MiniMax Models
            ];
            return allowedModels.includes(m.model);
        }

        return true;
    });

    // Get current model display name
    const currentModelName = MODEL_OPTIONS.find(m => m.model === settings.selectedModel)?.name || settings.selectedModel || 'Select Model';


    return (
        <>
            {/* Grok-style header with smooth fade */}
            <header className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-4 ${theme === 'light' ? 'bg-gradient-to-b from-white via-white/80 to-transparent pb-8' : 'bg-gradient-to-b from-black via-black/80 to-transparent pb-8'}`} style={{ paddingTop: 'env(safe-area-inset-top, 1rem)' }}>
                <div className="flex items-center justify-between mt-2">
                    {/* Brand / Logo */}
                    <div className="flex items-center gap-2 select-none">
                        <img src={theme === 'light' ? '/black-logo.png' : '/white-logo.png'} alt="Pustakam" className="w-[33px] h-[33px] md:w-8 md:h-8" />
                        <div className="flex flex-col">
                            <span
                                className={`text-base md:text-lg tracking-tight leading-none ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}
                                style={{ fontFamily: "'Aptos-Mono', monospace", fontWeight: 700 }}
                            >
                                Pustakam
                            </span>
                            <span
                                className={`text-[10px] tracking-wide ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}
                                style={{ fontFamily: "'Aptos-Mono', monospace" }}
                            >
                                injin
                            </span>
                        </div>
                    </div>

                    {/* Center Content */}
                    <div className="flex-1 flex justify-center">
                        {centerContent}
                    </div>

                    {/* Right Controls */}
                    <div className="flex items-center gap-3">
                        {/* Grok-style Model Selector */}
                        {showModelSelector && (
                            <div className="relative">
                                {/* Desktop Model Selector */}
                                <button
                                    onClick={() => setShowModelMenu(!showModelMenu)}
                                    className={`hidden md:flex items-center gap-2 pl-4 pr-3 py-2 rounded-full transition-all text-sm font-medium
                            ${theme === 'light'
                                            ? 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                                            : 'bg-[#1a1a1a] hover:bg-[#252525] text-gray-200'}
                        `}
                                >
                                    <span>{currentModelName}</span>
                                    <ChevronDown size={14} className={`opacity-50 transition-transform ${showModelMenu ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Mobile Model Selector */}
                                <button
                                    onClick={() => setShowModelMenu(!showModelMenu)}
                                    className={`flex md:hidden items-center gap-1.5 px-3 py-1.5 rounded-full transition-all text-xs font-medium
                                            ${theme === 'light'
                                            ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                            : 'bg-[#1a1a1a] hover:bg-[#252525] text-gray-300'}`}
                                >
                                    <span className="max-w-[100px] truncate">{currentModelName}</span>
                                    <ChevronDown size={12} className={`opacity-50 transition-transform flex-shrink-0 ${showModelMenu ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Shared Model Dropdown (renders below whichever button is visible) */}
                                {showModelMenu && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowModelMenu(false)} />
                                        <div
                                            className={`fixed md:absolute top-auto md:top-full right-4 md:right-0 mt-2 w-[calc(100vw-2rem)] md:w-64 rounded-xl shadow-2xl overflow-hidden z-50
                                    ${theme === 'light'
                                                    ? 'bg-white border border-gray-200'
                                                    : 'bg-[#1a1a1a] border border-white/10'}`}
                                            style={{
                                                animation: 'dropdownExpand 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                                                transformOrigin: 'top right'
                                            }}
                                        >
                                            <div className={`px-4 py-2 border-b ${theme === 'light' ? 'border-gray-100' : 'border-white/5'}`}>
                                                <p className={`text-xs font-medium uppercase tracking-wider ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>Model</p>
                                            </div>
                                            <div className="max-h-[300px] overflow-y-auto py-1">
                                                {availableModels.length === 0 ? (
                                                    <div className={`px-4 py-8 text-center ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                                        <p className="text-sm mb-3">No API keys configured</p>
                                                        <button
                                                            onClick={() => { onOpenSettings(); setShowModelMenu(false); }}
                                                            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 transition-colors"
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
                                                                className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors
                                                        ${isSelected
                                                                        ? (theme === 'light' ? 'bg-gray-50 text-gray-900' : 'bg-white/5 text-white')
                                                                        : (theme === 'light' ? 'text-gray-600 hover:bg-gray-50 hover:text-gray-900' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200')}
                                                    `}
                                                            >
                                                                <div>
                                                                    <div className="font-medium">{option.name}</div>
                                                                    <div className="text-[10px] opacity-50 uppercase tracking-wider mt-0.5">
                                                                        {option.provider}
                                                                    </div>
                                                                </div>
                                                                {isSelected && (
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                                                )}
                                                            </button>
                                                        );
                                                    })
                                                )}
                                            </div>
                                            <div className={`border-t ${theme === 'light' ? 'border-gray-100' : 'border-white/5'} p-2`}>
                                                <button
                                                    onClick={() => {
                                                        onOpenSettings();
                                                        setShowModelMenu(false);
                                                    }}
                                                    className={`w-full text-center px-3 py-2 text-xs font-medium rounded-lg transition-colors
                                            ${theme === 'light' ? 'text-gray-500 hover:bg-gray-100 hover:text-gray-900' : 'text-gray-400 hover:bg-white/5 hover:text-white'}
                                        `}
                                                >
                                                    Manage Models
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}



                        {/* Usage Guide Quick Link */}
                        <button
                            onClick={onOpenDocs}
                            className={`p-2 rounded-lg transition-colors ${theme === 'light' ? 'text-gray-400 hover:text-orange-500 hover:bg-orange-50' : 'text-gray-500 hover:text-orange-400 hover:bg-white/5'}`}
                            title="Usage Guide"
                        >
                            <BookOpen size={20} />
                        </button>

                        {/* API Documentation Quick Link */}
                        <button
                            onClick={onOpenAPIDocs}
                            className={`p-2 rounded-lg transition-colors ${theme === 'light' ? 'text-gray-400 hover:text-emerald-500 hover:bg-emerald-50' : 'text-gray-500 hover:text-emerald-400 hover:bg-white/5'}`}
                            title="API Documentation"
                        >
                            <Shield size={20} />
                        </button>

                        {/* Auth State */}
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all border
                                ${theme === 'light'
                                            ? 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                                            : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 text-gray-200'}
                            `}
                                >
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${theme === 'light' ? 'bg-gray-200 text-gray-600' : 'bg-white/20 text-white'}`}>
                                        {displayName.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-medium max-w-[100px] truncate hidden sm:block">{displayName}</span>
                                    <ChevronDown size={16} className="opacity-50" />
                                </button>

                                {showUserMenu && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                                        <div className={`absolute top-full right-0 mt-2 w-52 rounded-xl border shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200
                                    ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#1a1a1a] border-white/10'}`}
                                            style={{
                                                animation: 'dropdownExpand 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                                                transformOrigin: 'top right'
                                            }}
                                        >
                                            <div className={`px-4 py-3 border-b ${theme === 'light' ? 'border-gray-100' : 'border-white/5'}`}>
                                                <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>Signed in as</p>
                                                <p className={`text-sm font-medium truncate mt-0.5 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{user?.email}</p>
                                            </div>
                                            <div className="py-1">
                                                <button
                                                    onClick={() => {
                                                        onOpenSettings();
                                                        setShowUserMenu(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors
                                            ${theme === 'light' ? 'text-gray-700 hover:bg-gray-50' : 'text-gray-300 hover:bg-white/5'}`}
                                                >
                                                    <Settings size={16} />
                                                    Settings
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        onSignOut();
                                                        setShowUserMenu(false);
                                                    }}
                                                    className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-3 transition-colors"
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
                                className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-semibold shadow-lg hover:shadow-orange-500/20 transition-all"
                            >
                                <User size={18} />
                                <span>Sign In</span>
                            </button>
                        )}

                    </div>
                </div>
            </header >
        </>
    );
};
