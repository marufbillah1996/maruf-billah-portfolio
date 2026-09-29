import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PortfolioService } from '../../services/portfolio';
import { ProjectCategory } from '../../models/portfolio.model';

@Component({
  selector: 'app-albums',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  templateUrl: './albums.html',
})
export class AlbumsComponent {
  readonly portfolio = inject(PortfolioService);

  readonly domainList = [
    {
      category: 'enterprise-erp' as ProjectCategory,
      title: 'Enterprise ERP & Institutional Solutions',
      tagline: 'VortiBd nationwide admission, EIMS ERP across 6 operational modules, and POS & Inventory systems.',
      icon: 'account_tree',
      keyMetrics: '6 Modules · 2025 Award',
      keyTags: ['VortiBd', 'EIMS ERP', 'SICS', 'RMS', 'FAMS', 'POS'],
    },
    {
      category: 'fullstack-angular' as ProjectCategory,
      title: 'Full-Stack Angular & Modern Frontend',
      tagline: 'Component lifecycle, Reactive Forms, Angular Material, TypeScript, and clean responsive UI.',
      icon: 'layers',
      keyMetrics: 'Angular v14 - v21 · Reactive Forms',
      keyTags: ['Angular', 'TypeScript', 'TailwindCSS', 'Material-UI', 'RxJS'],
    },
    {
      category: 'backend-api' as ProjectCategory,
      title: '.NET Core Web APIs & C# Microservices',
      tagline: 'Robust RESTful API design, dependency injection, repository pattern, and secure enterprise endpoints.',
      icon: 'integration_instructions',
      keyMetrics: '<200ms Latency · JWT Bearer',
      keyTags: ['.NET Core Web API', 'C#', 'REST', 'ASP.NET MVC', 'WebForms'],
    },
    {
      category: 'database-sql' as ProjectCategory,
      title: 'MS SQL Server & Relational Architecture',
      tagline: 'T-SQL Stored Procedures, Views, Triggers, RDBMS normalization, and index tuning.',
      icon: 'storage',
      keyMetrics: '40+ Stored Procedures · ACID',
      keyTags: ['SQL Server', 'T-SQL', 'Triggers', 'Views', 'Execution Plans'],
    },
    {
      category: 'realtime-systems' as ProjectCategory,
      title: 'Real-Time SignalR & WebAssembly',
      tagline: 'Persistent WebSocket event hubs, multi-user file streaming, and Blazor WebAssembly C# execution.',
      icon: 'hub',
      keyMetrics: '<50ms WebSocket · Zero Polling',
      keyTags: ['SignalR', 'Blazor WASM', 'WebSockets', 'C#', 'Async'],
    },
    {
      category: 'scholarship-systems' as ProjectCategory,
      title: 'IsDB-BISEW Certification Systems',
      tagline: 'Universal Windows Platform desktop software, legacy Web-Forms migration, and Enterprise Systems Design.',
      icon: 'workspace_premium',
      keyMetrics: '15-Month Diploma · C# Honors',
      keyTags: ['IsDB-BISEW', 'UWP', 'Desktop', 'XAML', 'Enterprise Systems'],
    },
  ];

  selectDomain(cat: ProjectCategory) {
    this.portfolio.setCategory(cat);
    const architecturesEl = document.getElementById('architectures');
    if (architecturesEl) {
      architecturesEl.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
