import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import { fetchNui, onNuiEvent, isEnvBrowser } from "./utils/nui";

const root = document.getElementById("root")!;

if (!isEnvBrowser) {
  root.style.display = "none";

  onNuiEvent<boolean>("setVisible", (visible) => {
    root.style.display = visible ? "block" : "none";
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      root.style.display = "none";
      fetchNui("close");
    }
  });
}

createRoot(root).render(<App />);
