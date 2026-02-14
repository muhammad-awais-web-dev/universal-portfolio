import { ThemeSwitcher } from "@/components/theme-switcher";
import { EnvStatusDashboard } from "@/components/setup/env-status-dashboard";
import { checkEnvStatus } from "@/lib/setup/env-checker";
import Link from "next/link";

export default function Home() {
  const envStatus = checkEnvStatus();

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"}>My Portfolio</Link>
            </div>
            <ThemeSwitcher />
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-12 max-w-5xl p-5 w-full">
          {/* Environment Status Dashboard */}
          <EnvStatusDashboard status={envStatus} />
          
          {/* Hero Section */}
          <section className="text-center space-y-6 py-12">
            <h1 className="text-5xl font-bold tracking-tight">
              Welcome to My Portfolio
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore my projects, skills, certifications, and experience.
              This portfolio showcases my professional journey and technical expertise.
            </p>
          </section>

          {/* Featured Content Sections */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">📁 Projects</h3>
              <p className="text-sm text-muted-foreground">
                Browse my portfolio of projects showcasing web development,
                design, and technical innovation.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">🛠️ Skills</h3>
              <p className="text-sm text-muted-foreground">
                Discover the technologies and tools I work with, from frontend
                frameworks to backend systems.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">🏆 Certifications</h3>
              <p className="text-sm text-muted-foreground">
                View my professional certifications and credentials that validate
                my expertise.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">💼 Experience</h3>
              <p className="text-sm text-muted-foreground">
                Learn about my professional experience and the companies I've
                worked with.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">🎓 Education</h3>
              <p className="text-sm text-muted-foreground">
                Explore my educational background and academic achievements.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">📧 Contact</h3>
              <p className="text-sm text-muted-foreground">
                Get in touch via email or connect with me on social media
                platforms.
              </p>
            </div>
          </section>

          {/* Note: Actual portfolio data will be loaded here in future implementation */}
          <section className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              Portfolio content coming soon. Data will be loaded from the management system.
            </p>
          </section>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>Personal Portfolio Website</p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
