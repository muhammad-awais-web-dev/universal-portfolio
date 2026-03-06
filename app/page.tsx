import { getCachedPublicSettings } from "@/lib/cache/settings-cache";
import HomePage from "@/components/home-page";

export const dynamic = 'force-static';

export default async function Home() {
  const { forceDevMode, missingVars, isEmailConfigured } = await getCachedPublicSettings();

  return (
    <HomePage
      forceDevMode={forceDevMode}
      missingVars={missingVars}
      isEmailConfigured={isEmailConfigured}
    />
  );
}
