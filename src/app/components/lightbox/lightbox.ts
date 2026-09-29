import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PortfolioService } from '../../services/portfolio';

@Component({
  selector: 'app-lightbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  templateUrl: './lightbox.html',
})
export class LightboxComponent {
  readonly portfolio = inject(PortfolioService);

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (!this.portfolio.activeProject()) return;

    if (event.key === 'Escape') {
      this.close();
    } else if (event.key === 'ArrowRight') {
      this.nextProject();
    } else if (event.key === 'ArrowLeft') {
      this.prevProject();
    }
  }

  close() {
    this.portfolio.closeProjectDetails();
  }

  nextProject() {
    const current = this.portfolio.activeProject();
    if (!current) return;
    const list = this.portfolio.filteredProjects();
    const idx = list.findIndex((p) => p.id === current.id);
    if (idx !== -1) {
      const nextIdx = (idx + 1) % list.length;
      this.portfolio.openProjectDetails(list[nextIdx]);
    }
  }

  prevProject() {
    const current = this.portfolio.activeProject();
    if (!current) return;
    const list = this.portfolio.filteredProjects();
    const idx = list.findIndex((p) => p.id === current.id);
    if (idx !== -1) {
      const prevIdx = (idx - 1 + list.length) % list.length;
      this.portfolio.openProjectDetails(list[prevIdx]);
    }
  }

  launchPitchFromCurrent() {
    const current = this.portfolio.activeProject();
    if (current) {
      this.close();
      this.portfolio.startPitchMode(current.id);
    }
  }
}
