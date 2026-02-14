import { NavBarWrapper } from "@/components/admin/navbar-wrapper";
import { GitHubPromoBanner } from "@/components/github-promo-banner";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <NavBarWrapper />
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          {children}
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>Portfolio Management System</p>
        </footer>
      </div>
      
      {/* GitHub Promo Banner - Fixed bottom-right */}
      <GitHubPromoBanner />
    </main>
  );
}
