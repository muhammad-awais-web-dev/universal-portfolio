// Environment Variable Checker
// Server-side utility to check environment variable configuration

import { ENV_VARIABLES, CATEGORY_INFO } from './env-schema';

export interface EnvStatus {
  key: string;
  configured: boolean;
  required: boolean;
  category: string;
  description: string;
  setupUrl?: string;
  instructions: string;
}

export interface CategoryStatus {
  category: string;
  name: string;
  description: string;
  total: number;
  configured: number;
  required: number;
  status: 'complete' | 'partial' | 'missing' | 'optional';
  variables: EnvStatus[];
}

export interface SetupStatus {
  totalRequired: number;
  configuredRequired: number;
  totalOptional: number;
  configuredOptional: number;
  progress: number;
  categories: CategoryStatus[];
  isSetupComplete: boolean;
}

/**
 * Check if an environment variable is configured
 */
function isConfigured(key: string): boolean {
  const value = process.env[key];
  return Boolean(value && value.trim().length > 0);
}

/**
 * Check status of all environment variables
 */
export function checkEnvStatus(): SetupStatus {
  const envStatuses: EnvStatus[] = ENV_VARIABLES.map(envVar => ({
    key: envVar.key,
    configured: isConfigured(envVar.key),
    required: envVar.required,
    category: envVar.category,
    description: envVar.description,
    setupUrl: envVar.setupUrl,
    instructions: envVar.instructions,
  }));

  // Group by category
  const categories: CategoryStatus[] = Object.keys(CATEGORY_INFO).map(cat => {
    const categoryVars = envStatuses.filter(v => v.category === cat);
    const required = categoryVars.filter(v => v.required).length;
    const configured = categoryVars.filter(v => v.configured).length;
    const total = categoryVars.length;

    let status: CategoryStatus['status'];
    if (required === 0) {
      status = 'optional';
    } else if (configured === total) {
      status = 'complete';
    } else if (configured > 0) {
      status = 'partial';
    } else {
      status = 'missing';
    }

    return {
      category: cat,
      name: CATEGORY_INFO[cat as keyof typeof CATEGORY_INFO].name,
      description: CATEGORY_INFO[cat as keyof typeof CATEGORY_INFO].description,
      total,
      configured,
      required,
      status,
      variables: categoryVars,
    };
  });

  // Calculate overall progress
  const totalRequired = envStatuses.filter(v => v.required).length;
  const configuredRequired = envStatuses.filter(v => v.required && v.configured).length;
  const totalOptional = envStatuses.filter(v => !v.required).length;
  const configuredOptional = envStatuses.filter(v => !v.required && v.configured).length;
  
  const progress = totalRequired > 0 ? Math.round((configuredRequired / totalRequired) * 100) : 100;
  const isSetupComplete = configuredRequired === totalRequired;

  return {
    totalRequired,
    configuredRequired,
    totalOptional,
    configuredOptional,
    progress,
    categories,
    isSetupComplete,
  };
}
