import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PortfolioService } from '../../services/portfolio';

@Component({
  selector: 'app-cloud-export-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  templateUrl: './cloud-export-modal.html',
})
export class CloudExportModalComponent {
  readonly portfolio = inject(PortfolioService);

  close() {
    this.portfolio.closeDossierExport();
  }

  exportJson() {
    this.portfolio.exportDossierJson();
  }

  exportCsv() {
    this.portfolio.exportProjectsCsv();
  }

  downloadContactCard() {
    this.portfolio.downloadVCard();
  }
}
