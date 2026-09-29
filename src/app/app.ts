import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PortfolioService } from './services/portfolio';
import { HeaderComponent } from './components/header/header';
import { HeroComponent } from './components/hero/hero';
import { GalleryComponent } from './components/gallery/gallery';
import { AlbumsComponent } from './components/albums/albums';
import { CvSectionComponent } from './components/cv-section/cv-section';
import { ContactComponent } from './components/contact/contact';
import { FooterComponent } from './components/footer/footer';
import { LightboxComponent } from './components/lightbox/lightbox';
import { PresentationModeComponent } from './components/presentation-mode/presentation-mode';
import { QuickShareModalComponent } from './components/quick-share-modal/quick-share-modal';
import { CloudExportModalComponent } from './components/cloud-export-modal/cloud-export-modal';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIconModule,
    HeaderComponent,
    HeroComponent,
    GalleryComponent,
    AlbumsComponent,
    CvSectionComponent,
    ContactComponent,
    FooterComponent,
    LightboxComponent,
    PresentationModeComponent,
    QuickShareModalComponent,
    CloudExportModalComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly portfolio = inject(PortfolioService);
}

