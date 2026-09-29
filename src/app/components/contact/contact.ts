import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PortfolioService } from '../../services/portfolio';

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatIconModule],
  templateUrl: './contact.html',
})
export class ContactComponent {
  readonly portfolio = inject(PortfolioService);
  readonly cv = this.portfolio.cv;

  readonly submitted = signal<boolean>(false);

  readonly contactForm = new FormGroup({
    clientName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    clientEmail: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    clientPhone: new FormControl('', { nonNullable: true }),
    projectType: new FormControl('enterprise-erp', { nonNullable: true }),
    location: new FormControl('Dhaka', { nonNullable: true }),
    brief: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(10)] }),
  });

  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const val = this.contactForm.getRawValue();
    const subject = encodeURIComponent(`[Engineering Inquiry] ${val.projectType.toUpperCase()} - ${val.clientName}`);
    const body = encodeURIComponent(
      `Name: ${val.clientName}\nEmail: ${val.clientEmail}\nPhone: ${val.clientPhone || 'Not provided'}\nLocation: ${val.location}\nRequirement Type: ${val.projectType}\n\nProject Scope / Job Details:\n${val.brief}`
    );

    if (typeof window !== 'undefined') {
      window.location.href = `mailto:${this.cv.email}?subject=${subject}&body=${body}`;
    }

    this.submitted.set(true);
    this.portfolio.showToast('Inquiry drafted! Preparing email client...');
  }

  resetForm() {
    this.contactForm.reset({
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      projectType: 'enterprise-erp',
      location: 'Dhaka',
      brief: '',
    });
    this.submitted.set(false);
  }
}
