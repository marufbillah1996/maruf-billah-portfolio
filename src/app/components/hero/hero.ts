import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PortfolioService } from '../../services/portfolio';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  templateUrl: './hero.html',
})
export class HeroComponent {
  readonly portfolio = inject(PortfolioService);
  readonly leadProject = this.portfolio.projects()[0]; // VortiBd

  openLeadProject() {
    if (this.leadProject) {
      this.portfolio.openProjectDetails(this.leadProject);
    }
  }
}
