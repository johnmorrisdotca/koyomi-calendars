import { mount } from "svelte";
import DayIcon from "./DayIcon.svelte";

mount(DayIcon, { target: document.getElementById("app")!, props: { date: new Date() } });
