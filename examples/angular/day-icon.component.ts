import { Component, Input, inject, type OnChanges } from "@angular/core";
import { DomSanitizer, type SafeHtml } from "@angular/platform-browser";
import { calendarIcon } from "@johnmorrisdotca/koyomi-calendars";

@Component({ selector: "app-day-icon", standalone: true, template: `<span [innerHTML]="svg"></span>` })
export class DayIconComponent implements OnChanges {
  private readonly sanitizer = inject(DomSanitizer);
  @Input() date = new Date();
  svg: SafeHtml = this.draw();

  ngOnChanges(): void {
    this.svg = this.draw();
  }

  private draw(): SafeHtml {
    const { date } = this;
    // The string holds only what the package drew, so it is trusted. Never build `mark` from user input.
    return this.sanitizer.bypassSecurityTrustHtml(calendarIcon({ month: date.getMonth() + 1, day: date.getDate(), year: date.getFullYear() }));
  }
}
