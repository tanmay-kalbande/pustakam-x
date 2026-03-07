import React, { useState } from 'react';
import { Settings, User, LogOut, ChevronDown, BookOpen, Shield, Sparkles } from 'lucide-react';
import { APISettings, ModelProvider } from '../types';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface TopHeaderProps {
  settings: APISettings;
  onModelChange: (model: string, provider: ModelProvider) => void;
  onOpenSettings: () => void;
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

const MODEL_OPTIONS: { provider: ModelProvider; model: string; name: string }[] = [
  { provider: 'cerebras', model: 'gpt-oss-120b', name: 'GPT-OSS 120B' },
  { provider: 'cerebras', model: 'qwen-3-235b-a22b-instruct-2507', name: 'Qwen 3 235B' },
  { provider: 'cerebras', model: 'zai-glm-4.7', name: 'ZAI GLM 4.7' },
  { provider: 'cerebras', model: 'llama-3.3-70b', name: 'Llama 3.3 70B' },
  { provider: 'cerebras', model: 'llama3.1-8b', name: 'Llama 3.1 8B' },
  { provider: 'google', model: 'gemini-3-flash-preview', name: 'Gemini 3 Flash Preview' },
  { provider: 'google', model: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
  { provider: 'google', model: 'gemma-3-27b-it', name: 'Gemma 3 27B' },
  { provider: 'mistral', model: 'mistral-small-latest', name: 'Mistral Small' },
  { provider: 'mistral', model: 'mistral-medium-latest', name: 'Mistral Medium' },
  { provider: 'mistral', model: 'mistral-large-latest', name: 'Mistral Large' },
  { provider: 'xai', model: 'grok-4.1', name: 'Grok 4.1' },
  { provider: 'xai', model: 'grok-4.1-fast', name: 'Grok 4.1 Fast' },
  { provider: 'xai', model: 'grok-4-fast', name: 'Grok 4 Fast' },
  { provider: 'groq', model: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B' },
  { provider: 'groq', model: 'moonshotai/kimi-k2-instruct-0905', name: 'Kimi K2 Instruct' },
  { provider: 'groq', model: 'groq/compound', name: 'Groq Compound' },
  { provider: 'groq', model: 'openai/gpt-oss-20b', name: 'GPT-OSS 20B' },
  { provider: 'openrouter', model: 'arcee-ai/trinity-large-preview:free', name: 'Trinity Large Preview' },
  { provider: 'openrouter', model: 'arcee-ai/trinity-mini:free', name: 'Trinity Mini' },
  { provider: 'openrouter', model: 'tngtech/deepseek-r1t2-chimera:free', name: 'DeepSeek R1 Chimera' },
  { provider: 'openrouter', model: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free', name: 'Dolphin Mistral 24B' },
  { provider: 'cohere', model: 'command-a-03-2025', name: 'Cohere Command A' },
  { provider: 'cohere', model: 'command-r-plus-08-2024', name: 'Cohere Command R+' },
  { provider: 'minimax', model: 'MiniMax-M2.5', name: 'MiniMax M2.5' },
  { provider: 'minimax', model: 'MiniMax-M2.5-highspeed', name: 'MiniMax M2.5 Highspeed' },
  { provider: 'minimax', model: 'MiniMax-M2.1', name: 'MiniMax M2.1' },
];

export const TopHeader: React.FC<TopHeaderProps> = ({
  settings,
  onModelChange,
  onOpenSettings,
  theme,
  onOpenAuth,
  isAuthenticated,
  user,
  userProfile,
  onSignOut,
  onOpenDocs,
  onOpenAPIDocs,
  showModelSelector = true,
  centerContent,
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

  const availableModels = MODEL_OPTIONS.filter((model) => {
    if (!isProviderEnabled(model.provider)) return false;

    if (settings.defaultGenerationMode === 'blackhole') {
      const allowedModels = [
        'grok-4.1', 'grok-4.1-fast', 'grok-4-fast',
        'mistral-large-latest', 'mistral-medium-latest',
        'llama-3.3-70b-versatile', 'groq/compound', 'openai/gpt-oss-20b', 'moonshotai/kimi-k2-instruct-0905',
        'qwen-3-235b-a22b-instruct-2507', 'zai-glm-4.7', 'llama-3.3-70b', 'llama3.1-8b',
        'gemma-3-27b-it',
        'arcee-ai/trinity-large-preview:free', 'arcee-ai/trinity-mini:free', 'tngtech/deepseek-r1t2-chimera:free', 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
        'command-a-03-2025', 'command-r-plus-08-2024',
        'MiniMax-M2.5', 'MiniMax-M2.5-highspeed', 'MiniMax-M2.1',
      ];
      return allowedModels.includes(model.model);
    }

    return true;
  });

  const currentModelName = MODEL_OPTIONS.find((model) => model.model === settings.selectedModel)?.name || settings.selectedModel || 'Select Model';

  const chromeClass = theme === 'light'
    ? 'bg-[color:var(--header-surface)] border-[color:var(--header-border)] text-slate-800 shadow-[var(--shadow-soft)]'
    : 'bg-[color:var(--header-surface)] border-[color:var(--header-border)] text-white shadow-[var(--shadow-soft)]';

  const subtleButtonClass = theme === 'light'
    ? 'border-black/10 bg-white/75 text-slate-600 hover:border-orange-300/70 hover:bg-white hover:text-slate-900'
    : 'border-white/10 bg-white/[0.04] text-white/70 hover:border-white/20 hover:bg-white/[0.08] hover:text-white';

  const menuClass = theme === 'light'
    ? 'border-black/10 bg-[color:var(--glass-bg-strong)] text-slate-800 shadow-[var(--shadow-strong)]'
    : 'border-white/10 bg-[color:var(--glass-bg-strong)] text-white shadow-[var(--shadow-strong)]';

  return (
    <header
      className="header-with-fade fixed inset-x-0 top-0 z-50"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="px-3 sm:px-4 md:px-6 pt-3">
        <div className={`mx-auto flex h-[var(--header-height)] w-full max-w-[1460px] items-center gap-3 rounded-[1.4rem] border px-3.5 sm:px-4 md:px-5 ${chromeClass}`}>
          <div className="flex min-w-0 items-center gap-3 select-none">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/16 to-amber-500/8 shadow-[0_14px_32px_-22px_rgba(249,115,22,0.65)]">
              <img src={theme === 'light' ? '/black-logo.png' : '/white-logo.png'} alt="Pustakam" className="h-6 w-6" />
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border border-black/10 bg-orange-500" />
            </div>
            <div className="min-w-0 leading-none">
              <div className="flex items-center gap-2">
                <span className="truncate text-[15px] font-bold tracking-tight sm:text-base">Pustakam</span>
                <span className={`hidden rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.24em] md:inline-flex ${theme === 'light' ? 'bg-orange-500/10 text-orange-600' : 'bg-orange-500/12 text-orange-300'}`}>
                  Studio
                </span>
              </div>
              <span className={`mt-1 block truncate text-[10px] uppercase tracking-[0.22em] ${theme === 'light' ? 'text-slate-500' : 'text-white/42'}`}>
                AI Publishing Engine
              </span>
            </div>
          </div>

          <div className="hidden min-w-0 flex-1 items-center justify-center px-4 md:flex">
            {centerContent ? (
              <div className={`rounded-full border px-4 py-1.5 text-sm ${theme === 'light' ? 'border-black/8 bg-white/68 text-slate-700' : 'border-white/10 bg-white/[0.04] text-white/80'}`}>
                {centerContent}
              </div>
            ) : (
              <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] ${theme === 'light' ? 'border-black/8 bg-white/68 text-slate-500' : 'border-white/10 bg-white/[0.04] text-white/42'}`}>
                <Sparkles className="h-3.5 w-3.5 text-orange-500" />
                Professional book generation
              </div>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2">
            {showModelSelector && (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setShowModelMenu((open) => !open)}
                  className={`flex h-10 items-center gap-2.5 rounded-2xl border px-3.5 transition-all ${subtleButtonClass}`}
                >
                  <span className={`hidden text-[10px] uppercase tracking-[0.22em] lg:block ${theme === 'light' ? 'text-slate-400' : 'text-white/35'}`}>
                    Model
                  </span>
                  <span className="max-w-[122px] truncate text-sm font-medium sm:max-w-[160px]">{currentModelName}</span>
                  <ChevronDown size={15} className={`transition-transform ${showModelMenu ? 'rotate-180' : ''}`} />
                </button>

                {showModelMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowModelMenu(false)} />
                    <div className={`absolute right-0 top-[calc(100%+0.7rem)] z-50 w-[min(25rem,calc(100vw-2rem))] overflow-hidden rounded-[1.5rem] border ${menuClass}`}>
                      <div className={`flex items-center justify-between border-b px-4 py-3 ${theme === 'light' ? 'border-black/8' : 'border-white/10'}`}>
                        <div>
                          <p className={`text-[10px] font-semibold uppercase tracking-[0.22em] ${theme === 'light' ? 'text-slate-500' : 'text-white/42'}`}>Available Models</p>
                          <p className={`mt-1 text-xs ${theme === 'light' ? 'text-slate-600' : 'text-white/60'}`}>Configured providers only</p>
                        </div>
                        <button
                          onClick={() => {
                            onOpenSettings();
                            setShowModelMenu(false);
                          }}
                          className={`rounded-full border px-3 py-1 text-[11px] font-medium ${subtleButtonClass}`}
                        >
                          Manage
                        </button>
                      </div>
                      <div className="max-h-[360px] overflow-y-auto p-2">
                        {availableModels.length === 0 ? (
                          <div className="px-4 py-8 text-center">
                            <p className={`mb-3 text-sm ${theme === 'light' ? 'text-slate-600' : 'text-white/75'}`}>No API keys configured yet.</p>
                            <button
                              onClick={() => {
                                onOpenSettings();
                                setShowModelMenu(false);
                              }}
                              className="btn btn-primary"
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
                                className={`flex w-full items-center justify-between gap-3 rounded-2xl px-3.5 py-3 text-left transition-colors ${isSelected
                                  ? theme === 'light'
                                    ? 'bg-orange-500/10 text-slate-900'
                                    : 'bg-orange-500/10 text-white'
                                  : theme === 'light'
                                    ? 'text-slate-600 hover:bg-black/[0.035] hover:text-slate-900'
                                    : 'text-white/72 hover:bg-white/[0.05] hover:text-white'
                                }`}
                              >
                                <div className="min-w-0">
                                  <div className="truncate text-sm font-medium">{option.name}</div>
                                  <div className={`mt-1 text-[10px] uppercase tracking-[0.18em] ${theme === 'light' ? 'text-slate-400' : 'text-white/35'}`}>{option.provider}</div>
                                </div>
                                {isSelected && <span className="h-2 w-2 rounded-full bg-orange-500" />}
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            <button
              onClick={() => onOpenDocs?.()}
              className={`flex h-10 w-10 items-center justify-center rounded-2xl border transition-all ${subtleButtonClass}`}
              title="Usage Guide"
            >
              <BookOpen size={17} />
            </button>

            <button
              onClick={() => onOpenAPIDocs?.()}
              className={`flex h-10 w-10 items-center justify-center rounded-2xl border transition-all ${subtleButtonClass}`}
              title="API Documentation"
            >
              <Shield size={17} />
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu((open) => !open)}
                  className={`flex h-10 items-center gap-2 rounded-2xl border pl-2.5 pr-3 transition-all ${subtleButtonClass}`}
                >
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold ${theme === 'light' ? 'bg-slate-900 text-white' : 'bg-white/14 text-white'}`}>
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden max-w-[104px] truncate text-sm font-medium sm:block">{displayName}</span>
                  <ChevronDown size={15} className={`transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <div className={`absolute right-0 top-[calc(100%+0.7rem)] z-50 w-64 overflow-hidden rounded-[1.5rem] border ${menuClass}`}>
                      <div className={`border-b px-4 py-3 ${theme === 'light' ? 'border-black/8' : 'border-white/10'}`}>
                        <p className={`text-[10px] font-semibold uppercase tracking-[0.22em] ${theme === 'light' ? 'text-slate-500' : 'text-white/42'}`}>Signed in as</p>
                        <p className="mt-1 truncate text-sm font-medium">{user?.email}</p>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={() => {
                            onOpenSettings();
                            setShowUserMenu(false);
                          }}
                          className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-left text-sm transition-colors ${theme === 'light' ? 'text-slate-700 hover:bg-black/[0.035]' : 'text-white/80 hover:bg-white/[0.05]'}`}
                        >
                          <Settings size={16} />
                          Settings
                        </button>
                        <button
                          onClick={() => {
                            onSignOut();
                            setShowUserMenu(false);
                          }}
                          className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-left text-sm text-red-400 transition-colors hover:bg-red-500/10"
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
                className="inline-flex h-10 items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 text-sm font-semibold text-white shadow-[0_18px_34px_-22px_rgba(249,115,22,0.65)] transition-all hover:translate-y-[-1px] hover:from-orange-600 hover:to-amber-500"
              >
                <User size={16} />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
