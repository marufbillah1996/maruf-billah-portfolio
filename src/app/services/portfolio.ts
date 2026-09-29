import { computed, Injectable, signal } from '@angular/core';
import { CVProfile, ProjectCategory, ProjectCategoryItem, ProjectItem } from '../models/portfolio.model';
import { CV_DATA, PROJECTS_DATA } from '../data/portfolio-data';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  readonly cv: CVProfile = CV_DATA;
  readonly projects = signal<ProjectItem[]>(PROJECTS_DATA);

  // Filters & State
  readonly selectedCategory = signal<ProjectCategory | 'all'>('all');
  readonly selectedTag = signal<string | null>(null);
  readonly searchQuery = signal<string>('');

  // Modals & Panels
  readonly activeProject = signal<ProjectItem | null>(null);
  readonly pitchMode = signal<boolean>(false);
  readonly currentSlideIndex = signal<number>(0);
  readonly quickShareOpen = signal<boolean>(false);
  readonly dossierExportOpen = signal<boolean>(false);

  // PWA & Connectivity
  readonly isOnline = signal<boolean>(true);
  readonly pwaInstallable = signal<boolean>(false);
  readonly pwaInstalled = signal<boolean>(false);
  private deferredPrompt: BeforeInstallPromptEvent | null = null;

  // Toast feedback
  readonly toastMessage = signal<string | null>(null);
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.initPWAAndOnline();
  }

  // Computed Category Breakdown
  readonly categories = computed<ProjectCategoryItem[]>(() => {
    const list = this.projects();
    const map: Record<ProjectCategory, number> = {
      'enterprise-erp': 0,
      'backend-api': 0,
      'fullstack-angular': 0,
      'database-sql': 0,
      'realtime-systems': 0,
      'scholarship-systems': 0,
    };
    list.forEach((p) => {
      map[p.category] = (map[p.category] || 0) + 1;
    });

    return [
      { id: 'all', label: 'All Architectures', description: 'Complete portfolio of enterprise systems', count: list.length },
      { id: 'enterprise-erp', label: 'Enterprise ERP', description: 'VortiBd, EIMS 6 Modules, POS & Inventory', count: map['enterprise-erp'] },
      { id: 'fullstack-angular', label: 'Angular & Frontend', description: 'Modern TypeScript SPAs & Reactive Forms', count: map['fullstack-angular'] },
      { id: 'backend-api', label: '.NET Core & APIs', description: 'RESTful Web APIs, WebForms, C# Architecture', count: map['backend-api'] },
      { id: 'database-sql', label: 'SQL Server & RDBMS', description: 'Stored Procedures, Triggers, Views & Indexing', count: map['database-sql'] },
      { id: 'realtime-systems', label: 'Real-Time & WASM', description: 'SignalR WebSockets & Blazor WebAssembly', count: map['realtime-systems'] },
      { id: 'scholarship-systems', label: 'UWP & IsDB Systems', description: 'Universal Windows Platform & Desktop Suites', count: map['scholarship-systems'] },
    ];
  });

  // Unique Tags for Active Category
  readonly availableTags = computed<string[]>(() => {
    const cat = this.selectedCategory();
    const source = cat === 'all' ? this.projects() : this.projects().filter((p) => p.category === cat);
    const tagSet = new Set<string>();
    source.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet);
  });

  // Filtered Projects
  readonly filteredProjects = computed<ProjectItem[]>(() => {
    const cat = this.selectedCategory();
    const tag = this.selectedTag();
    const query = this.searchQuery().trim().toLowerCase();

    return this.projects().filter((item) => {
      if (cat !== 'all' && item.category !== cat) return false;
      if (tag && !item.tags.includes(tag)) return false;
      if (query) {
        const inName = item.name.toLowerCase().includes(query);
        const inSummary = item.summary.toLowerCase().includes(query);
        const inTech = item.technologies.some((t) => t.toLowerCase().includes(query));
        const inTags = item.tags.some((t) => t.toLowerCase().includes(query));
        const inCompany = item.companyOrContext.toLowerCase().includes(query);
        if (!inName && !inSummary && !inTech && !inTags && !inCompany) {
          return false;
        }
      }
      return true;
    });
  });

  readonly featuredProjects = computed<ProjectItem[]>(() => {
    return this.projects().filter((p) => p.featured);
  });

  // Filter Actions
  setCategory(cat: ProjectCategory | 'all') {
    this.selectedCategory.set(cat);
    this.selectedTag.set(null);
  }

  toggleTag(tag: string) {
    if (this.selectedTag() === tag) {
      this.selectedTag.set(null);
    } else {
      this.selectedTag.set(tag);
    }
  }

  setSearch(q: string) {
    this.searchQuery.set(q);
  }

  // Architecture Case Study Modal
  openProjectDetails(project: ProjectItem) {
    this.activeProject.set(project);
  }

  closeProjectDetails() {
    this.activeProject.set(null);
  }

  // Interview & Client Pitch Presentation Mode
  startPitchMode(projectId?: string) {
    const list = this.filteredProjects();
    if (list.length === 0) return;
    let idx = 0;
    if (projectId) {
      idx = Math.max(0, list.findIndex((p) => p.id === projectId));
    }
    this.currentSlideIndex.set(idx);
    this.pitchMode.set(true);
  }

  exitPitchMode() {
    this.pitchMode.set(false);
  }

  nextSlide() {
    const list = this.filteredProjects();
    this.currentSlideIndex.update((i) => (i + 1) % list.length);
  }

  prevSlide() {
    const list = this.filteredProjects();
    this.currentSlideIndex.update((i) => (i - 1 + list.length) % list.length);
  }

  // Modals
  openQuickShare() {
    this.quickShareOpen.set(true);
  }
  closeQuickShare() {
    this.quickShareOpen.set(false);
  }

  openDossierExport() {
    this.dossierExportOpen.set(true);
  }
  closeDossierExport() {
    this.dossierExportOpen.set(false);
  }

  // Toast
  showToast(message: string) {
    this.toastMessage.set(message);
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toastMessage.set(null);
    }, 3200);
  }

  // PWA Support
  private initPWAAndOnline() {
    if (typeof window === 'undefined') return;

    this.isOnline.set(window.navigator.onLine);
    window.addEventListener('online', () => {
      this.isOnline.set(true);
      this.showToast('Online connection restored.');
    });
    window.addEventListener('offline', () => {
      this.isOnline.set(false);
      this.showToast('Offline mode active. Cached engineer profile available.');
    });

    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    this.pwaInstalled.set(isStandalone);

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      this.pwaInstallable.set(true);
    });

    window.addEventListener('appinstalled', () => {
      this.pwaInstalled.set(true);
      this.pwaInstallable.set(false);
      this.showToast('Md. Maruf Billah Portfolio installed to your device!');
    });
  }

  async installApp(): Promise<boolean> {
    if (!this.deferredPrompt) return false;
    await this.deferredPrompt.prompt();
    const choice = await this.deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      this.pwaInstalled.set(true);
      this.pwaInstallable.set(false);
      this.deferredPrompt = null;
      return true;
    }
    return false;
  }

  // Professional vCard Contact Generation
  downloadVCard() {
    const vCardContent = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'FN:Md. Maruf Billah',
      'N:Billah;Md.;Maruf;;',
      'TITLE:.NET Software Engineer (Full-Stack)',
      'ORG:Desh Universal Pvt. Limited',
      'TEL;TYPE=CELL,VOICE:+8801684937787',
      'EMAIL;TYPE=INTERNET,PREF:maruf.rbm@gmail.com',
      'ADR;TYPE=WORK:;;Ambag Road, Konabari;Gazipur;;;Bangladesh',
      'URL:https://linkedin.com/in/maruf-billah-543aa8162',
      'NOTE:Full-Stack .NET Core, Angular, SQL Server, ERP Architecture. Awarded VortiBd.com in 2025.',
      'END:VCARD',
    ].join('\r\n');

    const blob = new Blob([vCardContent], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Md_Maruf_Billah_Software_Engineer.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    this.showToast('Professional Contact Card (vCard) downloaded to phone contacts!');
  }

  // Export Complete Engineer Dossier JSON for Cloud Drive
  exportDossierJson() {
    const dossierData = {
      developer: {
        name: this.cv.name,
        title: this.cv.title,
        experience: this.cv.yearsOfExperience,
        email: this.cv.email,
        phone: this.cv.phone,
        location: this.cv.location,
        linkedin: this.cv.linkedin,
        github: this.cv.github,
        summary: this.cv.summary,
      },
      honorsAndAwards: [this.cv.award],
      certifications: [this.cv.certification],
      workExperience: this.cv.experiences,
      education: this.cv.education,
      skillTaxonomy: this.cv.skillGroups,
      enterpriseProjectsCatalog: this.projects().map((p) => ({
        id: p.id,
        name: p.name,
        category: p.categoryLabel,
        metric: `${p.metric} (${p.metricLabel})`,
        role: p.role,
        company: p.companyOrContext,
        period: p.period,
        technologies: p.technologies,
        highlights: p.keyHighlights,
        architecture: p.architectureDetails,
      })),
      cloudFolderStructure: {
        root: '/Maruf_Billah_Software_Engineering_Dossier',
        subdirectories: [
          '01_Resume_And_Credentials',
          '02_Architecture_Diagrams',
          '03_Enterprise_ERP_Case_Studies',
          '04_Database_Schemas_And_SQL',
          '05_Awards_And_Certifications',
        ],
      },
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(dossierData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `maruf_billah_engineer_dossier_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    this.showToast('Developer Technical Dossier (JSON) exported for Cloud Drive!');
  }

  // Export CSV Project Catalog
  exportProjectsCsv() {
    const headers = ['Project Name', 'Category', 'Role', 'Company/Context', 'Period', 'Metric', 'Technologies', 'Summary'];
    const rows = this.projects().map((p) => [
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.categoryLabel}"`,
      `"${p.role}"`,
      `"${p.companyOrContext}"`,
      `"${p.period}"`,
      `"${p.metric} - ${p.metricLabel}"`,
      `"${p.technologies.join(', ')}"`,
      `"${p.summary.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `maruf_billah_projects_catalog_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    this.showToast('Projects CSV Catalog exported!');
  }

  // Copy portfolio URL
  copyPortfolioLink() {
    const url = typeof window !== 'undefined' ? window.location.href : 'https://maruf-billah.dev';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        this.showToast('Portfolio link copied to clipboard!');
      });
    } else {
      this.showToast('Portfolio link ready to share.');
    }
  }
}
