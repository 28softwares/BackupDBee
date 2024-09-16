import { existsSync, mkdirSync } from "fs";

export const ensureDirectory = (dirPath: string) => {
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }
  };