import { createRoot } from "react-dom/client";
import { DayIcon } from "./DayIcon";

createRoot(document.getElementById("root")!).render(<DayIcon date={new Date()} />);
