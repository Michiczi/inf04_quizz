import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const repeatpassword = control.get('repeatpassword');

  if (password && repeatpassword && password.value !== repeatpassword.value) {
    return { passwordMismatch: true };
  }

  return null;
};