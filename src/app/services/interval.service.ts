import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Interval } from '../models/interval.model';

@Injectable({
  providedIn: 'root',
})
export class IntervalService {
  #interval = new BehaviorSubject<Interval[]>([]);

  get intervals(): Observable<Interval[]> {
    return this.#interval.asObservable();
  }

  addInterval(i: Interval): void {
    const copy = [...this.#interval.getValue()];
    copy.push(i);
    copy.sort((a, b) => a.from - b.from);
    this.#interval.next(copy);
  }
  deleteInterval(id: number): void {
    const idx = this.#interval
      .getValue()
      .findIndex((interval) => interval.id === id);
    if (idx !== -1) {
      const copy = [...this.#interval.getValue()];
      copy.splice(idx, 1);
      this.#interval.next(copy);
    }
  }

  isIntervalEdgeExists(edge: number): boolean {
    const intervals = this.#interval.getValue();
    for (let i = 0; i < intervals.length; i++) {
      const { from, to } = intervals[i];
      if (edge >= from && edge <= to) {
        return true;
      }
    }
    return false;
  }

  isColorExists(color: string): boolean {
    const item = this.#interval
      .getValue()
      .find((interval) => interval.color === color);
    return !!item;
  }
}
