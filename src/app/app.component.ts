import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import {
  BehaviorSubject,
  filter,
  map,
  Observable,
  repeat,
  shareReplay,
  Subject,
  switchMap,
  takeUntil,
  tap,
  timer,
} from 'rxjs';
import { IntervalFormComponent } from './components/interval-form/interval-form.component';
import { Interval } from './models/interval.model';
import { IntervalService } from './services/interval.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [DialogService, ConfirmationService],
})
export class AppComponent implements OnInit {
  readonly #intervalService = inject(IntervalService);
  readonly #dialogService = inject(DialogService);
  readonly #dr = inject(DestroyRef);
  readonly #confirm = inject(ConfirmationService);

  seconds$!: Observable<number>;
  intervals$!: Observable<Interval[]>;
  currentColor$ = new BehaviorSubject('');

  #timerStop$ = new Subject<void>();
  #timerStart$ = new Subject<void>();
  readonly #maxSeconds = 59;

  ngOnInit(): void {
    this.intervals$ = this.#intervalService.intervals.pipe(shareReplay(1));
    this.seconds$ = timer(0, 1000).pipe(
      tap((v) => {
        if (v === this.#maxSeconds + 1) {
          this.#timerStop$.next();
          this.#timerStart$.next();
        }
      }),
      switchMap((second) => {
        return this.#pickColor(second).pipe(
          map((color) => ({ color, second }))
        );
      }),
      map(({ color, second }) => {
        this.currentColor$.next(color);
        return second;
      }),
      takeUntil(this.#timerStop$),
      repeat({ delay: () => this.#timerStart$ })
    );
  }
  #pickColor(currentTime: number): Observable<string> {
    return this.intervals$.pipe(
      map((intervals: Interval[]) => {
        const interval = intervals.find(
          (i) => i.from <= currentTime && i.to >= currentTime
        );
        return interval?.color ?? '';
      })
    );
  }
  onAdd(): void {
    const ref = this.#dialogService.open(IntervalFormComponent, {
      header: 'Add new interval',
    });

    ref.onClose
      .pipe(
        takeUntilDestroyed(this.#dr),
        filter((data) => !!data?.interval)
      )
      .subscribe((data: { interval: Interval }) => {
        this.#intervalService.addInterval(data.interval!);
      });
  }

  onDelete(id: number): void {
    this.#confirm.confirm({
      message: 'Are you sure you want to delete the record?',
      header: 'Deleting record',
      accept: () => this.#intervalService.deleteInterval(id),
    });
  }
}
