import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PortfolioService } from '../../services/portfolio';
import { ProjectCategory, ProjectItem } from '../../models/portfolio.model';

@Component({
  selector: 'app-gallery',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  templateUrl: './gallery.html',
})
export class GalleryComponent {
  readonly portfolio = inject(PortfolioService);

  onCategorySelect(cat: ProjectCategory | 'all') {
    this.portfolio.setCategory(cat);
  }

  onTagToggle(tag: string) {
    this.portfolio.toggleTag(tag);
  }

  onSearchChange(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.portfolio.setSearch(val);
  }

  clearFilter() {
    this.portfolio.setCategory('all');
    this.portfolio.setSearch('');
  }

  openProject(project: ProjectItem) {
    this.portfolio.openProjectDetails(project);
  }

  pitchProject(project: ProjectItem, event: MouseEvent) {
    event.stopPropagation();
    this.portfolio.startPitchMode(project.id);
  }
}
