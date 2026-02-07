"use client";

import { useState } from "react";
import { PortfolioProvider } from "@/components/admin/portfolio-context";
import { BioForm } from "@/components/admin/bio-form";
import { ProjectForm } from "@/components/admin/project-form";
import { SkillForm } from "@/components/admin/skill-form";
import { CertificationForm } from "@/components/admin/certification-form";
import { ExperienceForm } from "@/components/admin/experience-form";
import { EducationForm } from "@/components/admin/education-form";
import { Button } from "@/components/ui/button";

type Tab = "bio" | "projects" | "skills" | "certifications" | "experience" | "education";

export default function ManagePage() {
  const [activeTab, setActiveTab] = useState<Tab>("bio");

  const tabs: { id: Tab; label: string }[] = [
    { id: "bio", label: "Bio" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "certifications", label: "Certifications" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
  ];

  return (
    <PortfolioProvider>
      <div className="w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Portfolio Management</h1>
          <p className="text-muted-foreground">
            Manage your portfolio content, projects, skills, and professional information.
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b mb-6">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                onClick={() => setActiveTab(tab.id)}
                className="whitespace-nowrap"
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="py-4">
          {activeTab === "bio" && <BioForm />}
          {activeTab === "projects" && <ProjectForm />}
          {activeTab === "skills" && <SkillForm />}
          {activeTab === "certifications" && <CertificationForm />}
          {activeTab === "experience" && <ExperienceForm />}
          {activeTab === "education" && <EducationForm />}
        </div>
      </div>
    </PortfolioProvider>
  );
}
