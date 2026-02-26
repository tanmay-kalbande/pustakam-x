export const typographyTokens = {
  display: 'text-[length:var(--type-display)]',
  title: 'text-[length:var(--type-title)]',
  body: 'text-[length:var(--type-body)]',
  meta: 'text-[length:var(--type-meta)]',
} as const;

export const panelTokens = {
  primary: 'panel-primary',
  secondary: 'panel-secondary',
} as const;

export const elevationTokens = {
  low: 'elevation-1',
  medium: 'elevation-2',
  high: 'elevation-3',
} as const;

export const providerCardStyles: Record<string, { card: string; link: string }> = {
  Cerebras: {
    card: 'bg-pink-500/[0.03] border-pink-500/20 hover:border-pink-500/40',
    link: 'text-pink-400 hover:text-pink-300',
  },
  Google: {
    card: 'bg-blue-500/[0.03] border-blue-500/20 hover:border-blue-500/40',
    link: 'text-blue-400 hover:text-blue-300',
  },
  Mistral: {
    card: 'bg-yellow-500/[0.03] border-yellow-500/20 hover:border-yellow-500/40',
    link: 'text-yellow-400 hover:text-yellow-300',
  },
  xAI: {
    card: 'bg-red-500/[0.03] border-red-500/20 hover:border-red-500/40',
    link: 'text-red-400 hover:text-red-300',
  },
  Groq: {
    card: 'bg-purple-500/[0.03] border-purple-500/20 hover:border-purple-500/40',
    link: 'text-purple-400 hover:text-purple-300',
  },
};
