import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  currentDate$: BehaviorSubject<Date> = new BehaviorSubject(new Date());

  today$: BehaviorSubject<Date> = new BehaviorSubject(new Date());
  @Input() selectedDate: FormControl;
  constructor() {
    this.selectedDate = new FormControl(new Date());
  }

  ngOnInit() {}

  get emptyTilesBefore(): number[] {
    const firstDayOfMonth = new Date(
      this.currentDate$.value.getFullYear(),
      this.currentDate$.value.getMonth(),
      1
    );
    const emptyTiles = new Array(firstDayOfMonth.getDay());
    return emptyTiles.fill(0);
  }

  get emptyTilesAfter(): number[] {
    const lastDayOfMonth = new Date(
      this.currentDate$.value.getFullYear(),
      this.currentDate$.value.getMonth() + 1,
      0
    );
    const emptyTiles = new Array(
      42 - lastDayOfMonth.getDate() - this.emptyTilesBefore.length
    );
    return emptyTiles.fill(0);
  }

  get dateTiles() {
    const { value: currentDate } = this.currentDate$;
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    return Array(lastDayOfMonth)
      .fill(null)
      .map((_, index) => new Date(year, month, index + 1));
  }

  selectDate(date: Date) {
    this.currentDate$.next(date);
  }

  isSelected(date: Date) {
    return (
      date.getDate() === this.currentDate$.value.getDate() &&
      date.getMonth() === this.currentDate$.value.getMonth() &&
      date.getFullYear() === this.currentDate$.value.getFullYear()
    );
  }

  selectPreviousMonth() {
    const previousMonth = new Date(
      this.currentDate$.value.getFullYear(),
      this.currentDate$.value.getMonth() - 1,
      1
    );
    this.selectedDate.setValue(previousMonth);
    this.currentDate$.next(previousMonth);
  }

  selectNextMonth() {
    const nextMonth = new Date(
      this.currentDate$.value.getFullYear(),
      this.currentDate$.value.getMonth() + 1,
      1
    );
    this.selectedDate.setValue(nextMonth);
    this.currentDate$.next(nextMonth);
  }

  selectPreviousYear() {
    const previousYear = new Date(
      this.currentDate$.value.getFullYear() - 1,
      this.currentDate$.value.getMonth(),
      1
    );
    this.currentDate$.next(previousYear);
  }

  selectNextYear() {
    const nextYear = new Date(
      this.currentDate$.value.getFullYear() + 1,
      this.currentDate$.value.getMonth(),
      1
    );
    this.currentDate$.next(nextYear);
  }
}
