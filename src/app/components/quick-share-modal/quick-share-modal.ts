import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PortfolioService } from '../../services/portfolio';

@Component({
  selector: 'app-quick-share-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  templateUrl: './quick-share-modal.html',
})
export class QuickShareModalComponent {
  readonly portfolio = inject(PortfolioService);
  readonly cv = this.portfolio.cv;

  close() {
    this.portfolio.closeQuickShare();
  }

  copyLink() {
    this.portfolio.copyPortfolioLink();
  }

  saveVCard() {
    this.portfolio.downloadVCard();
  }
}
