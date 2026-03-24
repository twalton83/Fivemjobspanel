import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { JobsPage } from "./pages/JobsPage";
import { TemplatesPage } from "./pages/TemplatesPage";
import { UsersPage } from "./pages/UsersPage";
import { LogsPage } from "./pages/LogsPage";
import { SettingsPage } from "./pages/SettingsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: JobsPage },
      { path: "templates", Component: TemplatesPage },
      { path: "users", Component: UsersPage },
      { path: "logs", Component: LogsPage },
      { path: "settings", Component: SettingsPage },
    ],
  },
]);
