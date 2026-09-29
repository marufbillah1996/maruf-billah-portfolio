import { ChangeDetectionStrategy, Component, HostListener, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PortfolioService } from '../../services/portfolio';

@Component({
  selector: 'app-presentation-mode',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  templateUrl: './presentation-mode.html',
})
export class PresentationModeComponent {
  readonly portfolio = inject(PortfolioService);

  readonly currentSlide = computed(() => {
    const list = this.portfolio.filteredProjects();
    const idx = this.portfolio.currentSlideIndex();
    return list[idx] || list[0] || null;
  });

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (!this.portfolio.pitchMode()) return;

    if (event.key === 'Escape') {
      this.portfolio.exitPitchMode();
    } else if (event.key === 'ArrowRight' || event.key === 'Space') {
      this.portfolio.nextSlide();
    } else if (event.key === 'ArrowLeft') {
      this.portfolio.prevSlide();
    }
  }
}
