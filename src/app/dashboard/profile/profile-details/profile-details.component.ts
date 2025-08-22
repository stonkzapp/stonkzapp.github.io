import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { UserProfile } from '../../../core/models/models';
import { Subscription } from 'rxjs';
import { ButtonComponent } from '../../../shared/button/button.component';
import { InputComponent } from '../../../shared/input/input.component';
import { FormValidationService } from '../../../core/services/form-validation.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'stz-profile-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    ButtonComponent,
    InputComponent,
  ],
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
})
export class ProfileDetailsComponent implements OnInit, OnDestroy {
  profileForm: FormGroup;
  userProfile: UserProfile | null = null;
  isLoading = false;
  isSaving = false;
  private profileSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private formValidation: FormValidationService
  ) {
    this.profileForm = this.fb.group({
      firstName: this.formValidation.createFormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      lastName: this.formValidation.createFormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      email: this.formValidation.createFormControl('', [
        Validators.required,
        Validators.email,
      ]),
      document: this.formValidation.createFormControl(
        { value: '', disabled: true },
        [Validators.required]
      ),
    });

    this.profileSubscription = this.userService.getUserProfile().subscribe({
      next: (profile: UserProfile) => {
        this.userProfile = profile;
        this.populateForm(profile);
      },
      error: (error: any) => {
        console.error('Erro ao carregar perfil:', error);
      },
    });
  }

  ngOnInit(): void {
    // Form já é inicializado no constructor
  }

  ngOnDestroy(): void {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
  }

  private populateForm(profile: UserProfile): void {
    this.profileForm.patchValue({
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      email: profile.email || '',
      document: profile.cpf || profile.document || '',
    });
  }

  get firstNameControl(): FormControl {
    return this.profileForm.get('firstName') as FormControl;
  }

  get lastNameControl(): FormControl {
    return this.profileForm.get('lastName') as FormControl;
  }

  get emailControl(): FormControl {
    return this.profileForm.get('email') as FormControl;
  }

  get documentControl(): FormControl {
    return this.profileForm.get('document') as FormControl;
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isSaving = true;

      const formValue = this.profileForm.value;

      // Preparar dados para envio
      const profileData: UserProfile = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        document: this.documentControl.value, // Manter o valor original do documento
        phoneNumber: this.userProfile?.phoneNumber || '',
        phone: this.userProfile?.phone,
        cpf: this.userProfile?.cpf,
        birthDate: this.userProfile?.birthDate,
        address: this.userProfile?.address,
      };

      // Usar o serviço para atualizar o perfil
      this.userService.updateUserProfile(profileData).subscribe({
        next: () => {
          console.log('Perfil atualizado com sucesso!');
          this.isSaving = false;
          // Aqui você pode mostrar uma mensagem de sucesso
          // e redirecionar para o perfil
          setTimeout(() => {
            this.router.navigate(['/dashboard/profile']);
          }, 1500);
        },
        error: (error: any) => {
          console.error('Erro ao atualizar perfil:', error);
          this.isSaving = false;
          // Aqui você pode mostrar uma mensagem de erro
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      control?.markAsTouched();
    });
  }
}
