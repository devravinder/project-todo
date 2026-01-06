/* 
Note:- 
1. Headings will be conveted as keys ( sub-heading as nested keys )
2. propeties should be key-value or list
   1. if nested property is required make a sub-heading
   2. after key deletemeter space is mandatory
      - eg:
          1. assignedTo: ravinder -> valid
          2. assignedTo:ravinder -> invalid
      - this is to differentiate urls from keys ( http://google.com )
 

*/

const HEADER_REGEX = /^(#{1,6})\s+(.*)$/;
const PROPERTY_PREFIX = "- ";
const PROPERTY_DELIMETER = ": ";

// Not pure function(side effect)
// Creates/gets the deepest reference
const getOrCreateDeepRef = (root, headingStack) => {
  return headingStack.reduce((acc, key) => {
    if (!acc[key]) acc[key] = {};
    return acc[key];
  }, root);
};

const getRef = (root, headingStack) => {
  return headingStack.reduce((acc, key) => {
    if (!acc[key]) acc[key] = {};
    return acc[key];
  }, root);
};
export const toJson = (md) => {
  const lines = md
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  let root = {};
  let headingStack = []; // index-1 represents the level
  let currentRef = null;

  for (let line of lines) {
    const headerMatch = line.match(HEADER_REGEX);

    if (headerMatch) {
      const level = headerMatch[1].length;
      const title = headerMatch[2].trim();

      headingStack[level - 1] = title;

      headingStack = headingStack.slice(0, level);

      currentRef = getOrCreateDeepRef(root, headingStack);
    } else {
      // property

      if (line.startsWith(PROPERTY_PREFIX)) {
        const [key, value] = line
          .replace(PROPERTY_PREFIX, "")
          .split(PROPERTY_DELIMETER);
        if (value) {
          currentRef[key] = value;
        } else {
          if (!Array.isArray(currentRef)) {
            // change currentRef to [] from {} ( get parent reference & modify )

            const [rest, last] = [
              headingStack.slice(0, headingStack.length - 1),
              headingStack.at(-1),
            ];
            const parentRef = getRef(root, rest);
            parentRef[last] = [];
            currentRef = parentRef[last];
          }
          currentRef.push(key);
        }
      }
    }
  }

  return root;
};

const keys=(obj)=> {
  const stringValues = [];
  const arrayValues = [];
  const objectValues = [];

  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      arrayValues.push(key);
    } else if (value !== null && typeof value === "object") {
      objectValues.push(key)
    } else {
      stringValues.push(key)
    }
  }

  return [
    ...stringValues,
    ...arrayValues,
    ...objectValues,
  ];
}

export const toMarkdown = (obj, depth = 1) => {
  let md = "";

  for (const key of keys(obj)) {
    const value = obj[key];

    if (value && typeof value !== "string") {
      // It's a header
      md += `\n${"#".repeat(depth)} ${key}\n`;

      if(Array.isArray(value) ||  typeof value[Object.keys(value)[0]]==='string')
      md += `\n` // add extra new line for before properties

      md += toMarkdown(value, depth + 1);
    } else if(value){
      let k = key
      const isInteger = Number.isInteger(k++)
      md += `- ${isInteger ? "" : key + ": "}${value || ""}\n`;
    }
  }
  return md;
};

export const MarkdownParser = {
  toJson, toMarkdown
}