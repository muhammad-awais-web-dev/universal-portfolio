export interface ValidationResult {
  isValid: boolean;
  message: string;
  details?: string;
}

export interface CredentialValidation {
  supabase: ValidationResult;
  cloudinary: ValidationResult;
  loading: boolean;
}

export async function validateSupabaseCredentials(): Promise<ValidationResult> {
  try {
    const response = await fetch('/api/auth/session');
    
    if (response.ok) {
      return {
        isValid: true,
        message: 'Supabase connection successful',
      };
    } else {
      return {
        isValid: false,
        message: 'Supabase connection failed',
        details: `Status: ${response.status}`,
      };
    }
  } catch (error) {
    return {
      isValid: false,
      message: 'Supabase connection error',
      details: (error as Error).message,
    };
  }
}

export async function validateCloudinaryCredentials(): Promise<ValidationResult> {
  try {
    const response = await fetch('/api/cloudinary/list');
    
    if (response.ok) {
      return {
        isValid: true,
        message: 'Cloudinary connection successful',
      };
    } else {
      const data = await response.json();
      return {
        isValid: false,
        message: 'Cloudinary connection failed',
        details: data.error || `Status: ${response.status}`,
      };
    }
  } catch (error) {
    return {
      isValid: false,
      message: 'Cloudinary connection error',
      details: (error as Error).message,
    };
  }
}

export async function validateAllCredentials(): Promise<CredentialValidation> {
  const [supabase, cloudinary] = await Promise.all([
    validateSupabaseCredentials(),
    validateCloudinaryCredentials(),
  ]);

  return {
    supabase,
    cloudinary,
    loading: false,
  };
}
