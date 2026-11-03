import "@angular/compiler";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideZonelessChangeDetection } from "@angular/core";
import { DayIconComponent } from "./day-icon.component";

void bootstrapApplication(DayIconComponent, { providers: [provideZonelessChangeDetection()] });
