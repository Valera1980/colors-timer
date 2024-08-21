import { Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { FormErrors } from '../models/validation-errors.enum';

@Injectable({
  providedIn: 'root',
})
export class ErrorMessageService {
  getErrorMessage(errors: ValidationErrors | null): string {
    const keys = Object.keys(errors ?? []);
    if (keys.length) {
      if (keys[0] === FormErrors.rangeOutFrom) {
        return 'Please enter value from 1 to 58';
      }
      if (keys[0] === FormErrors.rangeOutTo) {
        return 'Please enter value from 2 to 59';
      }
      if (keys[0] === FormErrors.fromExists) {
        return 'Value already exists';
      }
      if (keys[0] === FormErrors.wrongInterval) {
        return 'Must be less than "To seconds"';
      }
      if (keys[0] === FormErrors.colorExists) {
        return 'Color already exists';
      }
      if (keys[0] === FormErrors.requiredColor) {
        return 'Please, select the color';
      }
    }
    return '';
  }
}
