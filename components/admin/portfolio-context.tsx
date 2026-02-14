"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import {
  Project,
  Skill,
  SkillCategory,
  ProjectCategory,
  Certification,
  Education,
  Experience,
  Testimonial,
  Profile,
  ProjectFormData,
  SkillFormData,
  SkillCategoryFormData,
  ProjectCategoryFormData,
  CertificationFormData,
  EducationFormData,
  ExperienceFormData,
  TestimonialFormData,
  ProfileFormData,
} from "@/lib/models/portfolio";

// Default profile id used by the DB seed row
const DEFAULT_PROFILE_ID = "00000000-0000-0000-0000-000000000000";

interface PortfolioContextType {
  // Loading / error state
  isLoading: boolean;
  error: string | null;

  // Profile
  profile: Profile | null;
  updateProfile: (profile: ProfileFormData) => Promise<void>;

  // Projects
  projects: Project[];
  addProject: (project: ProjectFormData) => Promise<void>;
  updateProject: (id: number, project: Partial<ProjectFormData>) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;

  // Project Categories
  projectCategories: ProjectCategory[];
  addProjectCategory: (category: ProjectCategoryFormData) => Promise<void>;
  updateProjectCategory: (id: number, category: Partial<ProjectCategoryFormData>) => Promise<void>;
  deleteProjectCategory: (id: number) => Promise<void>;

  // Skills
  skills: Skill[];
  addSkill: (skill: SkillFormData) => Promise<void>;
  updateSkill: (id: number, skill: Partial<SkillFormData>) => Promise<void>;
  deleteSkill: (id: number) => Promise<void>;

  // Skill Categories
  skillCategories: SkillCategory[];
  addSkillCategory: (category: SkillCategoryFormData) => Promise<void>;
  updateSkillCategory: (id: number, category: Partial<SkillCategoryFormData>) => Promise<void>;
  deleteSkillCategory: (id: number) => Promise<void>;

  // Certifications
  certifications: Certification[];
  addCertification: (certification: CertificationFormData) => Promise<void>;
  updateCertification: (id: number, certification: Partial<CertificationFormData>) => Promise<void>;
  deleteCertification: (id: number) => Promise<void>;

  // Education
  education: Education[];
  addEducation: (education: EducationFormData) => Promise<void>;
  updateEducation: (id: number, education: Partial<EducationFormData>) => Promise<void>;
  deleteEducation: (id: number) => Promise<void>;

  // Experience
  experiences: Experience[];
  addExperience: (experience: ExperienceFormData) => Promise<void>;
  updateExperience: (id: number, experience: Partial<ExperienceFormData>) => Promise<void>;
  deleteExperience: (id: number) => Promise<void>;

  // Testimonials
  testimonials: Testimonial[];
  addTestimonial: (testimonial: TestimonialFormData) => Promise<void>;
  updateTestimonial: (id: number, testimonial: Partial<TestimonialFormData>) => Promise<void>;
  deleteTestimonial: (id: number) => Promise<void>;

  // Refresh all data from server
  refresh: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function api<T = unknown>(url: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(opts?.headers ?? {}) },
    ...opts,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.details ?? json?.error ?? res.statusText);
  return json as T;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectCategories, setProjectCategories] = useState<ProjectCategory[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  // Fetch all data from the combined endpoint
  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api<{
        profile: Profile | null;
        projects: Project[];
        skills: Skill[];
        skillCategories: SkillCategory[];
        projectCategories: ProjectCategory[];
        certifications: Certification[];
        education: Education[];
        experience: Experience[];
        testimonials: Testimonial[];
      }>("/api/portfolio");

      setProfile(data.profile);
      setProjects(data.projects ?? []);
      setSkills(data.skills ?? []);
      setSkillCategories(data.skillCategories ?? []);
      setProjectCategories(data.projectCategories ?? []);
      setCertifications(data.certifications ?? []);
      setEducation(data.education ?? []);
      setExperiences(data.experience ?? []);
      setTestimonials(data.testimonials ?? []);
    } catch (err) {
      console.error("Failed to load portfolio:", err);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // -------------------------------------------------------------------------
  // Profile
  // -------------------------------------------------------------------------
  const updateProfileAction = async (profileData: ProfileFormData) => {
    const { profile: saved } = await api<{ profile: Profile }>("/api/portfolio/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
    setProfile(saved);
  };

  // -------------------------------------------------------------------------
  // Projects
  // -------------------------------------------------------------------------
  const addProject = async (projectData: ProjectFormData) => {
    const { project: saved } = await api<{ project: Project }>("/api/portfolio/projects", {
      method: "POST",
      body: JSON.stringify({ ...projectData, owner_id: DEFAULT_PROFILE_ID }),
    });
    setProjects((prev) => [saved, ...prev]);
  };

  const updateProjectAction = async (id: number, projectData: Partial<ProjectFormData>) => {
    const { project: saved } = await api<{ project: Project }>(`/api/portfolio/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(projectData),
    });
    setProjects((prev) => prev.map((p) => (p.id === id ? saved : p)));
  };

  const deleteProjectAction = async (id: number) => {
    await api(`/api/portfolio/projects/${id}`, { method: "DELETE" });
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  // -------------------------------------------------------------------------
  // Project Categories
  // -------------------------------------------------------------------------
  const addProjectCategory = async (categoryData: ProjectCategoryFormData) => {
    const { category: saved } = await api<{ category: ProjectCategory }>("/api/portfolio/project-categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    });
    setProjectCategories((prev) => [...prev, saved]);
  };

  const updateProjectCategoryAction = async (id: number, categoryData: Partial<ProjectCategoryFormData>) => {
    const { category: saved } = await api<{ category: ProjectCategory }>(`/api/portfolio/project-categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    });
    setProjectCategories((prev) => prev.map((c) => (c.id === id ? saved : c)));
  };

  const deleteProjectCategoryAction = async (id: number) => {
    await api(`/api/portfolio/project-categories/${id}`, { method: "DELETE" });
    setProjectCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // -------------------------------------------------------------------------
  // Skills
  // -------------------------------------------------------------------------
  const addSkill = async (skillData: SkillFormData) => {
    const { skill: saved } = await api<{ skill: Skill }>("/api/portfolio/skills", {
      method: "POST",
      body: JSON.stringify(skillData),
    });
    setSkills((prev) => [...prev, saved]);
  };

  const updateSkillAction = async (id: number, skillData: Partial<SkillFormData>) => {
    const { skill: saved } = await api<{ skill: Skill }>(`/api/portfolio/skills/${id}`, {
      method: "PUT",
      body: JSON.stringify(skillData),
    });
    setSkills((prev) => prev.map((s) => (s.id === id ? saved : s)));
  };

  const deleteSkillAction = async (id: number) => {
    await api(`/api/portfolio/skills/${id}`, { method: "DELETE" });
    setSkills((prev) => prev.filter((s) => s.id !== id));
  };

  // -------------------------------------------------------------------------
  // Skill Categories
  // -------------------------------------------------------------------------
  const addSkillCategory = async (categoryData: SkillCategoryFormData) => {
    const { category: saved } = await api<{ category: SkillCategory }>("/api/portfolio/skill-categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    });
    setSkillCategories((prev) => [...prev, saved]);
  };

  const updateSkillCategoryAction = async (id: number, categoryData: Partial<SkillCategoryFormData>) => {
    const { category: saved } = await api<{ category: SkillCategory }>(`/api/portfolio/skill-categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    });
    setSkillCategories((prev) => prev.map((c) => (c.id === id ? saved : c)));
  };

  const deleteSkillCategoryAction = async (id: number) => {
    await api(`/api/portfolio/skill-categories/${id}`, { method: "DELETE" });
    setSkillCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // -------------------------------------------------------------------------
  // Certifications
  // -------------------------------------------------------------------------
  const addCertification = async (certData: CertificationFormData) => {
    const { certification: saved } = await api<{ certification: Certification }>("/api/portfolio/certifications", {
      method: "POST",
      body: JSON.stringify({ ...certData, profile_id: DEFAULT_PROFILE_ID }),
    });
    setCertifications((prev) => [saved, ...prev]);
  };

  const updateCertificationAction = async (id: number, certData: Partial<CertificationFormData>) => {
    const { certification: saved } = await api<{ certification: Certification }>(
      `/api/portfolio/certifications/${id}`,
      { method: "PUT", body: JSON.stringify(certData) }
    );
    setCertifications((prev) => prev.map((c) => (c.id === id ? saved : c)));
  };

  const deleteCertificationAction = async (id: number) => {
    await api(`/api/portfolio/certifications/${id}`, { method: "DELETE" });
    setCertifications((prev) => prev.filter((c) => c.id !== id));
  };

  // -------------------------------------------------------------------------
  // Education
  // -------------------------------------------------------------------------
  const addEducation = async (eduData: EducationFormData) => {
    const { education: saved } = await api<{ education: Education }>("/api/portfolio/education", {
      method: "POST",
      body: JSON.stringify({ ...eduData, profile_id: DEFAULT_PROFILE_ID }),
    });
    setEducation((prev) => [saved, ...prev]);
  };

  const updateEducationAction = async (id: number, eduData: Partial<EducationFormData>) => {
    const { education: saved } = await api<{ education: Education }>(`/api/portfolio/education/${id}`, {
      method: "PUT",
      body: JSON.stringify(eduData),
    });
    setEducation((prev) => prev.map((e) => (e.id === id ? saved : e)));
  };

  const deleteEducationAction = async (id: number) => {
    await api(`/api/portfolio/education/${id}`, { method: "DELETE" });
    setEducation((prev) => prev.filter((e) => e.id !== id));
  };

  // -------------------------------------------------------------------------
  // Experience
  // -------------------------------------------------------------------------
  const addExperience = async (expData: ExperienceFormData) => {
    const { experience: saved } = await api<{ experience: Experience }>("/api/portfolio/experience", {
      method: "POST",
      body: JSON.stringify({ ...expData, profile_id: DEFAULT_PROFILE_ID }),
    });
    setExperiences((prev) => [saved, ...prev]);
  };

  const updateExperienceAction = async (id: number, expData: Partial<ExperienceFormData>) => {
    const { experience: saved } = await api<{ experience: Experience }>(`/api/portfolio/experience/${id}`, {
      method: "PUT",
      body: JSON.stringify(expData),
    });
    setExperiences((prev) => prev.map((e) => (e.id === id ? saved : e)));
  };

  const deleteExperienceAction = async (id: number) => {
    await api(`/api/portfolio/experience/${id}`, { method: "DELETE" });
    setExperiences((prev) => prev.filter((e) => e.id !== id));
  };

  // -------------------------------------------------------------------------
  // Testimonials
  // -------------------------------------------------------------------------
  const addTestimonial = async (testimonialData: TestimonialFormData) => {
    const { testimonial: saved } = await api<{ testimonial: Testimonial }>("/api/portfolio/testimonials", {
      method: "POST",
      body: JSON.stringify({ ...testimonialData, profile_id: DEFAULT_PROFILE_ID }),
    });
    setTestimonials((prev) => [saved, ...prev]);
  };

  const updateTestimonialAction = async (id: number, testimonialData: Partial<TestimonialFormData>) => {
    const { testimonial: saved } = await api<{ testimonial: Testimonial }>(`/api/portfolio/testimonials/${id}`, {
      method: "PUT",
      body: JSON.stringify(testimonialData),
    });
    setTestimonials((prev) => prev.map((t) => (t.id === id ? saved : t)));
  };

  const deleteTestimonialAction = async (id: number) => {
    await api(`/api/portfolio/testimonials/${id}`, { method: "DELETE" });
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <PortfolioContext.Provider
      value={{
        isLoading,
        error,
        profile,
        updateProfile: updateProfileAction,
        projects,
        addProject,
        updateProject: updateProjectAction,
        deleteProject: deleteProjectAction,
        projectCategories,
        addProjectCategory,
        updateProjectCategory: updateProjectCategoryAction,
        deleteProjectCategory: deleteProjectCategoryAction,
        skills,
        addSkill,
        updateSkill: updateSkillAction,
        deleteSkill: deleteSkillAction,
        skillCategories,
        addSkillCategory,
        updateSkillCategory: updateSkillCategoryAction,
        deleteSkillCategory: deleteSkillCategoryAction,
        certifications,
        addCertification,
        updateCertification: updateCertificationAction,
        deleteCertification: deleteCertificationAction,
        education,
        addEducation,
        updateEducation: updateEducationAction,
        deleteEducation: deleteEducationAction,
        experiences,
        addExperience,
        updateExperience: updateExperienceAction,
        deleteExperience: deleteExperienceAction,
        testimonials,
        addTestimonial,
        updateTestimonial: updateTestimonialAction,
        deleteTestimonial: deleteTestimonialAction,
        refresh,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
}
