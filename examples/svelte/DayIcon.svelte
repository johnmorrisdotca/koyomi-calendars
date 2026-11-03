<script lang="ts">
  import { calendarIcon, type CalendarTheme } from "@johnmorrisdotca/koyomi-calendars";

  let { date, theme = "squircle" }: { date: Date; theme?: CalendarTheme } = $props();
  const svg = $derived(calendarIcon({ theme, month: date.getMonth() + 1, day: date.getDate(), year: date.getFullYear() }));
</script>

<span>{@html svg}</span>
