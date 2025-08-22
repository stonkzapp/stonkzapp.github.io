import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class FormValidationService {
  // Definição de padrões (regex)
  patterns = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    password:
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    phone: /^[1-9]{2}[9]{0,1}[0-9]{8}$/, // Formato brasileiro
    cpf: /^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})$/, // CPF no formato XXX.XXX.XXX-XX
    confirmationCode: /^\d{6}$/,
  };

  // Máscaras para os campos
  masks = {
    phone: '(00) 00000-0000',
    cpf: '000.000.000-00',
    confirmationCode: '000-000',
  };

  // Mensagens de erro dinâmicas
  errorMessages: { [key: string]: string } = {
    required: 'Campo obrigatório.',
    minlength: 'Quantidade mínima de caracteres não atingida.',
    maxlength: 'Quantidade máxima de caracteres ultrapassada.',
    email: 'E-mail inválido.',
    invalidCpf: 'CPF inválido',
    pattern: 'Formato inválido.',
  };

  // Função para remover a máscara (remove tudo que não é número)
  removeCpfMask(cpf: string): string {
    return cpf.replace(/\D/g, ''); // Remove tudo que não é dígito
  }

  // Validação de CPF
  validateCpf(cpf: string): boolean {
    // Remover qualquer caractere não numérico do CPF
    const cpfCleaned = cpf.replace(/[^\d]/g, '');

    // Verificar se o CPF tem exatamente 11 dígitos
    if (cpfCleaned.length !== 11 || /^(\d)\1{10}$/.test(cpfCleaned)) {
      return false; // CPF com todos os dígitos iguais, como "111.111.111-11", é inválido
    }

    // Validar primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpfCleaned.charAt(i)) * (10 - i);
    }
    let rest = sum % 11;
    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== parseInt(cpfCleaned.charAt(9))) return false;

    // Validar segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpfCleaned.charAt(i)) * (11 - i);
    }
    rest = sum % 11;
    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== parseInt(cpfCleaned.charAt(10))) return false;

    return true;
  }

  // Função para obter mensagem de erro personalizada
  getErrorMessage(control: AbstractControl | null): string {
    if (!control || !control.errors || !control.touched) return '';

    const errors = control.errors;
    const keys = Object.keys(errors);

    for (const key of keys) {
      if (this.errorMessages[key]) {
        return this.errorMessages[key]; // Usando a chave diretamente
      }
    }

    return 'Erro inválido';
  }

  /**
   * Retorna a mensagem de erro com base no tipo de erro.
   */
  getErrorMessagePassword(control: AbstractControl): string {
    if (!control.errors) return '';

    if (control.errors['required']) return 'Campo obrigatório.';
    if (control.errors['minLength'])
      return 'A senha deve ter pelo menos 8 caracteres.';
    if (control.errors['uppercase'])
      return 'A senha deve conter pelo menos uma letra maiúscula.';
    if (control.errors['lowercase'])
      return 'A senha deve conter pelo menos uma letra minúscula.';
    if (control.errors['number'])
      return 'A senha deve conter pelo menos um número.';
    if (control.errors['specialChar'])
      return 'A senha deve conter pelo menos um caractere especial.';

    return 'Erro desconhecido.';
  }

  // Função para criar um FormControl com validações reutilizáveis
  createFormControl(value: any = '', validators: any[] = []): FormControl {
    return new FormControl(value, validators);
  }

  // Validador para CPF
  cpfValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const cpf = control.value;

      // Remover a máscara do CPF antes de validar
      const cpfCleaned = this.removeCpfMask(cpf);

      if (cpfCleaned && !this.validateCpf(cpfCleaned)) {
        return { invalidCpf: true }; // CPF inválido
      }
      return null; // CPF válido
    };
  }

  /**
   * Valida se a senha contém os critérios necessários.
   */
  validatePassword(password: string): { [key: string]: boolean } | null {
    const errors: { [key: string]: boolean } = {};
    if (password.length < 8) errors['minLength'] = true;
    if (!/[A-Z]/.test(password)) errors['uppercase'] = true;
    if (!/[a-z]/.test(password)) errors['lowercase'] = true;
    if (!/[0-9]/.test(password)) errors['number'] = true;
    if (!/[^A-Za-z0-9]/.test(password)) errors['specialChar'] = true;

    return Object.keys(errors).length ? errors : null;
  }

  /**
   * Retorna um ValidatorFn para validação de senha.
   */
  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null; // Se o campo estiver vazio, não valida

      const errors = this.validatePassword(control.value);
      return errors ? errors : null;
    };
  }

  // Validador customizado para verificar se as senhas são iguais
  passwordsMatchValidator(group: FormGroup): ValidationErrors | null {
    const password = group.get('newPassword');
    const confirmPassword = group.get('confirmPassword');

    return null;
  }
}
