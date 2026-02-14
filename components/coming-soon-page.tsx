'use client';

import { Rocket, Github, Linkedin, Mail } from 'lucide-react';
import { ThemeSwitcher } from '@/components/theme-switcher';

export function ComingSoonPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-6">
            <Rocket className="h-16 w-16 text-primary" />
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Coming Soon
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            We&apos;re building something amazing
          </p>
          <p className="text-base text-muted-foreground max-w-lg mx-auto">
            This portfolio is currently under development. Check back soon to explore 
            projects, skills, certifications, and more!
          </p>
        </div>

        {/* Social Links Placeholder */}
        <div className="flex justify-center gap-4 pt-8">
          <button 
            className="p-3 rounded-full border border-border hover:bg-accent transition-colors"
            aria-label="GitHub"
          >
            <Github className="h-5 w-5" />
          </button>
          <button 
            className="p-3 rounded-full border border-border hover:bg-accent transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
          </button>
          <button 
            className="p-3 rounded-full border border-border hover:bg-accent transition-colors"
            aria-label="Email"
          >
            <Mail className="h-5 w-5" />
          </button>
        </div>

        {/* Footer */}
        <div className="pt-12 flex items-center justify-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} All rights reserved
          </p>
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
}
