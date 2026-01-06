import type { FileError } from "./syncStore";

const MARKDOWN_FILE = "todo.md";
const JSON_FILE = "todo.json";

export type FileHandleResult =
  | {
      handle: FileSystemFileHandle;
    }
  | { error: FileError };

const getHandle = async (
  fileFormat: FileFormat = "md"
): Promise<FileHandleResult> => {
  try {
    if (!("showDirectoryPicker" in window))
      return { error: {name:"BrowserNotSupports", message:"BrowserNotSupports"} };

    const dirHandle = await window?.showDirectoryPicker();

    let hasTodoMd = false;
    let hasTodoJson = false;

    for await (const [name] of dirHandle.entries()) {
      if (name === MARKDOWN_FILE) hasTodoMd = true;
      if (name === JSON_FILE) hasTodoJson = true;
    }

    if (hasTodoMd || hasTodoJson) {
      const handle = await dirHandle.getFileHandle(
        hasTodoMd ? MARKDOWN_FILE : JSON_FILE,
        {
          create: true,
        }
      );

      return { handle };
    } else {
      const handle = await dirHandle.getFileHandle(
        fileFormat === "md" ? MARKDOWN_FILE : JSON_FILE,
        {
          create: true,
        }
      );
      return { handle };
    }
  } catch (e) {
    const error = e as FileError;
    return { error };
  }
};

const write = async (fileHandle: FileSystemFileHandle, content: string) => {
  const writable = await fileHandle.createWritable();
  await writable.write(content);
  await writable.close();
};

const read = async (fileHandle: FileSystemFileHandle): Promise<string> => {
  const file = await fileHandle.getFile();
  const content = await file.text();
  return content;
};

export const FileHandler = { getHandle, write, read };
