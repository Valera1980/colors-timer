import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { IntervalForm } from '../../models/interval-form.model';
import { Interval } from '../../models/interval.model';
import { FormErrors } from '../../models/validation-errors.enum';
import { IntervalService } from '../../services/interval.service';

@Component({
  selector: 'app-interval-form',
  templateUrl: './interval-form.component.html',
  styleUrl: './interval-form.component.scss',
})
export class IntervalFormComponent implements OnInit {
  readonly #fb = inject(FormBuilder);
  readonly #intervalService = inject(IntervalService);
  readonly #dialogRef = inject(DynamicDialogRef);

  form!: FormGroup<IntervalForm>;

  ngOnInit(): void {
    this.form = this.#fb.group(
      {
        color: this.#fb.control<string | null>(null, [Validators.required]),
        from: this.#fb.nonNullable.control(1),
        to: this.#fb.nonNullable.control(2),
      },
      {
        validators: [this.#validationWithDependency()],
      }
    );
  }

  #validationWithDependency(): ValidatorFn {
    return (form: AbstractControl): { [key: string]: boolean } | null => {
      const from = form?.get<keyof IntervalForm>('from');
      const to = form?.get<keyof IntervalForm>('to');
      const color = form?.get<keyof IntervalForm>('color');

      if (from?.value >= to?.value) {
        from!.setErrors({ [FormErrors.wrongInterval]: true });
        return { [FormErrors.wrongInterval]: true };
      }

      if (to?.value < 1 || to?.value > 59) {
        to!.setErrors({ [FormErrors.rangeOutTo]: true });
        return { [FormErrors.rangeOutTo]: true };
      }

      if (from?.value < 1 || from?.value > 58) {
        from!.setErrors({ [FormErrors.rangeOutFrom]: true });
        return { [FormErrors.rangeOutFrom]: true };
      }

      if (from) {
        const isEdgeExist = this.#intervalService.isIntervalEdgeExists(
          from!.value
        );
        const error = isEdgeExist ? { [FormErrors.fromExists]: true } : null;
        from.setErrors(error);
        return error;
      }
      if (to) {
        const isEdgeExist = this.#intervalService.isIntervalEdgeExists(
          to!.value
        );
        const error = isEdgeExist ? { [FormErrors.toExists]: true } : null;
        to.setErrors(error);
        return error;
      }
      if (color) {
        const isColorExists = this.#intervalService.isColorExists(color.value);
        const error = isColorExists ? { [FormErrors.colorExists]: true } : null;
        color.setErrors(error);
        return error;
      }

      return null;
    };
  }

  get colorControl(): FormControl {
    return this.form.get<keyof IntervalForm>('color') as FormControl;
  }
  get fromControl(): FormControl {
    return this.form.get<keyof IntervalForm>('from') as FormControl;
  }
  get toControl(): FormControl {
    return this.form.get<keyof IntervalForm>('to') as FormControl;
  }

  onSave(): void {
    this.#dialogRef.close({
      interval: {
        color: this.form.value.color,
        from: this.form.value.from,
        to: this.form.value.to,
        id: Date.now(),
      } as Interval,
    });
  }
  onCancel(): void {
    this.#dialogRef.close({
      interval: null,
    });
  }
  getFromControlErrors(): string {
    const keys = Object.keys(this.fromControl?.errors ?? []);
    if (keys.length) {
      if (keys[0] === FormErrors.rangeOutFrom) {
        return 'Please enter value from 1 to 58';
      }
      if (keys[0] === FormErrors.fromExists) {
        return 'Value already exists';
      }
      if (keys[0] === FormErrors.wrongInterval) {
        return 'Must be less than "To seconds"';
      }
    }
    return '';
  }
  getToControlErrors(): string {
    const keys = Object.keys(this.toControl?.errors ?? []);
    if (keys.length) {
      if (keys[0] === FormErrors.rangeOutTo) {
        return 'Please enter value from 1 to 59';
      }
      if (keys[0] === FormErrors.fromExists) {
        return 'Value already exists';
      }
    }
    return '';
  }
  getColorControlErrors(): string {
    const keys = Object.keys(this.colorControl?.errors ?? []);
    if (keys.length) {
      if (keys[0] === FormErrors.colorExists) {
        return 'Color already exists';
      }
      if (keys[0] === 'required') {
        return 'Please, select the color';
      }
    }
    return '';
  }
}
