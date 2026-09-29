export type ProjectCategory =
  | 'enterprise-erp'
  | 'backend-api'
  | 'fullstack-angular'
  | 'database-sql'
  | 'realtime-systems'
  | 'scholarship-systems';

export interface ArchitectureDetails {
  clientLayer: string;
  businessLogicLayer: string;
  dataLayer: string;
  database: string;
  securityAndAuth: string;
  performanceNotes: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  category: ProjectCategory;
  categoryLabel: string;
  summary: string;
  fullDescription: string;
  architectureDetails: ArchitectureDetails;
  keyHighlights: string[];
  technologies: string[];
  role: string;
  companyOrContext: string;
  period: string;
  featured: boolean;
  metric: string;
  metricLabel: string;
  tags: string[];
  icon: string;
  diagramSvg?: string;
}

export interface ProjectCategoryItem {
  id: ProjectCategory | 'all';
  label: string;
  description: string;
  count: number;
}

export interface CVExperience {
  company: string;
  role: string;
  location: string;
  period: string;
  department: string;
  highlights: string[];
  technologies: string[];
  achievements?: string;
}

export interface CVEducation {
  degree: string;
  institution: string;
  location: string;
  year: string;
  grade: string;
  note?: string;
}

export interface TechnicalSkillGroup {
  category: string;
  skills: { name: string; level: number; note: string }[];
}

export interface CVProfile {
  name: string;
  title: string;
  yearsOfExperience: string;
  location: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
  summary: string;
  award: {
    title: string;
    organization: string;
    year: string;
    details: string;
  };
  experiences: CVExperience[];
  education: CVEducation[];
  certification: {
    title: string;
    authority: string;
    period: string;
    description: string;
  };
  skillGroups: TechnicalSkillGroup[];
}
