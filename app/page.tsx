import { Suspense } from "react";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth/session";
import { checkCriticalEnvVars } from "@/lib/settings";
import { isEmailConfigured } from "@/lib/utils/email-config";
import HomePage from "@/components/home-page";

async function HomeContent() {
  // Check authentication status
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;
  const isAdmin = sessionToken ? await verifySession(sessionToken) : false;

  // Check if critical env vars are missing
  const { isValid: envValid, missing: missingVars } = checkCriticalEnvVars();

  // ENVIRONMENT=development (case-insensitive) forces dev mode
  const envFlag = (process.env.ENVIRONMENT || '').toLowerCase();
  const forceDevMode = !envValid || envFlag === 'development';

  return (
    <HomePage 
      isAdmin={isAdmin} 
      forceDevMode={forceDevMode} 
      missingVars={missingVars}
      isEmailConfigured={isEmailConfigured()}
    />
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
