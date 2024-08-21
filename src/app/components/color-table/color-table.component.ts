import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Interval } from '../../models/interval.model';

@Component({
  selector: 'app-color-table',
  templateUrl: './color-table.component.html',
  styleUrl: './color-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorTableComponent {
  @Input({ required: true }) intervals: Interval[] = [];
  @Output() eventDelete = new EventEmitter<number>();

  onDelete(id: number): void {
    this.eventDelete.emit(id);
  }
}
