import { createApp } from "vue";
import DayIcon from "./DayIcon.vue";

createApp(DayIcon, { date: new Date() }).mount("#app");
