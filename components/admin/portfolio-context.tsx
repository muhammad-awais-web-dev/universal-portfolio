"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  Project,
  Skill,
  Certification,
  Education,
  Experience,
  Profile,
  ProjectFormData,
  SkillFormData,
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

  // Skills
  skills: Skill[];
  addSkill: (skill: SkillFormData) => void;
  updateSkill: (id: number, skill: Partial<SkillFormData>) => void;
  deleteSkill: (id: number) => void;

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

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);

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
        skills,
        addSkill,
        updateSkill,
        deleteSkill,
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
