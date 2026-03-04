export interface PortfolioSettings {
  mcpEnabled: boolean;
  websiteName: string;
  logo: string | null;
  favicon: string | null;
  globalLibrary: string | null;
}

export const DEFAULT_SETTINGS: PortfolioSettings = {
  mcpEnabled: false,
  websiteName: 'My Portfolio',
  logo: null,
  favicon: null,
  globalLibrary: null,
};

const SETTINGS_KEY = 'portfolio_settings';

/**
 * Check if critical environment variables are present
 * These vars are required for the portfolio to function
 */
export function checkCriticalEnvVars(): { isValid: boolean; missing: string[] } {
  const criticalVars = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'ADMIN_PASSPHRASE',
  ];

  const missing: string[] = [];
  
  for (const varName of criticalVars) {
    const value = process.env[varName];
    if (!value || value.trim() === '') {
      missing.push(varName);
    }
  }

  return {
    isValid: missing.length === 0,
    missing,
  };
}

export function getSettings(): PortfolioSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (!stored) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(stored);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch (error) {
    console.error('Error loading settings:', error);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: PortfolioSettings): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

export function updateSettings(partial: Partial<PortfolioSettings>): PortfolioSettings {
  const current = getSettings();
  const updated = { ...current, ...partial };
  saveSettings(updated);
  return updated;
}
