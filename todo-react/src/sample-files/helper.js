import fs from "fs";
import { MarkdownParser } from "../util/MarkdownParser.js";

/**
 * Convert Markdown → JSON
 */
export const toJson = (
  from = "./todo.md",
  to = "./out.json"
) => {
  const md = fs.readFileSync(from, "utf-8");
  const json = MarkdownParser.toJson(md);

  fs.writeFileSync(to, JSON.stringify(json, null, 2));
};

/**
 * Convert JSON → Markdown
 */
export const toMd = (
  from = "./todo.json",
  to = "./out.md"
) => {
  const json = JSON.parse(fs.readFileSync(from, "utf-8"));
  const md = MarkdownParser.toMarkdown(json);

  fs.writeFileSync(to, md);
};

// Example usage
toMd("./todo.json", "./todo.md");
// toJson("./todo.md", "./out.json");
