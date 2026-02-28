"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { PortfolioProvider } from "@/components/admin/portfolio-context";
import { BioForm } from "@/components/admin/bio-form";
import { ProjectForm } from "@/components/admin/project-form";
import { SkillForm } from "@/components/admin/skill-form";
import { CertificationForm } from "@/components/admin/certification-form";
import { ExperienceForm } from "@/components/admin/experience-form";
import { EducationForm } from "@/components/admin/education-form";
import { TestimonialForm } from "@/components/admin/testimonial-form";

type Section = "bio" | "projects" | "skills" | "certifications" | "experience" | "education" | "testimonials";
const VALID_SECTIONS: Section[] = ["bio", "projects", "skills", "certifications", "experience", "education", "testimonials"];

function ManageContent() {
  const searchParams = useSearchParams();
  const raw = searchParams.get("section") ?? "bio";
  const section: Section = VALID_SECTIONS.includes(raw as Section) ? (raw as Section) : "bio";

  return (
    <PortfolioProvider>
      <div className="py-2">
        {section === "bio" && <BioForm />}
        {section === "projects" && <ProjectForm />}
        {section === "skills" && <SkillForm />}
        {section === "certifications" && <CertificationForm />}
        {section === "experience" && <ExperienceForm />}
        {section === "education" && <EducationForm />}
        {section === "testimonials" && <TestimonialForm />}
      </div>
    </PortfolioProvider>
  );
}

export default function ManagePage() {
  return (
    <Suspense fallback={<div className="text-sm text-muted-foreground">Loading…</div>}>
      <ManageContent />
    </Suspense>
  );
}

