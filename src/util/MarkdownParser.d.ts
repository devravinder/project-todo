const toMarkdown: (obj: JSONObject, depth?: number) => string;
const toJson: (md: string) => JSONObject;

export const MarkdownParser = {
  toJson,
  toMarkdown,
};
