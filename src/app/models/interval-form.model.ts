import { FormControl } from '@angular/forms';

export interface IntervalForm {
  from: FormControl<number>;
  to: FormControl<number>;
  color: FormControl<string | null>;
}
