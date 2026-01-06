import type { FileError } from "./syncStore";

export const DATE_FORMAT = "DD-MMM-YYYY";
export const FORM_DATE_FORMAT = "YYYY-MM-DD";
export const DB_DATE_FORMAT = "YYYY-MM-DD hh:mm:ss:SSS"

export const defaultConfig: TodoConfig = {
  Statuses: [
    "📝 To Do",
    "🚀 In Progress",
    "👀 In Review",
    "✅ Done",
    "📦 Archives",
  ],
  "Workflow Statuses": {
    CREATE_STATUS: "📝 To Do",
    START_STATUS: "🚀 In Progress",
    END_STATUS: "✅ Done",
    ARCHIVE_STATUS: "📦 Archives",
  },
  Categories: [
    "Frontend",
    "Backend",
    "Design",
    "DevOps",
    "Tests",
    "Documentation",
  ],
  Users: ["Ravinder", "Reddy"],
  Priorities: ["🔴 Critical", "🟠 High", "🟡 Medium", "🟢 Low"],
  "Priority Colors": {
    "🔴 Critical": {
      "text-color": "#991B1B",
      "bg-color": "#e8abab",
    },
    "🟠 High": {
      "text-color": "#a32900",
      "bg-color": "#fdb981",
    },
    "🟡 Medium": {
      "text-color": "#652525",
      "bg-color": "#ffea94",
    },
    "🟢 Low": {
      "text-color": "#166534",
      "bg-color": "#bcfbd2",
    },
  },
  Tags: [
    "#bug",
    "#feature",
    "#ui",
    "#backend",
    "#urgent",
    "#refactor",
    "#docs",
    "#test",
  ],
};

export const welcomeData = {
  header: `Welcome! 👋`,
  subTitle: `Select the folder containing your todo file (todo.md or todo.json)`,

  notes: {
    header: "💡 How does it work?",
    items: [
      `Click "Get Started" above`,
      `Select the folder containing your todo file`,
      `The app automatically loads your task file`,
      `Manage your tasks visually with Kanban`,
      `Changes are saved to todo file`,
    ],
    footer: `⚠️ Supported browsers: Chrome 86+, Edge 86+, Opera 72+`,
  },
};

export const fileErrorMessages: { [Key in FileError["name"]]: string } = {
  NotAllowedError: "Failed to access the file, re-start again",
  AbortError: "Folder selection is cancelled, re-try",
  NotFoundError: "Todo file not found, re-start again",
  BrowserNotSupports:
    "Your browser won't support file changes, change browser settings or use another browser",
};
