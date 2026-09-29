import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PortfolioService } from '../../services/portfolio';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  templateUrl: './footer.html',
})
export class FooterComponent {
  readonly portfolio = inject(PortfolioService);
  readonly currentYear = new Date().getFullYear();
}
