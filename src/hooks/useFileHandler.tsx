import { useState } from "react";
import { FileHandler } from "../util/FileHandler";

export default function useFileHandle() {
  const [isOpening, setIsOpening] = useState(false);
  const openFolder = async (fileFormat: FileFormat = "md") => {
    setIsOpening(true);
    const fileHandler = await FileHandler.getHandle(fileFormat);
    setIsOpening(false);

    return fileHandler;
  };

  return { isOpening, openFolder };
}
