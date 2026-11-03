<script setup lang="ts">
import { computed } from "vue";
import { calendarIcon, type CalendarTheme } from "@johnmorrisdotca/koyomi-calendars";

const props = withDefaults(defineProps<{ date: Date; theme?: CalendarTheme }>(), { theme: "squircle" });
const svg = computed(() => calendarIcon({ theme: props.theme, month: props.date.getMonth() + 1, day: props.date.getDate(), year: props.date.getFullYear() }));
</script>

<template><span v-html="svg" /></template>
