import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
} from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { IntervalForm } from '../../models/interval-form.model';
import { Interval } from '../../models/interval.model';
import { FormErrors } from '../../models/validation-errors.enum';
import { ErrorMessageService } from '../../services/error-message.service';
import { IntervalService } from '../../services/interval.service';

@Component({
  selector: 'app-interval-form',
  templateUrl: './interval-form.component.html',
  styleUrl: './interval-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntervalFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private intervalService = inject(IntervalService);
  private dialogRef = inject(DynamicDialogRef);
  private errorService = inject(ErrorMessageService);

  private readonly fromInterval = [1, 58];
  private readonly toInterval = [2, 59];
  form!: FormGroup<IntervalForm>;

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        color: this.fb.control<string | null>(null),
        from: this.fb.nonNullable.control(1),
        to: this.fb.nonNullable.control(2),
      },
      {
        validators: [
          this.validateColor(),
          this.validateFromControl(),
          this.validateToControl(),
          this.validateToMoreThanFrom(),
        ],
      }
    );
  }

  // checking if value color is not null and  color already exists
  private validateColor(): ValidatorFn {
    return (form: AbstractControl): { [key: string]: boolean } | null => {
      const color = form?.get<keyof IntervalForm>('color');

      if (color?.value) {
        const isColorExists = this.intervalService.isColorExists(color.value);
        const error = isColorExists ? { [FormErrors.colorExists]: true } : null;
        color.setErrors(error);
        return error;
      }
      if (!color?.value) {
        const error = { [FormErrors.requiredColor]: true };
        color!.setErrors(error);
        return error;
      }
      return null;
    };
  }

  // checking "from" control is within interval 1...58 and "from" already exists
  private validateFromControl(): ValidatorFn {
    return (form: AbstractControl): { [key: string]: boolean } | null => {
      const from = form?.get<keyof IntervalForm>('from');
      const [start, end] = this.fromInterval;
      if (from?.value < start || from?.value > end) {
        from!.setErrors({ [FormErrors.rangeOutTo]: true });
        return { [FormErrors.rangeOutTo]: true };
      }
      if (from?.errors) {
        const isEdgeExist = this.intervalService.isIntervalEdgeExists(
          from!.value
        );
        const error = isEdgeExist ? { [FormErrors.fromExists]: true } : null;
        from.setErrors(error);
        return error;
      }
      return null;
    };
  }
  // checking "from" control is within interval 2...59 and "to" already exists
  private validateToControl(): ValidatorFn {
    return (form: AbstractControl): { [key: string]: boolean } | null => {
      const to = form?.get<keyof IntervalForm>('to');
      const [start, end] = this.toInterval;
      if (to?.value < start || to?.value > end) {
        to!.setErrors({ [FormErrors.rangeOutTo]: true });
        return { [FormErrors.rangeOutTo]: true };
      }
      if (to?.errors) {
        const isEdgeExist = this.intervalService.isIntervalEdgeExists(
          to!.value
        );
        const error = isEdgeExist ? { [FormErrors.toExists]: true } : null;
        to.setErrors(error);
        return error;
      }

      return null;
    };
  }

  // checking if "to" control more than "from" control
  private validateToMoreThanFrom(): ValidatorFn {
    return (form: AbstractControl): { [key: string]: boolean } | null => {
      const from = form?.get<keyof IntervalForm>('from');
      const to = form?.get<keyof IntervalForm>('to');

      if (from?.value >= to?.value) {
        from!.setErrors({ [FormErrors.wrongInterval]: true });
        return { [FormErrors.wrongInterval]: true };
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
    this.dialogRef.close({
      interval: {
        color: this.form.value.color,
        from: this.form.value.from,
        to: this.form.value.to,
        id: Date.now(),
      } as Interval,
    });
  }
  onCancel(): void {
    this.dialogRef.close({
      interval: null,
    });
  }
  getFromControlErrors(): string {
    return this.errorService.getErrorMessage(this.fromControl?.errors);
  }
  getToControlErrors(): string {
    return this.errorService.getErrorMessage(this.toControl?.errors);
  }
  getColorControlErrors(): string {
    return this.errorService.getErrorMessage(this.colorControl?.errors);
  }
}
