import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"}>Portfolio Manager</Link>
            </div>
            <ThemeSwitcher />
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-12 max-w-5xl p-5 w-full">
          {/* Hero Section */}
          <section className="text-center space-y-6 py-12">
            <h1 className="text-5xl font-bold tracking-tight">
              Personal Portfolio Manager
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A streamlined application to manage your portfolio data—projects, skills,
              certifications, experience, and education—all in one place.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Button asChild size="lg">
                <Link href="/protected/manage">Manage Portfolio</Link>
              </Button>
            </div>
          </section>

          {/* Features */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">📁 Projects</h3>
              <p className="text-sm text-muted-foreground">
                Showcase your work with detailed project entries, including titles,
                descriptions, live URLs, and repository links.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">🛠️ Skills</h3>
              <p className="text-sm text-muted-foreground">
                Organize your technical skills by category and add custom logos to
                represent your expertise.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">🏆 Certifications</h3>
              <p className="text-sm text-muted-foreground">
                Track your professional certifications with issuing authorities,
                dates, and credential URLs.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">💼 Experience</h3>
              <p className="text-sm text-muted-foreground">
                Document your work history with detailed job descriptions,
                locations, and employment dates.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">🎓 Education</h3>
              <p className="text-sm text-muted-foreground">
                Keep track of your academic background with institutions, degrees,
                and fields of study.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">☁️ Cloud Storage</h3>
              <p className="text-sm text-muted-foreground">
                Leverage Cloudinary for image hosting and Supabase for secure data
                storage.
              </p>
            </div>
          </section>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>Built with Next.js & Supabase</p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
