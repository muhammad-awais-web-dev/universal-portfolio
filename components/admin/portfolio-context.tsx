"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  Project,
  Skill,
  SkillCategory,
  ProjectCategory,
  Certification,
  Education,
  Experience,
  Profile,
  ProjectFormData,
  SkillFormData,
  SkillCategoryFormData,
  ProjectCategoryFormData,
  CertificationFormData,
  EducationFormData,
  ExperienceFormData,
  ProfileFormData,
} from "@/lib/models/portfolio";

interface PortfolioContextType {
  // Profile
  profile: Profile | null;
  updateProfile: (profile: ProfileFormData) => void;

  // Projects
  projects: Project[];
  addProject: (project: ProjectFormData) => void;
  updateProject: (id: number, project: Partial<ProjectFormData>) => void;
  deleteProject: (id: number) => void;

  // Project Categories
  projectCategories: ProjectCategory[];
  addProjectCategory: (category: ProjectCategoryFormData) => void;
  updateProjectCategory: (id: number, category: Partial<ProjectCategoryFormData>) => void;
  deleteProjectCategory: (id: number) => void;

  // Skills
  skills: Skill[];
  addSkill: (skill: SkillFormData) => void;
  updateSkill: (id: number, skill: Partial<SkillFormData>) => void;
  deleteSkill: (id: number) => void;

  // Skill Categories
  skillCategories: SkillCategory[];
  addSkillCategory: (category: SkillCategoryFormData) => void;
  updateSkillCategory: (id: number, category: Partial<SkillCategoryFormData>) => void;
  deleteSkillCategory: (id: number) => void;

  // Certifications
  certifications: Certification[];
  addCertification: (certification: CertificationFormData) => void;
  updateCertification: (id: number, certification: Partial<CertificationFormData>) => void;
  deleteCertification: (id: number) => void;

  // Education
  education: Education[];
  addEducation: (education: EducationFormData) => void;
  updateEducation: (id: number, education: Partial<EducationFormData>) => void;
  deleteEducation: (id: number) => void;

  // Experience
  experiences: Experience[];
  addExperience: (experience: ExperienceFormData) => void;
  updateExperience: (id: number, experience: Partial<ExperienceFormData>) => void;
  deleteExperience: (id: number) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

// LocalStorage keys
const STORAGE_KEYS = {
  PROFILE: "portfolio_profile",
  PROJECTS: "portfolio_projects",
  PROJECT_CATEGORIES: "portfolio_project_categories",
  SKILLS: "portfolio_skills",
  SKILL_CATEGORIES: "portfolio_skill_categories",
  CERTIFICATIONS: "portfolio_certifications",
  EDUCATION: "portfolio_education",
  EXPERIENCES: "portfolio_experiences",
};

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectCategories, setProjectCategories] = useState<ProjectCategory[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
      const storedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      const storedProjectCategories = localStorage.getItem(STORAGE_KEYS.PROJECT_CATEGORIES);
      const storedSkills = localStorage.getItem(STORAGE_KEYS.SKILLS);
      const storedSkillCategories = localStorage.getItem(STORAGE_KEYS.SKILL_CATEGORIES);
      const storedCertifications = localStorage.getItem(STORAGE_KEYS.CERTIFICATIONS);
      const storedEducation = localStorage.getItem(STORAGE_KEYS.EDUCATION);
      const storedExperiences = localStorage.getItem(STORAGE_KEYS.EXPERIENCES);

      if (storedProfile) setProfile(JSON.parse(storedProfile));
      if (storedProjects) setProjects(JSON.parse(storedProjects));
      if (storedProjectCategories) setProjectCategories(JSON.parse(storedProjectCategories));
      if (storedSkills) setSkills(JSON.parse(storedSkills));
      if (storedSkillCategories) setSkillCategories(JSON.parse(storedSkillCategories));
      if (storedCertifications) setCertifications(JSON.parse(storedCertifications));
      if (storedEducation) setEducation(JSON.parse(storedEducation));
      if (storedExperiences) setExperiences(JSON.parse(storedExperiences));
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      try {
        if (profile) {
          localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
        } else {
          localStorage.removeItem(STORAGE_KEYS.PROFILE);
        }
      } catch (error) {
        console.error("Error saving profile to localStorage:", error);
      }
    }
  }, [profile, isInitialized]);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
      } catch (error) {
        console.error("Error saving projects to localStorage:", error);
      }
    }
  }, [projects, isInitialized]);

  // Save project categories to localStorage whenever they change
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(STORAGE_KEYS.PROJECT_CATEGORIES, JSON.stringify(projectCategories));
      } catch (error) {
        console.error("Error saving project categories to localStorage:", error);
      }
    }
  }, [projectCategories, isInitialized]);

  // Save skills to localStorage whenever they change
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(skills));
      } catch (error) {
        console.error("Error saving skills to localStorage:", error);
      }
    }
  }, [skills, isInitialized]);

  // Save skill categories to localStorage whenever they change
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(STORAGE_KEYS.SKILL_CATEGORIES, JSON.stringify(skillCategories));
      } catch (error) {
        console.error("Error saving skill categories to localStorage:", error);
      }
    }
  }, [skillCategories, isInitialized]);

  // Save certifications to localStorage whenever they change
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(STORAGE_KEYS.CERTIFICATIONS, JSON.stringify(certifications));
      } catch (error) {
        console.error("Error saving certifications to localStorage:", error);
      }
    }
  }, [certifications, isInitialized]);

  // Save education to localStorage whenever they change
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(STORAGE_KEYS.EDUCATION, JSON.stringify(education));
      } catch (error) {
        console.error("Error saving education to localStorage:", error);
      }
    }
  }, [education, isInitialized]);

  // Save experiences to localStorage whenever they change
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(STORAGE_KEYS.EXPERIENCES, JSON.stringify(experiences));
      } catch (error) {
        console.error("Error saving experiences to localStorage:", error);
      }
    }
  }, [experiences, isInitialized]);

  // Profile actions
  const updateProfile = (profileData: ProfileFormData) => {
    setProfile({
      ...profileData,
      id: "owner",
      created_at: profile?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  };

  // Project actions
  const addProject = (projectData: ProjectFormData) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now(),
      owner_id: "owner",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setProjects([...projects, newProject]);
  };

  const updateProject = (id: number, projectData: Partial<ProjectFormData>) => {
    setProjects(
      projects.map((p) =>
        p.id === id
          ? { ...p, ...projectData, updated_at: new Date().toISOString() }
          : p
      )
    );
  };

  const deleteProject = (id: number) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  // Project Category actions
  const addProjectCategory = (categoryData: ProjectCategoryFormData) => {
    const newCategory: ProjectCategory = {
      ...categoryData,
      id: Date.now(),
      created_at: new Date().toISOString(),
    };
    setProjectCategories([...projectCategories, newCategory]);
  };

  const updateProjectCategory = (id: number, categoryData: Partial<ProjectCategoryFormData>) => {
    setProjectCategories(
      projectCategories.map((c) => (c.id === id ? { ...c, ...categoryData } : c))
    );
  };

  const deleteProjectCategory = (id: number) => {
    setProjectCategories(projectCategories.filter((c) => c.id !== id));
  };

  // Skill actions
  const addSkill = (skillData: SkillFormData) => {
    const newSkill: Skill = {
      ...skillData,
      id: Date.now(),
      created_at: new Date().toISOString(),
    };
    setSkills([...skills, newSkill]);
  };

  const updateSkill = (id: number, skillData: Partial<SkillFormData>) => {
    setSkills(skills.map((s) => (s.id === id ? { ...s, ...skillData } : s)));
  };

  const deleteSkill = (id: number) => {
    setSkills(skills.filter((s) => s.id !== id));
  };

  // Skill Category actions
  const addSkillCategory = (categoryData: SkillCategoryFormData) => {
    const newCategory: SkillCategory = {
      ...categoryData,
      id: Date.now(),
      created_at: new Date().toISOString(),
    };
    setSkillCategories([...skillCategories, newCategory]);
  };

  const updateSkillCategory = (id: number, categoryData: Partial<SkillCategoryFormData>) => {
    setSkillCategories(
      skillCategories.map((c) => (c.id === id ? { ...c, ...categoryData } : c))
    );
  };

  const deleteSkillCategory = (id: number) => {
    setSkillCategories(skillCategories.filter((c) => c.id !== id));
  };

  // Certification actions
  const addCertification = (certData: CertificationFormData) => {
    const newCert: Certification = {
      ...certData,
      id: Date.now(),
      profile_id: "owner",
      created_at: new Date().toISOString(),
    };
    setCertifications([...certifications, newCert]);
  };

  const updateCertification = (id: number, certData: Partial<CertificationFormData>) => {
    setCertifications(
      certifications.map((c) => (c.id === id ? { ...c, ...certData } : c))
    );
  };

  const deleteCertification = (id: number) => {
    setCertifications(certifications.filter((c) => c.id !== id));
  };

  // Education actions
  const addEducation = (eduData: EducationFormData) => {
    const newEdu: Education = {
      ...eduData,
      id: Date.now(),
      profile_id: "owner",
      created_at: new Date().toISOString(),
    };
    setEducation([...education, newEdu]);
  };

  const updateEducation = (id: number, eduData: Partial<EducationFormData>) => {
    setEducation(education.map((e) => (e.id === id ? { ...e, ...eduData } : e)));
  };

  const deleteEducation = (id: number) => {
    setEducation(education.filter((e) => e.id !== id));
  };

  // Experience actions
  const addExperience = (expData: ExperienceFormData) => {
    const newExp: Experience = {
      ...expData,
      id: Date.now(),
      profile_id: "owner",
      created_at: new Date().toISOString(),
    };
    setExperiences([...experiences, newExp]);
  };

  const updateExperience = (id: number, expData: Partial<ExperienceFormData>) => {
    setExperiences(
      experiences.map((e) => (e.id === id ? { ...e, ...expData } : e))
    );
  };

  const deleteExperience = (id: number) => {
    setExperiences(experiences.filter((e) => e.id !== id));
  };

  return (
    <PortfolioContext.Provider
      value={{
        profile,
        updateProfile,
        projects,
        addProject,
        updateProject,
        deleteProject,
        projectCategories,
        addProjectCategory,
        updateProjectCategory,
        deleteProjectCategory,
        skills,
        addSkill,
        updateSkill,
        deleteSkill,
        skillCategories,
        addSkillCategory,
        updateSkillCategory,
        deleteSkillCategory,
        certifications,
        addCertification,
        updateCertification,
        deleteCertification,
        education,
        addEducation,
        updateEducation,
        deleteEducation,
        experiences,
        addExperience,
        updateExperience,
        deleteExperience,
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
