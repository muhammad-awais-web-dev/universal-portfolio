import { Suspense } from "react";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth/session";
import { checkCriticalEnvVars } from "@/lib/settings";
import { isEmailConfigured } from "@/lib/utils/email-config";
import { getLiveSetting } from "@/lib/settings/live";
import HomePage from "@/components/home-page";

async function HomeContent() {
  // Check authentication status
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;
  const isAdmin = sessionToken ? await verifySession(sessionToken) : false;

  // Check if critical env vars are missing — if so, always force dev mode
  const { isValid: envValid, missing: missingVars } = checkCriticalEnvVars();

  // Read dev_mode live from DB (never cached — must take effect immediately)
  // Fall back to env var ENVIRONMENT=development for local dev without DB
  const dbDevMode = await getLiveSetting('dev_mode').catch(() => false);
  const envFlag = (process.env.ENVIRONMENT || '').toLowerCase();
  const forceDevMode = !envValid || envFlag === 'development' || dbDevMode === true;

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
