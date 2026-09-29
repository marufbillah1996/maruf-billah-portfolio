import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PortfolioService } from '../../services/portfolio';

@Component({
  selector: 'app-cv-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  templateUrl: './cv-section.html',
})
export class CvSectionComponent {
  readonly portfolio = inject(PortfolioService);
  readonly cv = this.portfolio.cv;

  printResume() {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }
}
